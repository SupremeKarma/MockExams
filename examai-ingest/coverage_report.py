"""Unit coverage across extracted papers. NOT prediction.

    python coverage_report.py

With two new-curriculum papers per subject, a unit appearing in both is a
2-of-2 sample. That is not a pattern you can distinguish from a coincidence,
and a student who trusts a wrong "prediction" studies the wrong units before
an exam. So this reports what is measured and always states the sample size:

  * appearance counts per unit, with marks
  * where the marks sit — Group A (long) vs Group B (short)
  * units that appeared in NO paper, which is often the more useful list
  * questions that could not be tagged at all, which is evidence the syllabus
    vocabulary is incomplete rather than something to hide

Prediction becomes defensible at roughly five papers per subject. The counting
is the same either way; only the label would change, and it should not change
until the sample supports it.
"""

import json
import sys
from collections import defaultdict
from pathlib import Path

HERE = Path(__file__).parent
EXTRACTED = HERE / "work" / "extracted"
SCHEMA_DIR = HERE / "schema"


def load_vocab() -> dict:
    """Every generated semester, keyed by subject code — papers from several
    semesters can sit in work/extracted at once."""
    vocab: dict = {}
    for path in sorted(SCHEMA_DIR.glob("units.sem*.json")):
        data = json.loads(path.read_text(encoding="utf-8"))
        for s in data["subjects"]:
            vocab[s["subject_code"]] = {u["unit_id"]: u["title"] for u in s["units"]}
    return vocab


def top_level(paper: dict):
    """Only top-level questions carry the group's marks; sub-parts subdivide
    them, so counting both would double-count."""
    return [q for q in paper.get("questions", []) if isinstance(q, dict)]


def main() -> int:
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    papers = []
    for path in sorted(EXTRACTED.glob("*.json")):
        papers.append(json.loads(path.read_text(encoding="utf-8")))
    if not papers:
        print("no extractions in work/extracted/")
        return 1

    by_subject = defaultdict(list)
    for p in papers:
        by_subject[p.get("subject_code")].append(p)

    vocab = load_vocab()

    print("UNIT COVERAGE — measured appearances, not predictions\n")

    for code in sorted(by_subject):
        subject_papers = sorted(by_subject[code], key=lambda p: p.get("year", 0))
        years = [p.get("year") for p in subject_papers]
        name = subject_papers[0].get("subject_name", "")
        units = vocab.get(code, {})

        print("=" * 72)
        print(f"{code}  {name}")
        print(f"sample: {len(subject_papers)} paper(s) — {years}")
        if len(subject_papers) < 5:
            print(f"NOTE: {len(subject_papers)} papers is too small to predict from. "
                  f"Read these as coverage, not likelihood.")
        print()

        seen = defaultdict(lambda: {"papers": set(), "marks": [], "groups": defaultdict(int)})
        untagged = []

        for p in subject_papers:
            for q in top_level(p):
                tags = q.get("units") or []
                if not tags:
                    untagged.append((p.get("year"), q.get("group"), q.get("number"),
                                     (q.get("text") or "")[:60]))
                    continue
                for t in tags:
                    uid = t.get("unit_id")
                    if not uid:
                        continue
                    rec = seen[uid]
                    rec["papers"].add(p.get("year"))
                    rec["marks"].append(q.get("marks") or 0)
                    rec["groups"][q.get("group")] += 1

        n = len(subject_papers)
        rows = sorted(seen.items(), key=lambda kv: (-len(kv[1]["papers"]), kv[0]))
        if rows:
            print(f"  {'unit':<16} {'seen in':<9} {'marks':<16} {'groups'}")
            for uid, rec in rows:
                marks = ",".join(str(m) for m in sorted(rec["marks"], reverse=True))
                groups = " ".join(f"{g}x{c}" for g, c in sorted(rec["groups"].items()))
                title = units.get(uid, "(not in vocabulary)")
                print(f"  {uid.split('_')[-1]:<16} {len(rec['papers'])}/{n:<7} "
                      f"{marks:<16} {groups}")
                print(f"      {title}")

        never = [u for u in units if u not in seen]
        if never:
            print(f"\n  APPEARED IN NO PAPER ({len(never)} of {len(units)} units):")
            for uid in never:
                print(f"    {uid.split('_')[-1]:<6} {units[uid]}")
            print("    ^ overdue, or simply not sampled yet. With "
                  f"{n} paper(s) these are not 'safe to skip'.")

        if untagged:
            print(f"\n  COULD NOT BE TAGGED ({len(untagged)}):")
            for year, group, num, text in untagged:
                print(f"    {year} {group}{num}: {text}...")
            print("    ^ these questions fit no listed unit. Likely the syllabus")
            print("      vocabulary is incomplete — worth checking against the")
            print("      official unit PDF rather than assuming a bad extraction.")
        print()

    # Mark-weight view: where the heavy marks actually sit.
    print("=" * 72)
    print("MARK WEIGHT BY GROUP (all subjects)\n")
    weight = defaultdict(lambda: defaultdict(int))
    for p in papers:
        for q in top_level(p):
            for t in q.get("units") or []:
                weight[t.get("unit_id")][q.get("group")] += q.get("marks") or 0
    heavy = sorted(weight.items(), key=lambda kv: -sum(kv[1].values()))[:12]
    print(f"  {'unit':<18} {'total marks':<13} by group")
    for uid, groups in heavy:
        total = sum(groups.values())
        detail = " ".join(f"{g}={m}" for g, m in sorted(groups.items()))
        print(f"  {uid:<18} {total:<13} {detail}")
    print("\n  Group A questions are worth 12 each, Group B 8 — a unit that")
    print("  keeps landing in Group A is worth more study time per appearance.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
