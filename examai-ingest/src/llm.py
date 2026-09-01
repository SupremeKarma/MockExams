"""Provider adapter — one internal request shape, providers behind it.

The pipeline used to pin a single Anthropic model in config.py, so changing
provider meant editing call sites. This module is the boundary from the
platform plan: callers build a `VisionRequest` or `TextRequest` and never see
a provider's wire format, so "extraction on Gemini, generation on DeepSeek,
Anthropic for the bad scans" is configuration rather than a rewrite.

Capabilities are declared, not assumed. DeepSeek has no vision, so asking it to
extract raises immediately with a readable reason instead of failing somewhere
downstream with a confusing error.

Only the Anthropic path needs an SDK; Gemini and DeepSeek are plain REST over
the standard library, which keeps this dependency-light.

WHY THIS EXISTS ALONGSIDE SUPREME AI'S ROUTER — read before merging them
-----------------------------------------------------------------------
The Supreme AI platform plan specifies exactly one model router, on the
server, and this is a second one. That is deliberate, not drift, because the
two serve different clocks:

  * This router runs at BUILD TIME. It is offline tooling on a developer's
    machine, processing a fixed corpus of scans into JSON. It runs a handful
    of times, costs cents, and its failure mode is "re-run it".
  * Supreme AI's router runs PER REQUEST in production, under a credit ledger,
    with latency and availability that a student is waiting on.

Collapsing this into the platform router would make offline ingestion depend
on a service that is not hosted yet — the pipeline would stop working the
moment the server was down, for no benefit, since nothing here is
user-facing. It would also put a build-time tool inside the request path's
blast radius.

The boundary is: anything a STUDENT waits on goes through Supreme AI. Anything
that turns raw scans into stored artefacts can run here. Solution *generation*
sits on the line — it is batch and offline today, but the answers it produces
are served to students, so when it moves to the server this router should not
follow it.

Two routers with a stated boundary is a decision. Two routers nobody wrote
down is an accident. If you are reading this while merging them, check first
that Supreme AI is actually hosted and that build-time tooling depending on it
is acceptable.
"""

from __future__ import annotations

import base64
import json
import urllib.error
import urllib.request
from dataclasses import dataclass, field
from typing import Literal

Capability = Literal["vision", "text"]


@dataclass
class ImagePart:
    data: bytes
    media_type: str = "image/png"

    def b64(self) -> str:
        return base64.standard_b64encode(self.data).decode("utf-8")


@dataclass
class VisionRequest:
    """Images plus an instruction. Used by extraction."""
    system: str
    text: str
    images: list[ImagePart]
    max_tokens: int = 8192
    json_only: bool = True


@dataclass
class TextRequest:
    """Text in, text out. Used by solution generation."""
    system: str
    text: str
    max_tokens: int = 8192
    json_only: bool = False


@dataclass
class LLMResponse:
    text: str
    provider: str
    model: str
    usage: dict = field(default_factory=dict)


class ProviderError(RuntimeError):
    pass


def _post_json(url: str, payload: dict, headers: dict, timeout: int = 180) -> dict:
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers=headers, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="replace")[:600]
        raise ProviderError(f"HTTP {e.code}: {detail}") from e
    except urllib.error.URLError as e:
        raise ProviderError(f"network error: {e.reason}") from e


# ---------------------------------------------------------------------------
# Providers
# ---------------------------------------------------------------------------

class Provider:
    name: str = ""
    capabilities: tuple[Capability, ...] = ()

    def __init__(self, api_key: str, model: str):
        if not api_key:
            raise ProviderError(f"{self.name}: no API key configured")
        self.api_key = api_key
        self.model = model

    def supports(self, cap: Capability) -> bool:
        return cap in self.capabilities

    def complete_vision(self, req: VisionRequest) -> LLMResponse:
        raise ProviderError(f"{self.name} cannot read images")

    def complete_text(self, req: TextRequest) -> LLMResponse:
        raise ProviderError(f"{self.name} cannot generate text")


