"""Compare an extraction against the hand-transcribed golden reference.

    python compare_to_reference.py work/extracted/BIT351CO_2025_regular.json

The golden reference (schema/example.BIT351CO_2025_regular.json) was
transcribed by hand from the scans. This tells you where the extractor
diverges from a known-correct answer, which is more useful than guessing at
what might be broken.
"""

import json
import sys
from pathlib import Path

HERE = Path(__file__).parent
REFERENCE = HERE / "schema" / "example.BIT351CO_2025_regular.json"


def norm(s):
    """Loose text comparison: whitespace and case only."""
    return " ".join(str(s or "").split()).lower()


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    target = Path(sys.argv[1]) if len(sys.argv) > 1 else (
        HERE / "work" / "extracted" / "BIT351CO_2025_regular.json"
    )
    if not target.exists():
        print(f"no extraction at {target}")
        return 2

    got = json.loads(target.read_text(encoding="utf-8"))
    ref = json.loads(REFERENCE.read_text(encoding="utf-8"))

    print(f"comparing {target.name} against the hand-transcribed reference\n")

    print("HEADER")
    for k in ("subject_code", "subject_name", "semester", "year", "exam_type", "full_marks"):
        g, r = got.get(k), ref.get(k)
        print(f"  {'OK  ' if g == r else 'DIFF'} {k:14} got={g!r} ref={r!r}")
    for k in ("curriculum", "pass_marks", "duration_hours", "groups", "coverage"):
        print(f"  {'MISS' if k not in got else 'OK  '} {k}")

    ref_q = {q["number"]: q for q in ref["questions"]}
    got_q = {str(q.get("number")): q for q in got.get("questions", [])}

    print(f"\nQUESTION COUNT  got={len(got_q)} ref={len(ref_q)}")
    missing = sorted(set(ref_q) - set(got_q), key=lambda x: (len(x), x))
    extra = sorted(set(got_q) - set(ref_q), key=lambda x: (len(x), x))
    if missing:
        print(f"  missing from extraction: {missing}")
    if extra:
        print(f"  not in reference:        {extra}")

    print("\nPER QUESTION")
    for num in sorted(ref_q, key=lambda x: (len(x), x)):
        r = ref_q[num]
        g = got_q.get(num)
        if g is None:
            print(f"  {num:<4} MISSING")
            continue
        flags = []
        if g.get("group") != r.get("group"):
            flags.append(f"group {g.get('group')!r}!={r.get('group')!r}")
        if g.get("marks") != r.get("marks"):
            flags.append(f"marks {g.get('marks')}!={r.get('marks')}")
        if g.get("text") is None:
            flags.append("text=null")
        elif norm(g.get("text"))[:60] != norm(r.get("text"))[:60]:
            flags.append("text differs")
        sp = g.get("sub_parts")
        if sp and not all(isinstance(x, dict) for x in sp):
            flags.append(f"sub_parts are {type(sp[0]).__name__}, not objects")
        ref_sp = len([x for x in (r.get("sub_parts") or [])])
        if ref_sp and not sp:
            flags.append(f"lost {ref_sp} sub-part(s)")
        conf = g.get("confidence")
        if conf != "high":
            flags.append(f"confidence={conf}")
        print(f"  {num:<4} {'OK' if not flags else '; '.join(flags)}")

    print("\nSCHEMA FIELDS ABSENT FROM EVERY EXTRACTED QUESTION")
    for field in ("units", "question_type", "needs_review", "marking_scheme", "source_page"):
        if not any(field in q for q in got.get("questions", [])):
            print(f"  {field}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
