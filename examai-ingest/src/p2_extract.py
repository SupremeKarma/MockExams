"""
Phase 2: Extract questions from page images via Anthropic API.
- Groups pages by source file (one API call per paper)
- Caches results to avoid re-processing
- Returns structured JSON matching the schema
"""

import sys
import json
import re
from pathlib import Path
from collections import defaultdict
import base64

import anthropic

from src.config import ANTHROPIC_API_KEY, PAGES_DIR, EXTRACTED_DIR, MODEL


# Schema for user message
EXTRACTION_SCHEMA = {
    "paper_id": "BIT415CS_2023_regular",
    "source_files": ["input/ai_2023_p1.jpg"],
    "subject_code": "BIT415CS",
    "subject_name": "Artificial Intelligence",
    "semester": 6,
    "year": 2023,
    "exam_type": "regular",
    "full_marks": 80,
    "extraction_notes": "optional notes",
    "questions": [
        {
            "question_id": "BIT415CS_2023_regular_B4",
            "group": "B",
            "number": "4",
            "marks": 8,
            "text": "Question text here",
            "sub_parts": ["a) part a", "b) part b"],
            "has_diagram": False,
            "confidence": "high"
        }
    ]
}

SYSTEM_PROMPT = """You are extracting exam questions from photographed Purbanchal University BIT
question papers from Nepal.
Return ONLY valid JSON matching the schema given by the user. No markdown fences,
no preamble, no explanation.
Rules:
- Transcribe question text EXACTLY as printed. Do not rephrase, correct grammar,
  or improve wording. Nepali-English textbook phrasing must be preserved verbatim.
- If text is unreadable, set that field to null and lower the confidence value.
  NEVER guess or invent a question.
- Marks are usually printed in the right margin, e.g. [8] or (2x5).
- Papers are usually split into Group A (short), Group B (medium), Group C (long).
  If no groups are printed, set group to null.
- A question with parts a), b), c) is ONE question object with those parts listed
  in sub_parts.
- If a question refers to a figure, circuit, or table image, set has_diagram to true
  and describe it in one short phrase inside the text field, in square brackets.
- Set confidence to "low" for any question where more than a few words were hard
  to read.
"""


def group_pages_by_paper():
    """Group page images by their source file. Return dict of paper_id -> list of page paths."""
    if not PAGES_DIR.exists():
        return {}

    pages = sorted(PAGES_DIR.glob("*.png"))
    papers = defaultdict(list)

    for page_path in pages:
        # Extract stem: "ai_2023_p1.png" -> "ai_2023"
        match = re.match(r"(.+)_p\d+\.png$", page_path.name)
        if match:
            stem = match.group(1)
            papers[stem].append(page_path)
        else:
            print(f"WARNING: Could not parse filename {page_path.name}, skipping")

    return papers


def encode_image(image_path):
    """Read image and encode as base64."""
    with open(image_path, "rb") as f:
        return base64.standard_b64encode(f.read()).decode("utf-8")


def extract_paper(paper_stem, page_paths):
    """Send all pages of one paper to API. Return extracted JSON dict or None on failure."""
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

    # Build image blocks for all pages
    content = []
    for page_path in sorted(page_paths):
        image_data = encode_image(page_path)
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/png",
                "data": image_data,
            },
        })

    # Add text instruction
    content.append({
        "type": "text",
        "text": f"""Extract every question from this exam paper. Return only the JSON object.

Expected schema:
{json.dumps(EXTRACTION_SCHEMA, indent=2)}
"""
    })

    try:
        message = client.messages.create(
            model=MODEL,
            max_tokens=4096,
            system=SYSTEM_PROMPT,
            messages=[
                {"role": "user", "content": content}
            ]
        )

        response_text = message.content[0].text

        # Strip markdown fences if present
        response_text = re.sub(r"^```json\n?", "", response_text)
        response_text = re.sub(r"\n?```$", "", response_text)
        response_text = response_text.strip()

        # Parse JSON
        data = json.loads(response_text)
        return data

    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON from API for {paper_stem}: {e}")
        return None
    except anthropic.APIError as e:
        print(f"ERROR: API error for {paper_stem}: {e}")
        return None
    except Exception as e:
        print(f"ERROR: Unexpected error for {paper_stem}: {e}")
        return None


def infer_paper_id(paper_stem, extracted_data):
    """Infer paper_id from stem and extracted data. Format: {subject_code}_{year}_{exam_type}"""
    # Try to use paper_id from extracted data if present
    if extracted_data and "paper_id" in extracted_data and extracted_data["paper_id"]:
        return extracted_data["paper_id"]

    # Fallback: try to parse from stem
    # Format examples: "ai_2023", "software_eng_2021_back", "database_2024_regular"
    parts = paper_stem.split("_")

    year = None
    exam_type = "regular"

    for i, part in enumerate(parts):
        if part.isdigit() and len(part) == 4 and 2000 <= int(part) <= 2100:
            year = int(part)
            exam_type = "_".join(parts[i+1:]) if i + 1 < len(parts) else "regular"
            subject = "_".join(parts[:i])
            break

    if not year:
        return f"{paper_stem}_unknown"

    return f"{subject}_{year}_{exam_type}".upper()


def main():
    """Extract all papers."""
    papers = group_pages_by_paper()

    if not papers:
        print("No page images found in work/pages/")
        return

    print(f"Found {len(papers)} paper(s) to process\n")

    for paper_stem in sorted(papers.keys()):
        page_paths = papers[paper_stem]

        # Infer paper_id - first try extracting, then infer from stem
        temp_data = extract_paper(paper_stem, page_paths)
        if temp_data is None:
            paper_id = infer_paper_id(paper_stem, None)
            output_path = EXTRACTED_DIR / f"{paper_id}.FAILED.txt"
            output_path.write_text(f"API call failed for {paper_stem}\n")
            print(f"FAILED: {paper_id} — API extraction failed")
            continue

        paper_id = temp_data.get("paper_id") or infer_paper_id(paper_stem, temp_data)

        # Check if already extracted
        output_path = EXTRACTED_DIR / f"{paper_id}.json"
        if output_path.exists():
            print(f"SKIP: {paper_id}")
            continue

        # Ensure paper_id is set in output
        temp_data["paper_id"] = paper_id
        if "source_files" not in temp_data or not temp_data["source_files"]:
            temp_data["source_files"] = [str(p.relative_to(PAGES_DIR.parent.parent)) for p in page_paths]

        # Save JSON
        output_path.write_text(json.dumps(temp_data, indent=2))

        # Count confidence levels
        questions = temp_data.get("questions", [])
        low_conf = sum(1 for q in questions if q.get("confidence") == "low")

        print(f"OK: {paper_id} — {len(questions)} questions ({low_conf} low confidence)")


if __name__ == "__main__":
    main()
