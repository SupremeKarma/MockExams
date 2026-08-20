#!/usr/bin/env python
"""
Generate sample test data to demonstrate the clustering pipeline.
Creates extracted JSON files showing how questions repeat across years.
"""

import json
from pathlib import Path

from src.config import EXTRACTED_DIR


def create_sample_extracted_json():
    """Create sample extracted JSON files for demonstration."""
    samples = [
        {
            "paper_id": "BIT415AI_2021_regular",
            "source_files": ["input/ai_2021.png"],
            "subject_code": "BIT415AI",
            "subject_name": "Artificial Intelligence",
            "semester": 6,
            "year": 2021,
            "exam_type": "regular",
            "full_marks": 80,
            "extraction_notes": "",
            "questions": [
                {
                    "question_id": "BIT415AI_2021_regular_A1",
                    "group": "A",
                    "number": "1",
                    "marks": 2,
                    "text": "Define artificial intelligence.",
                    "sub_parts": [],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2021_regular_B1",
                    "group": "B",
                    "number": "1",
                    "marks": 8,
                    "text": "Explain A* search algorithm with a suitable example.",
                    "sub_parts": [],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2021_regular_B2",
                    "group": "B",
                    "number": "2",
                    "marks": 8,
                    "text": "What is machine learning? Discuss its types.",
                    "sub_parts": ["a) Supervised learning", "b) Unsupervised learning"],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2021_regular_C1",
                    "group": "C",
                    "number": "1",
                    "marks": 16,
                    "text": "Discuss the application of artificial neural networks in pattern recognition.",
                    "sub_parts": [],
                    "has_diagram": True,
                    "confidence": "medium"
                }
            ]
        },
        {
            "paper_id": "BIT415AI_2023_regular",
            "source_files": ["input/ai_2023.png"],
            "subject_code": "BIT415AI",
            "subject_name": "Artificial Intelligence",
            "semester": 6,
            "year": 2023,
            "exam_type": "regular",
            "full_marks": 80,
            "extraction_notes": "",
            "questions": [
                {
                    "question_id": "BIT415AI_2023_regular_A1",
                    "group": "A",
                    "number": "1",
                    "marks": 2,
                    "text": "What is AI?",
                    "sub_parts": [],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2023_regular_B1",
                    "group": "B",
                    "number": "1",
                    "marks": 8,
                    "text": "Describe A* search technique with example.",
                    "sub_parts": [],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2023_regular_B2",
                    "group": "B",
                    "number": "2",
                    "marks": 8,
                    "text": "Compare supervised and unsupervised learning.",
                    "sub_parts": [],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2023_regular_B3",
                    "group": "B",
                    "number": "3",
                    "marks": 8,
                    "text": "Explain BFS and DFS algorithms.",
                    "sub_parts": ["a) Breadth First Search", "b) Depth First Search"],
                    "has_diagram": False,
                    "confidence": "high"
                }
            ]
        },
        {
            "paper_id": "BIT415AI_2024_regular",
            "source_files": ["input/ai_2024.png"],
            "subject_code": "BIT415AI",
            "subject_name": "Artificial Intelligence",
            "semester": 6,
            "year": 2024,
            "exam_type": "regular",
            "full_marks": 80,
            "extraction_notes": "",
            "questions": [
                {
                    "question_id": "BIT415AI_2024_regular_B1",
                    "group": "B",
                    "number": "1",
                    "marks": 10,
                    "text": "Explain the A* search algorithm with a suitable example.",
                    "sub_parts": [],
                    "has_diagram": False,
                    "confidence": "high"
                },
                {
                    "question_id": "BIT415AI_2024_regular_C1",
                    "group": "C",
                    "number": "1",
                    "marks": 16,
                    "text": "Neural networks in deep learning: architectures and applications.",
                    "sub_parts": [],
                    "has_diagram": True,
                    "confidence": "high"
                }
            ]
        }
    ]

    for sample in samples:
        output_path = EXTRACTED_DIR / f"{sample['paper_id']}.json"
        output_path.write_text(json.dumps(sample, indent=2))
        print(f"Created: {output_path.name}")


def main():
    """Generate demo data."""
    print("Generating sample data for demonstration...\n")

    # Create extracted JSON (skip image creation as it's less important)
    EXTRACTED_DIR.mkdir(parents=True, exist_ok=True)
    create_sample_extracted_json()

    print("\nSample data created in work/extracted/")
    print("Run: python run.py")
    print("\nThis will cluster the questions and generate a study guide.")


if __name__ == "__main__":
    main()