class GeminiProvider(Provider):
    """Google Gemini via the generativelanguage REST API.

    Gemini's vision shape differs from Anthropic's in three ways that matter
    here: images are `inline_data` parts (not `source`), the system prompt is a
    separate `system_instruction` object rather than a top-level string, and
    `responseMimeType: application/json` genuinely constrains the output — so
    the "no markdown fences" instruction stops being a request the model can
    ignore.
    """

    name = "gemini"
    capabilities = ("vision", "text")
    BASE = "https://generativelanguage.googleapis.com/v1beta/models"

    def _generate(self, parts: list[dict], system: str, max_tokens: int, json_only: bool) -> LLMResponse:
        gen_cfg: dict = {"maxOutputTokens": max_tokens}
        if json_only:
            gen_cfg["responseMimeType"] = "application/json"

        payload = {
            "system_instruction": {"parts": [{"text": system}]},
            "contents": [{"role": "user", "parts": parts}],
            "generationConfig": gen_cfg,
        }
        url = f"{self.BASE}/{self.model}:generateContent?key={self.api_key}"
        data = _post_json(url, payload, {"Content-Type": "application/json"})

        candidates = data.get("candidates") or []
        if not candidates:
            raise ProviderError(f"gemini returned no candidates: {json.dumps(data)[:400]}")

        cand = candidates[0]
        finish = cand.get("finishReason")
        text = "".join(
            p.get("text", "") for p in (cand.get("content", {}).get("parts") or [])
        )
        if not text:
            raise ProviderError(
                f"gemini returned empty text (finishReason={finish}). "
                "MAX_TOKENS here usually means the paper needs a higher max_tokens; "
                "SAFETY means the scan tripped a filter."
            )
        um = data.get("usageMetadata", {})
        return LLMResponse(
            text=text,
            provider=self.name,
            model=self.model,
            usage={
                "input_tokens": um.get("promptTokenCount"),
                "output_tokens": um.get("candidatesTokenCount"),
                "finish_reason": finish,
            },
        )

    def complete_vision(self, req: VisionRequest) -> LLMResponse:
        parts: list[dict] = [
            {"inline_data": {"mime_type": img.media_type, "data": img.b64()}}
            for img in req.images
        ]
        parts.append({"text": req.text})
        return self._generate(parts, req.system, req.max_tokens, req.json_only)

    def complete_text(self, req: TextRequest) -> LLMResponse:
        return self._generate([{"text": req.text}], req.system, req.max_tokens, req.json_only)


class DeepSeekProvider(Provider):
    """DeepSeek via its OpenAI-compatible endpoint. Text only — no vision."""

    name = "deepseek"
    capabilities = ("text",)
    URL = "https://api.deepseek.com/chat/completions"

    def complete_text(self, req: TextRequest) -> LLMResponse:
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": req.system},
                {"role": "user", "content": req.text},
            ],
            "max_tokens": req.max_tokens,
        }
        if req.json_only:
            payload["response_format"] = {"type": "json_object"}
        data = _post_json(
            self.URL,
            payload,
            {"Content-Type": "application/json", "Authorization": f"Bearer {self.api_key}"},
        )
        choices = data.get("choices") or []
        if not choices:
            raise ProviderError(f"deepseek returned no choices: {json.dumps(data)[:400]}")
        usage = data.get("usage", {})
        return LLMResponse(
            text=choices[0]["message"]["content"],
            provider=self.name,
            model=self.model,
            usage={
                "input_tokens": usage.get("prompt_tokens"),
                "output_tokens": usage.get("completion_tokens"),
                "finish_reason": choices[0].get("finish_reason"),
            },
        )

    def complete_vision(self, req: VisionRequest) -> LLMResponse:
        raise ProviderError(
            "deepseek has no vision capability — it cannot extract from scans. "
            "Use gemini or anthropic for extraction; deepseek is for solution "
            "generation from text."
        )


class AnthropicProvider(Provider):
    """Anthropic via the official SDK. Kept as the fallback for bad scans."""

    name = "anthropic"
    capabilities = ("vision", "text")

    def _client(self):
        try:
            import anthropic
        except ImportError as e:
            raise ProviderError("anthropic SDK not installed: pip install anthropic") from e
        return anthropic.Anthropic(api_key=self.api_key)

    def _message(self, content: list[dict], system: str, max_tokens: int) -> LLMResponse:
        client = self._client()
        msg = client.messages.create(
            model=self.model,
            max_tokens=max_tokens,
            system=system,
            messages=[{"role": "user", "content": content}],
        )
        text = "".join(b.text for b in msg.content if getattr(b, "type", None) == "text")
        return LLMResponse(
            text=text,
            provider=self.name,
            model=self.model,
            usage={
                "input_tokens": msg.usage.input_tokens,
                "output_tokens": msg.usage.output_tokens,
                "finish_reason": msg.stop_reason,
            },
        )

    def complete_vision(self, req: VisionRequest) -> LLMResponse:
        content: list[dict] = [
            {
                "type": "image",
                "source": {"type": "base64", "media_type": img.media_type, "data": img.b64()},
            }
            for img in req.images
        ]
        content.append({"type": "text", "text": req.text})
        return self._message(content, req.system, req.max_tokens)

    def complete_text(self, req: TextRequest) -> LLMResponse:
        return self._message([{"type": "text", "text": req.text}], req.system, req.max_tokens)


PROVIDERS: dict[str, type[Provider]] = {
    "gemini": GeminiProvider,
    "deepseek": DeepSeekProvider,
    "anthropic": AnthropicProvider,
}


def get_provider(name: str, api_key: str, model: str, need: Capability) -> Provider:
    """Build a provider and fail loudly if it cannot do the job asked of it."""
    cls = PROVIDERS.get(name)
    if cls is None:
        raise ProviderError(
            f"unknown provider {name!r}; choose one of {sorted(PROVIDERS)}"
        )
    provider = cls(api_key=api_key, model=model)
    if not provider.supports(need):
        raise ProviderError(
            f"provider {name!r} does not support {need!r} "
            f"(it supports: {', '.join(cls.capabilities) or 'nothing'})"
        )
    return provider
