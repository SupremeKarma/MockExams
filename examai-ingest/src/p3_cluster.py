"""
Phase 3: Group semantically identical questions across papers.
- Collects all questions per subject
- Sends to Claude for clustering
- Assigns canonical IDs and computes priority scores
"""

import sys
import json
from pathlib import Path
from collections import defaultdict

import anthropic

from src.config import ANTHROPIC_API_KEY, EXTRACTED_DIR, CLUSTERS_DIR, MODEL


CLUSTERING_SYSTEM_PROMPT = """You group exam questions that ask the same thing, even when worded differently.
"Explain A* algorithm with example" and "Describe the A* search technique with a
suitable example" are the SAME question and belong in one cluster.
"Explain A* algorithm" and "Compare A* with greedy best-first search" are DIFFERENT
questions — do not merge them.
Return ONLY valid JSON. No markdown fences, no explanation.
For each cluster:
- canonical_text: the clearest full wording among the variants, copied verbatim
  from one of them. Do not write new wording.
- topic: a short subject topic label, 1-4 words.
- variants: every distinct wording seen, verbatim.
- occurrences: one entry per appearance, carrying paper_id, year, group and marks
  through unchanged.
A question that appears only once still gets its own cluster with frequency 1.
Every input question must appear in exactly one cluster. Do not drop any."""


def load_extracted_papers():
    """Load all extracted JSON files. Return dict of paper_id -> data."""
    papers = {}
    if not EXTRACTED_DIR.exists():
        return papers

    for json_file in EXTRACTED_DIR.glob("*.json"):
        try:
            data = json.loads(json_file.read_text())
            paper_id = data.get("paper_id") or json_file.stem
            papers[paper_id] = data
        except json.JSONDecodeError:
            print(f"WARNING: Could not parse {json_file.name}, skipping")

    return papers


def group_by_subject(papers):
    """Group papers by subject_code. Return dict of subject_code -> list of papers."""
    subjects = defaultdict(list)

    for paper_id, data in papers.items():
        subject_code = data.get("subject_code")
        if subject_code:
            subjects[subject_code].append(data)

    return subjects


def build_question_list(papers_for_subject):
    """Build flat list of all questions with metadata. Return list of dicts."""
    questions = []

    for paper in papers_for_subject:
        paper_id = paper.get("paper_id")
        year = paper.get("year")
        subject_code = paper.get("subject_code")
        subject_name = paper.get("subject_name")

        for q in paper.get("questions", []):
            questions.append({
                "text": q.get("text"),
                "paper_id": paper_id,
                "year": year,
                "group": q.get("group"),
                "marks": q.get("marks"),
                "has_diagram": q.get("has_diagram"),
                "confidence": q.get("confidence"),
            })

    return questions, subject_code, subject_name


def cluster_questions(questions, subject_code):
    """Send questions to Claude for clustering. Return clusters or None on failure."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Build prompt
    prompt = f"""Cluster these {len(questions)} exam questions from {subject_code}.
Each question is marked with its source paper, year, group, and marks.

{json.dumps(questions, indent=2)}

Return a JSON array of clusters, each with:
- canonical_text (string, verbatim from one variant)
- topic (string, 1-4 words)
- variants (array of strings, all distinct wordings)
- occurrences (array of objects with paper_id, year, group, marks)

Do not add frequency, total_marks, or canonical_id — I will compute those.
Every input question must be in exactly one cluster."""

    try:
        message = client.messages.create(
            model=MODEL,
            max_tokens=8192,
            system=CLUSTERING_SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        response_text = message.content[0].text

        # Strip markdown fences
        response_text = response_text.strip()
        if response_text.startswith("```"):
            response_text = response_text.split("```")[1]
            if response_text.startswith("json"):
                response_text = response_text[4:]
            response_text = response_text.split("```")[0]

        # Extract JSON array
        clusters = json.loads(response_text.strip())
        return clusters

    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON from clustering API: {e}")
        return None
    except anthropic.APIError as e:
        print(f"ERROR: API error during clustering: {e}")
        return None
    except Exception as e:
        print(f"ERROR: Unexpected error during clustering: {e}")
        return None


def validate_and_finalize(clusters, questions, subject_code, subject_name, papers_for_subject):
    """
    Validate cluster count, assign IDs, compute scores.
    Return final cluster list or None on validation failure.
    """
    if not clusters:
        return None

    # Validate: total questions in clusters must equal input
    total_clustered = sum(len(c.get("occurrences", [])) for c in clusters)
    if total_clustered != len(questions):
        print(f"WARNING: {subject_code} cluster count mismatch!")
        print(f"  Input: {len(questions)} questions")
        print(f"  Clustered: {total_clustered} questions")
        print(f"  Proceeding anyway, but verify manually.")

    # Assign canonical IDs and compute scores
    final_clusters = []
    for idx, cluster in enumerate(clusters, 1):
        canonical_id = f"{subject_code}_C{idx:03d}"
        occurrences = cluster.get("occurrences", [])
        frequency = len(occurrences)
        total_marks = sum(o.get("marks", 0) or 0 for o in occurrences)
        priority_score = frequency * total_marks

        final_cluster = {
            "canonical_id": canonical_id,
            "canonical_text": cluster.get("canonical_text", ""),
            "topic": cluster.get("topic", ""),
            "variants": cluster.get("variants", []),
            "occurrences": occurrences,
            "frequency": frequency,
            "total_marks": total_marks,
            "priority_score": priority_score,
        }
        final_clusters.append(final_cluster)

    # Sort by priority score descending
    final_clusters.sort(key=lambda x: x["priority_score"], reverse=True)

    # Renumber IDs after sorting
    for idx, cluster in enumerate(final_clusters, 1):
        cluster["canonical_id"] = f"{subject_code}_C{idx:03d}"

    # Build output object
    paper_ids = [p.get("paper_id") for p in papers_for_subject]
    years = sorted(set(p.get("year") for p in papers_for_subject if p.get("year")))

    output = {
        "subject_code": subject_code,
        "subject_name": subject_name,
        "papers_ingested": paper_ids,
        "years": years,
        "clusters": final_clusters,
    }

    return output


def main():
    """Cluster all subjects."""
    papers = load_extracted_papers()

    if not papers:
        print("No extracted papers found in work/extracted/")
        return

    subjects = group_by_subject(papers)

    if not subjects:
        print("No subjects found in papers")
        return

    print(f"Clustering {len(subjects)} subject(s)\n")

    for subject_code in sorted(subjects.keys()):
        papers_for_subject = subjects[subject_code]

        # Check if already clustered
        output_path = CLUSTERS_DIR / f"{subject_code}.json"
        if output_path.exists():
            print(f"SKIP: {subject_code}")
            continue

        print(f"Processing {subject_code} ({len(papers_for_subject)} papers)...", end=" ")
        sys.stdout.flush()

        # Build question list
        questions, _, subject_name = build_question_list(papers_for_subject)

        if not questions:
            print("SKIP: no questions")
            continue

        # Cluster via API
        clusters = cluster_questions(questions, subject_code)

        if clusters is None:
            print("FAILED: API error")
            continue

        # Validate and finalize
        output = validate_and_finalize(clusters, questions, subject_code, subject_name, papers_for_subject)

        if output is None:
            print("FAILED: validation error")
            continue

        # Save
        output_path.write_text(json.dumps(output, indent=2))
        num_clusters = len(output.get("clusters", []))
        print(f"OK: {num_clusters} clusters")


if __name__ == "__main__":
    main()
