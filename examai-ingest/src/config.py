import os
from pathlib import Path
from dotenv import load_dotenv

_HERE = Path(__file__).parent.parent

# examai-ingest/.env first, then the MockExams root .env.local, which is where
# GEMINI_API_KEY already lives. Same project, existing location — no key gets
# copied around to make this work.
load_dotenv(_HERE / ".env")
load_dotenv(_HERE.parent / ".env.local", override=False)

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# ── Provider selection ────────────────────────────────────────────────────────
# One internal call shape, providers behind it (see src/llm.py), so swapping
# extraction to a different provider is configuration rather than a rewrite.
#
# Extraction defaults to Gemini Flash: reading scanned pages is high-volume and
# low-reasoning, which is what the Flash tier is for, and its
# responseMimeType=application/json actually constrains the output instead of
# asking the model nicely for clean JSON.
#
# Generation defaults to Gemini only because no DEEPSEEK_API_KEY is configured.
# DeepSeek is the intended choice — cheap and good at showing working, which
# matters most for the numerical questions — so set DEEPSEEK_API_KEY and
# GENERATION_PROVIDER=deepseek to switch. It has NO vision and so can never be
# the extraction provider; llm.py refuses that combination outright rather than
# failing confusingly later.
EXTRACTION_PROVIDER = os.getenv("EXTRACTION_PROVIDER", "gemini")
EXTRACTION_MODEL = os.getenv("EXTRACTION_MODEL", "gemini-2.5-flash")

GENERATION_PROVIDER = os.getenv("GENERATION_PROVIDER", "gemini")
GENERATION_MODEL = os.getenv("GENERATION_MODEL", "gemini-2.5-flash")

_KEYS = {
    "anthropic": ANTHROPIC_API_KEY,
    "gemini": GEMINI_API_KEY,
    "deepseek": DEEPSEEK_API_KEY,
}

# Placeholder values that must not be treated as configured. The shipped .env
# carried ANTHROPIC_API_KEY=sk-test..., which produced a 401 that read like a
# permissions problem rather than "this was never set".
_PLACEHOLDERS = ("sk-test", "your-", "changeme", "xxx")


def api_key_for(provider: str) -> str:
    key = (_KEYS.get(provider) or "").strip()
    if not key or key.lower().startswith(_PLACEHOLDERS):
        raise ValueError(
            f"No usable API key for provider {provider!r}. Set "
            f"{provider.upper()}_API_KEY in examai-ingest/.env (or the MockExams "
            f"root .env.local). Current value is "
            f"{'missing' if not key else 'a placeholder'}."
        )
    return key

# Project root and directory paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "input"
WORK_DIR = PROJECT_ROOT / "work"
PAGES_DIR = WORK_DIR / "pages"
EXTRACTED_DIR = WORK_DIR / "extracted"
CLUSTERS_DIR = WORK_DIR / "clusters"
OUTPUT_DIR = PROJECT_ROOT / "output"

# Create directories if they don't exist
for directory in [INPUT_DIR, PAGES_DIR, EXTRACTED_DIR, CLUSTERS_DIR, OUTPUT_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Deprecated single pin, kept only so any old import still resolves. The
# pipeline now reads EXTRACTION_PROVIDER/EXTRACTION_MODEL above; if you find
# something using MODEL, point it at the adapter instead.
MODEL = EXTRACTION_MODEL

MAX_IMAGE_SIZE = 2000  # Max pixels on longest edge
