"""Identify what each scan actually is, before staging it.

    python identify_pages.py "C:\\path\\to\\VI SEM\\2026"

Filenames in the corpus are unreliable — in VI SEM/2025, `Data Mining_1.jpg`
and `Data Mining_2.jpg` are byte-identical copies of the Simulation paper, and
the real Data Mining pages are the ones the browser renamed to `(1)`. Staging
on filename alone would have produced a "Data Mining" paper full of queuing
theory, which is precisely the plausible-looking wrong result that nothing
downstream would flag.

This reads each image's header with the configured vision provider and reports
subject code, year and page position, plus a duplicate check by content hash.
It writes nothing and stages nothing — it tells you what you have.
"""

import hashlib
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.config import EXTRACTION_PROVIDER, EXTRACTION_MODEL, api_key_for  # noqa: E402
from src.llm import ImagePart, VisionRequest, ProviderError, get_provider  # noqa: E402

SYSTEM = """You identify scanned Purbanchal University BIT exam papers.
Return ONLY a JSON object, no fences, with these keys:
  subject_code   e.g. "BIT353CO", or null if no header is visible
  subject_name   as printed, or null
  year           integer, or null
  curriculum     "new_course" if the header prints "(New Course)", else
                 "old_course", or null if no header
  has_header     true if this page carries the university header block
  page_hint      "first" if it has the header, "continuation" if it starts
                 mid-paper without a header, or "unknown"
  ends_with_contd  true if the page ends with "Contd. ..."
  first_question   the number of the first question visible on this page
  last_question    the number of the last question visible on this page
Read only what is printed. Do not infer the subject from the questions."""


def identify(provider, path: Path) -> dict:
    req = VisionRequest(
        system=SYSTEM,
        text="Identify this scanned page.",
        images=[ImagePart(data=path.read_bytes(), media_type="image/jpeg")],
        max_tokens=1000,
        json_only=True,
    )
    try:
        resp = provider.complete_vision(req)
    except ProviderError as e:
        return {"error": str(e)[:120]}
    try:
        return json.loads(resp.text.strip().strip("`"))
    except json.JSONDecodeError:
        return {"error": f"unparseable: {resp.text[:120]!r}"}


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    folder = Path(sys.argv[1])
    images = sorted(
        p for p in folder.iterdir()
        if p.suffix.lower() in (".jpg", ".jpeg", ".png")
    )
    if not images:
        print(f"no images in {folder}")
        return 1

    # Duplicate detection first — it is free and catches the worst case.
    by_hash: dict[str, list[Path]] = defaultdict(list)
    for p in images:
        by_hash[hashlib.md5(p.read_bytes()).hexdigest()].append(p)
    dupes = {h: ps for h, ps in by_hash.items() if len(ps) > 1}
    if dupes:
        print("BYTE-IDENTICAL FILES (same scan under different names):")
        for ps in dupes.values():
            print("  " + "  ==  ".join(p.name for p in ps))
        print()

    provider = get_provider(
        EXTRACTION_PROVIDER, api_key_for(EXTRACTION_PROVIDER),
        EXTRACTION_MODEL, need="vision",
    )
    print(f"identifying {len(by_hash)} unique image(s) via "
          f"{EXTRACTION_PROVIDER}/{EXTRACTION_MODEL}\n")

    for h, paths in by_hash.items():
        info = identify(provider, paths[0])
        names = " == ".join(p.name for p in paths)
        if "error" in info:
            print(f"  {names}\n      ERROR {info['error']}")
            continue
        print(f"  {names}")
        print(
            f"      {info.get('subject_code')} {info.get('subject_name')!r} "
            f"{info.get('year')} [{info.get('curriculum')}]"
        )
        print(
            f"      {info.get('page_hint')}  Q{info.get('first_question')}"
            f"-Q{info.get('last_question')}"
            f"{'  ends: Contd.' if info.get('ends_with_contd') else ''}"
        )
    return 0


if __name__ == "__main__":
    sys.exit(main())
