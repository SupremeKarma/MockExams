"""Read unit lists out of a syllabus PDF via the vision provider.

    python read_syllabus_units.py <pdf> <first_page> <last_page>

The PDF's text layer is OCR of a photocopy and is badly damaged — "Muttiple
Integrals", "X'unctions of a Complex Variable", and whole units simply absent
(BIT154CO Unit 8 does not appear in the text layer at all). Rendering the page
and reading the image recovers what the text layer lost.

Prints JSON. Writes nothing — the output is reviewed by hand before it goes
into bitSyllabusData.ts, because this feeds the tagging vocabulary and a
wrong unit title there propagates into every coverage count.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

import fitz  # noqa: E402

from src.config import EXTRACTION_PROVIDER, EXTRACTION_MODEL, api_key_for  # noqa: E402
from src.llm import ImagePart, VisionRequest, ProviderError, get_provider  # noqa: E402

SYSTEM = """You are reading a Purbanchal University BIT syllabus page.

Return ONLY JSON:
{"subjects": [{"subject_code": "BIT152CO", "subject_name": "Digital Logic",
               "units": [{"number": 1, "title": "Number Systems", "hours": 5}]}]}

Rules:
- Transcribe unit TITLES exactly as printed, correcting only obvious scanning
  damage in the title itself (a printed "X'unctions" is "Functions").
- Include EVERY unit shown, in order. If a unit number is visible but its
  title is not legible, emit it with title null rather than skipping it — a
  missing unit silently shifts every later number.
- hours is the bracketed figure like [6 Hrs]; null if absent.
- Ignore Course Objective, References, and Laboratory sections.
- A page may contain more than one subject, or continue a subject from the
  previous page. Report what is on this page only."""


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) < 4:
        print(__doc__)
        return 2

    pdf_path, first, last = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    doc = fitz.open(pdf_path)

    images = []
    for page_no in range(first - 1, min(last, len(doc))):
        pix = doc[page_no].get_pixmap(matrix=fitz.Matrix(200 / 72, 200 / 72))
        images.append(ImagePart(data=pix.tobytes("png"), media_type="image/png"))

    provider = get_provider(EXTRACTION_PROVIDER, api_key_for(EXTRACTION_PROVIDER),
                            EXTRACTION_MODEL, need="vision")
    req = VisionRequest(
        system=SYSTEM,
        text=f"Read the syllabus units from these {len(images)} page(s).",
        images=images,
        max_tokens=8000,
        json_only=True,
    )
    try:
        resp = provider.complete_vision(req)
    except ProviderError as e:
        print(f"ERROR: {e}")
        return 1

    data = json.loads(resp.text.strip().strip("`"))
    for subj in data.get("subjects", []):
        units = subj.get("units", [])
        print(f"\n{subj.get('subject_code')}  {subj.get('subject_name')}  "
              f"({len(units)} units)")
        for u in units:
            hrs = f"[{u['hours']}h]" if u.get("hours") else ""
            title = u.get("title") or "*** NOT LEGIBLE ***"
            print(f"   {u.get('number'):>2}. {title} {hrs}")
        print("   keyUnits: " + json.dumps(
            [u.get("title") for u in units], ensure_ascii=False))
    return 0


if __name__ == "__main__":
    sys.exit(main())
