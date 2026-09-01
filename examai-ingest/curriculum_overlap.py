"""Can old-curriculum papers be pooled with new ones for a given subject?

    python curriculum_overlap.py "<image>" BIT353CO

Old sem-6 papers (2018-2022) are different subjects under different codes —
BIT371CO Data Mining & Data Warehousing, not BIT353CO Data Warehousing and
Mining. The names overlap; the question is whether the CONTENT does closely
enough that the old papers add real signal to a 2-paper sample.

This asks the model to place each question from an old paper against the new
subject's syllabus units, and to say plainly when a question has no home. The
answer is the fit rate, not a vibe: a high rate means the old papers are worth
pooling at unit level, a low one means they are practice material only.

Writes nothing. This is a decision aid, not a pipeline stage.
"""

import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from src.config import EXTRACTION_PROVIDER, EXTRACTION_MODEL, api_key_for  # noqa: E402
from src.llm import ImagePart, VisionRequest, ProviderError, get_provider  # noqa: E402

SYSTEM = """You are comparing an OLD-curriculum Purbanchal University BIT exam
paper against the unit list of a DIFFERENT, current subject, to decide whether
the old paper's questions can be counted towards the current syllabus.

Return ONLY JSON:
{
  "old_subject_code": "...",
  "old_subject_name": "...",
  "year": 0,
  "questions": [
    {"number": "1", "text_start": "first 60 chars",
     "unit_id": "BIT353CO_U03" or null,
     "fit": "clear" | "partial" | "none",
     "why": "one short clause"}
  ]
}

Rules:
- Judge on CONTENT, not on the subject name. The names deliberately overlap.
- "clear": the question would be at home in that unit as written.
- "partial": same broad topic, but the unit's emphasis or depth differs.
- "none": no unit covers it. Use this freely — a wrong mapping is worse than
  an admitted gap, because it would inflate a frequency count that a student
  uses to decide what to study.
- Every printed question gets an entry, including sub-parts merged into their
  parent."""


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    if len(sys.argv) < 3:
        print(__doc__)
        return 2

    image_path = Path(sys.argv[1])
    target = sys.argv[2]

    vocab = json.loads((Path(__file__).parent / "schema" / "units.sem6.json")
                       .read_text(encoding="utf-8"))
    subject = next((s for s in vocab["subjects"] if s["subject_code"] == target), None)
    if subject is None:
        print(f"{target} not in units.sem6.json")
        return 1

    unit_lines = "\n".join(f'  {u["unit_id"]}: {u["title"]}' for u in subject["units"])
    provider = get_provider(EXTRACTION_PROVIDER, api_key_for(EXTRACTION_PROVIDER),
                            EXTRACTION_MODEL, need="vision")

    req = VisionRequest(
        system=SYSTEM,
        text=(
            f"Target subject: {target} — {subject['subject_name']}\n"
            f"Its syllabus units:\n{unit_lines}\n\n"
            "Map each question on this old paper onto those units."
        ),
        images=[ImagePart(data=image_path.read_bytes(), media_type="image/jpeg")],
        max_tokens=8000,
        json_only=True,
    )
    try:
        resp = provider.complete_vision(req)
    except ProviderError as e:
        print(f"ERROR: {e}")
        return 1

    data = json.loads(resp.text.strip().strip("`"))
    qs = data.get("questions", [])
    counts = {"clear": 0, "partial": 0, "none": 0}
    for q in qs:
        counts[q.get("fit", "none")] = counts.get(q.get("fit", "none"), 0) + 1

    print(f"{data.get('old_subject_code')} {data.get('old_subject_name')!r} "
          f"{data.get('year')}  ->  {target} {subject['subject_name']!r}\n")
    for q in qs:
        unit = (q.get("unit_id") or "-").split("_")[-1]
        print(f"  Q{str(q.get('number')):<4} {q.get('fit'):<8} {unit:<6} "
              f"{str(q.get('text_start'))[:52]}")
        if q.get("why"):
            print(f"        {q['why']}")

    total = len(qs) or 1
    clear_pct = 100 * counts.get("clear", 0) / total
    usable_pct = 100 * (counts.get("clear", 0) + counts.get("partial", 0)) / total
    print(f"\n  {len(qs)} questions: {counts.get('clear',0)} clear, "
          f"{counts.get('partial',0)} partial, {counts.get('none',0)} none")
    print(f"  clear fit {clear_pct:.0f}%   clear+partial {usable_pct:.0f}%")
    print()
    if clear_pct >= 70:
        print("  VERDICT: content overlaps enough to pool at unit level — but")
        print("  keep old and new tagged separately so the split stays visible.")
    elif usable_pct >= 70:
        print("  VERDICT: same topics, different emphasis. Useful as PRACTICE,")
        print("  not sound to pool into frequency counts.")
    else:
        print("  VERDICT: different course. Practice material only; pooling")
        print("  would corrupt the counts.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
