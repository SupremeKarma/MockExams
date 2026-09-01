"""Stage VI SEM scans into input/ under canonical names.

    python stage_corpus.py            # dry run, prints the plan
    python stage_corpus.py --apply

The mapping below was established by identify_pages.py reading each header,
NOT by trusting filenames. Two traps it avoids:

  * 2025 `Data Mining_1.jpg` / `Data Mining_2.jpg` are byte-identical copies of
    the SIMULATION paper. The real Data Mining pages are the `(1)` files the
    browser renamed on a second download.
  * 2026 `AI 1 .jpg` is page TWO of the AI paper, not page one.

Only new-curriculum (2025, 2026) sem-6 papers are staged. The 2018-2022 scans
are old-curriculum subjects — AOOP, Embedded Systems, Research — and their
unit counts must never be pooled with these.
"""

import shutil
import sys
from pathlib import Path

CORPUS = Path(r"C:\Users\AMANM\OneDrive\Documents\BIT\BIT 6TH Semester\VI SEM")
INPUT = Path(__file__).parent / "input"

# (year, source filename, subject_code, page number)
PLAN = [
    (2025, "AI_1.jpg",              "BIT351CO", 1),
    (2025, "AI_2.jpg",              "BIT351CO", 2),
    (2025, "Data Mining_1 (1).jpg", "BIT353CO", 1),
    (2025, "Data Mining_2 (1).jpg", "BIT353CO", 2),
    (2025, "Simulation_1.jpg",      "BIT354CO", 1),
    (2025, "Simulation_2.jpg",      "BIT354CO", 2),
    (2025, "MIS.jpg",               "BIT352CO", 1),
    (2025, "SE.jpg",                "BIT355CO", 1),

    (2026, "AI .jpg",               "BIT351CO", 1),
    (2026, "AI 1 .jpg",             "BIT351CO", 2),
    (2026, "Data Mining.jpg",       "BIT353CO", 1),
    (2026, "Data Mining 1.jpg",     "BIT353CO", 2),
    (2026, "Simulation.jpg",        "BIT354CO", 1),
    (2026, "simulation 2.jpg",      "BIT354CO", 2),
    (2026, "MIS.jpg",               "BIT352CO", 1),
    (2026, "SE .jpg",               "BIT355CO", 1),
]

# Papers identify_pages.py reported as a single page with no "Contd." marker.
# Recorded so a one-page paper is a known fact rather than a silent gap.
SINGLE_PAGE_EXPECTED = {"BIT352CO_2025", "BIT355CO_2025", "BIT352CO_2026", "BIT355CO_2026"}


def main() -> int:
    apply = "--apply" in sys.argv
    INPUT.mkdir(exist_ok=True)

    missing = []
    for year, name, code, page in PLAN:
        src = CORPUS / str(year) / name
        dst = INPUT / f"{code}_{year}_regular_p{page}.jpg"
        if not src.exists():
            missing.append(str(src))
            print(f"MISSING  {src}")
            continue
        print(f"{'copy' if apply else 'plan'}  {year}/{name}  ->  {dst.name}")
        if apply:
            shutil.copy2(src, dst)

    papers = {f"{c}_{y}" for y, _, c, _ in PLAN}
    print(f"\n{len(PLAN)} pages across {len(papers)} papers")
    print(f"single-page by design: {sorted(SINGLE_PAGE_EXPECTED)}")
    if missing:
        print(f"\n{len(missing)} source file(s) missing — staging is incomplete")
        return 1
    if not apply:
        print("\ndry run — pass --apply to copy")
    return 0


if __name__ == "__main__":
    sys.exit(main())
