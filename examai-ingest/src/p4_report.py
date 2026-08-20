"""
Phase 4: Generate markdown priority reports from clusters.
- Produces one report per subject
- Organizes by frequency tiers
- Includes low-confidence extraction warnings
"""

import json
from pathlib import Path

from src.config import CLUSTERS_DIR, EXTRACTED_DIR, OUTPUT_DIR


def load_clusters():
    """Load all cluster JSON files. Return dict of subject_code -> data."""
    clusters = {}
    if not CLUSTERS_DIR.exists():
        return clusters

    for json_file in CLUSTERS_DIR.glob("*.json"):
        try:
            data = json.loads(json_file.read_text())
            subject_code = data.get("subject_code")
            clusters[subject_code] = data
        except json.JSONDecodeError:
            print(f"WARNING: Could not parse {json_file.name}, skipping")

    return clusters


def load_low_confidence_questions():
    """Load all questions with low confidence from extracted papers.
    Return dict of subject_code -> list of low-confidence question info."""
    low_conf = {}

    if not EXTRACTED_DIR.exists():
        return low_conf

    for json_file in EXTRACTED_DIR.glob("*.json"):
        try:
            data = json.loads(json_file.read_text())
            subject_code = data.get("subject_code")
            paper_id = data.get("paper_id")
            year = data.get("year")

            if subject_code not in low_conf:
                low_conf[subject_code] = []

            for q in data.get("questions", []):
                if q.get("confidence") == "low":
                    group = q.get("group") or "?"
                    number = q.get("number") or "?"
                    text_preview = q.get("text", "")[:60] if q.get("text") else "(no text)"
                    low_conf[subject_code].append({
                        "paper_id": paper_id,
                        "year": year,
                        "group": group,
                        "number": number,
                        "text_preview": text_preview,
                    })
        except json.JSONDecodeError:
            continue

    return low_conf


def generate_report(cluster_data, low_conf_questions):
    """Generate markdown report for one subject. Return markdown string."""
    subject_code = cluster_data.get("subject_code", "UNKNOWN")
    subject_name = cluster_data.get("subject_name", "Unknown Subject")
    years = cluster_data.get("years", [])
    papers_ingested = cluster_data.get("papers_ingested", [])
    clusters = cluster_data.get("clusters", [])

    # Build report
    lines = []
    lines.append(f"# {subject_name} ({subject_code}) — Study Priority")
    lines.append("")

    # Summary
    if years:
        year_str = ", ".join(map(str, years))
        lines.append(f"Papers ingested: {year_str} ({len(papers_ingested)} papers, {sum(len(c.get('occurrences', [])) for c in clusters)} questions, {len(clusters)} unique)")
    lines.append("")

    # Group by frequency tier
    tier_1 = [c for c in clusters if c.get("frequency", 0) >= 3]
    tier_2 = [c for c in clusters if c.get("frequency", 0) == 2]
    tier_3 = [c for c in clusters if c.get("frequency", 0) == 1]

    # Tier 1
    if tier_1:
        lines.append("## Tier 1 — appeared 3+ times")
        lines.append("")
        for idx, cluster in enumerate(tier_1, 1):
            lines.append(f"### {idx}. {cluster.get('canonical_text', '')}")
            lines.append("")

            topic = cluster.get("topic", "")
            occurrences = cluster.get("occurrences", [])
            occurrence_str = ", ".join(
                f"{o.get('year')} ({o.get('group') or '?'}, {o.get('marks') or '?'}m)"
                for o in occurrences
            )

            lines.append(f"**Topic:** {topic} · **Seen:** {occurrence_str}")
            lines.append(f"**Priority score:** {cluster.get('priority_score', 0)}")
            lines.append("")

    # Tier 2
    if tier_2:
        lines.append("## Tier 2 — appeared twice")
        lines.append("")
        for idx, cluster in enumerate(tier_2, 1):
            topic = cluster.get("topic", "")
            occurrences = cluster.get("occurrences", [])
            occurrence_str = ", ".join(
                f"{o.get('year')} ({o.get('group') or '?'}, {o.get('marks') or '?'}m)"
                for o in occurrences
            )
            lines.append(f"- **{cluster.get('canonical_text', '')}** (Topic: {topic}, Score: {cluster.get('priority_score', 0)}, Seen: {occurrence_str})")

        lines.append("")

    # Tier 3
    if tier_3:
        lines.append("## Tier 3 — appeared once")
        lines.append("")
        lines.append("_Listed compactly for reference._")
        lines.append("")
        for cluster in tier_3:
            topic = cluster.get("topic", "")
            score = cluster.get("priority_score", 0)
            lines.append(f"- {cluster.get('canonical_text', '')} (Topic: {topic}, Score: {score})")

        lines.append("")

    # Low-confidence warnings
    low_conf = low_conf_questions.get(subject_code, [])
    if low_conf:
        lines.append("## Low-confidence extractions — verify these against the paper yourself")
        lines.append("")
        for item in low_conf:
            lines.append(f"- {item['paper_id']} Group {item['group']} Q{item['number']} — {item['text_preview']}...")

    return "\n".join(lines)


def main():
    """Generate all reports."""
    clusters_data = load_clusters()

    if not clusters_data:
        print("No cluster data found in work/clusters/")
        return

    low_conf_questions = load_low_confidence_questions()

    print(f"Generating {len(clusters_data)} report(s)\n")

    for subject_code in sorted(clusters_data.keys()):
        output_path = OUTPUT_DIR / f"{subject_code}_priority.md"

        # Check if already generated
        if output_path.exists():
            print(f"SKIP: {subject_code}_priority.md")
            continue

        # Generate
        report = generate_report(clusters_data[subject_code], low_conf_questions)

        # Save
        output_path.write_text(report)
        num_clusters = len(clusters_data[subject_code].get("clusters", []))
        print(f"OK: {subject_code}_priority.md ({num_clusters} clusters)")

    print("\nReports ready in output/")


if __name__ == "__main__":
    main()
