#!/usr/bin/env python
"""
ExamAI Pipeline Runner — Execute all 4 phases in sequence.
"""

import sys
import subprocess
from pathlib import Path


def run_phase(phase_num, module_name, description):
    """Run one phase. Return True if successful."""
    print(f"\n{'='*60}")
    print(f"Phase {phase_num}: {description}")
    print(f"{'='*60}\n")

    try:
        result = subprocess.run(
            [sys.executable, "-m", module_name],
            cwd=Path(__file__).parent,
            check=False
        )
        return result.returncode == 0
    except Exception as e:
        print(f"ERROR: Failed to run {module_name}: {e}")
        return False


def main():
    """Run all 4 phases."""
    print("\n" + "="*60)
    print("ExamAI Past Paper Ingestion Pipeline")
    print("="*60)

    phases = [
        (1, "src.p1_prepare", "Prepare — Normalize all images"),
        (2, "src.p2_extract", "Extract — Vision API question extraction"),
        (3, "src.p3_cluster", "Cluster — Semantic grouping"),
        (4, "src.p4_report", "Report — Generate study guides"),
    ]

    results = []
    for phase_num, module, desc in phases:
        success = run_phase(phase_num, module, desc)
        results.append((phase_num, desc, success))

    # Summary
    print(f"\n{'='*60}")
    print("Summary")
    print(f"{'='*60}\n")

    for phase_num, desc, success in results:
        status = "OK" if success else "FAILED"
        print(f"Phase {phase_num}: {status} — {desc}")

    all_ok = all(r[2] for r in results)
    if all_ok:
        print("\nAll phases completed successfully!")
        return 0
    else:
        print("\nSome phases failed. Check output above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
