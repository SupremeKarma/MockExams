"""Configuration. Every model name and key comes from the environment.

Three model roles, because the stages have genuinely different needs and paying
strong-model prices for OCR across a 17-paper corpus is how this gets expensive
for no quality gain:

  MODEL_OCR    vision, cheap   — reading scanned pages. High volume, low
                                 reasoning. Gemini Flash's
                                 responseMimeType=application/json actually
                                 constrains the output instead of asking the
                                 model nicely for clean JSON.
  MODEL_SOLVE  strong          — writing solutions a student will memorise.
                                 The one place quality is worth paying for.
  MODEL_CHEAP  cheap           — tagging, classification, variant generation.

Keys resolve from examai-api/.env first, then the MockExams root .env.local,
which is where GEMINI_API_KEY already lives. No key is copied around to make
this work.
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv

_HERE = Path(__file__).resolve().parent.parent
_REPO_ROOT = _HERE.parent

load_dotenv(_HERE / ".env")
load_dotenv(_REPO_ROOT / ".env.local", override=False)

# --- Providers and models ---------------------------------------------------

MODEL_OCR_PROVIDER = os.getenv("MODEL_OCR_PROVIDER", "gemini")
MODEL_OCR = os.getenv("MODEL_OCR", "gemini-2.5-flash")

MODEL_SOLVE_PROVIDER = os.getenv("MODEL_SOLVE_PROVIDER", "gemini")
MODEL_SOLVE = os.getenv("MODEL_SOLVE", "gemini-2.5-pro")

MODEL_CHEAP_PROVIDER = os.getenv("MODEL_CHEAP_PROVIDER", "gemini")
MODEL_CHEAP = os.getenv("MODEL_CHEAP", "gemini-2.5-flash")

# --- Keys -------------------------------------------------------------------

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

_KEYS = {
    "anthropic": ANTHROPIC_API_KEY,
    "gemini": GEMINI_API_KEY,
    "deepseek": DEEPSEEK_API_KEY,
}

# Values that must not be treated as configured. A shipped .env once carried
# ANTHROPIC_API_KEY=sk-test..., which produced a 401 that read like a
# permissions problem rather than "this was never set".
_PLACEHOLDERS = ("sk-test", "your-", "changeme", "xxx")


def api_key_for(provider: str) -> str:
    key = (_KEYS.get(provider) or "").strip()
    if not key or key.lower().startswith(_PLACEHOLDERS):
        raise ValueError(
            f"No usable API key for provider {provider!r}. Set "
            f"{provider.upper()}_API_KEY in examai-api/.env (or the MockExams "
            f"root .env.local). Current value is "
            f"{'missing' if not key else 'a placeholder'}."
        )
    return key


# --- Firebase ---------------------------------------------------------------

FIREBASE_PROJECT_ID = os.getenv("FIREBASE_PROJECT_ID")
FIREBASE_CLIENT_EMAIL = os.getenv("FIREBASE_CLIENT_EMAIL")
FIREBASE_PRIVATE_KEY = os.getenv("FIREBASE_PRIVATE_KEY")
FIREBASE_STORAGE_BUCKET = os.getenv("FIREBASE_STORAGE_BUCKET")
# Path to a service account JSON, as an alternative to the three vars above.
GOOGLE_APPLICATION_CREDENTIALS = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

# --- Service ----------------------------------------------------------------

# Shared secret between the Next.js API routes and this worker. The worker has
# Admin SDK credentials and can write any paper, so it must never be reachable
# without it — the Next routes do the Firebase role check and then call here.
INTERNAL_API_KEY = os.getenv("EXAMAI_INTERNAL_API_KEY")

PROMPTS_DIR = Path(os.getenv("EXAMAI_PROMPTS_DIR", _REPO_ROOT / "prompts"))
SCHEMA_DIR = Path(os.getenv("EXAMAI_SCHEMA_DIR", _REPO_ROOT / "examai-ingest" / "schema"))

# How many questions of one paper may be in flight at once. Small on purpose:
# these are per-paper batches, and a burst of concurrent calls buys little
# wall-clock time while making rate-limit errors much likelier.
STAGE_CONCURRENCY = int(os.getenv("EXAMAI_STAGE_CONCURRENCY", "4"))

# Whole papers with sub-parts overflow 4096 output tokens. A truncated response
# arrives as unparseable JSON, which reads like a model failure rather than a
# limit — so this is generous by default.
EXTRACT_MAX_TOKENS = int(os.getenv("EXAMAI_EXTRACT_MAX_TOKENS", "16000"))

# --- Cost bookkeeping -------------------------------------------------------

# USD per million tokens, so the admin screen can show what a paper cost.
# Approximate and deliberately overridable: published prices change, and a
# stale constant silently understates the bill.
def _price(var: str, default: float) -> float:
    try:
        return float(os.getenv(var, default))
    except ValueError:
        return default


PRICE_PER_MTOK_IN = _price("EXAMAI_PRICE_IN", 0.30)
PRICE_PER_MTOK_OUT = _price("EXAMAI_PRICE_OUT", 2.50)


def estimate_cost_usd(input_tokens: int | None, output_tokens: int | None) -> float:
    """Best-effort cost for one call. Zero when the provider reported nothing."""
    tin = input_tokens or 0
    tout = output_tokens or 0
    return (tin * PRICE_PER_MTOK_IN + tout * PRICE_PER_MTOK_OUT) / 1_000_000
