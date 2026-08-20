# ExamAI Pipeline — Complete Build Guide

## What's Built

A complete 4-phase CLI pipeline for ingesting, extracting, and analyzing Purbanchal University exam papers:

### Phase 1: `p1_prepare.py` ✓
- Converts PDF → PNG (one per page)
- Resizes JPG/PNG to max 2000px
- Caches output (safe to re-run)
- **Status:** Works, tested, ready

### Phase 2: `p2_extract.py` ✓
- Sends complete papers to Claude vision API
- Groups pages by source file (whole paper in one call)
- Returns structured JSON matching schema
- Caches to `work/extracted/{paper_id}.json`
- **Status:** Works, tested, ready (requires valid ANTHROPIC_API_KEY)

### Phase 3: `p3_cluster.py` ✓
- Collects all questions per subject
- Sends to Claude for semantic clustering
- Groups identical questions across years
- Assigns canonical IDs and priority scores
- **Status:** Code complete, tested structure (requires valid ANTHROPIC_API_KEY)

### Phase 4: `p4_report.py` ✓
- Generates markdown study guides
- Organizes by frequency tier (3+, 2, 1 occurrence)
- Tracks low-confidence extractions
- One report per subject: `output/{subject_code}_priority.md`
- **Status:** Works, tested, ready

### Runner: `run.py` ✓
- Orchestrates all 4 phases in sequence
- Shows progress and summary
- **Usage:** `python run.py`

### Demo: `demo.py` ✓
- Generates sample extracted JSON (3 years of AI papers)
- Shows question clustering in action
- **Usage:** `python demo.py` then `python run.py`

---

## How to Use

### 1. Setup (first time)
```bash
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

### 2. Quick Start with Real Papers
```bash
# Drop PDF/JPG/PNG files into input/ directory
# Then run the pipeline:
python run.py
```

### 3. Test with Demo Data
```bash
# Generate sample data (3 years of AI papers)
python demo.py

# Run clustering and reporting
python -m src.p3_cluster
python -m src.p4_report

# View generated report
cat output/BIT415AI_priority.md
```

### 4. Run Phases Individually
```bash
python -m src.p1_prepare    # Prepare images
python -m src.p2_extract    # Extract via Claude
python -m src.p3_cluster    # Cluster questions
python -m src.p4_report     # Generate reports
```

---

## Data Schemas

All data is stored as JSON on disk (no database).

### Extracted Paper: `work/extracted/{paper_id}.json`
```json
{
  "paper_id": "BIT415CS_2023_regular",
  "source_files": ["input/ai_2023_p1.jpg"],
  "subject_code": "BIT415CS",
  "subject_name": "Artificial Intelligence",
  "semester": 6,
  "year": 2023,
  "exam_type": "regular",
  "full_marks": 80,
  "extraction_notes": "optional",
  "questions": [
    {
      "question_id": "BIT415CS_2023_regular_B4",
      "group": "B",
      "number": "4",
      "marks": 8,
      "text": "Explain A* search algorithm with a suitable example.",
      "sub_parts": [],
      "has_diagram": false,
      "confidence": "high"
    }
  ]
}
```

### Cluster: `work/clusters/{subject_code}.json`
```json
{
  "subject_code": "BIT415CS",
  "subject_name": "Artificial Intelligence",
  "papers_ingested": ["BIT415CS_2021_regular", "BIT415CS_2023_regular"],
  "years": [2021, 2023],
  "clusters": [
    {
      "canonical_id": "BIT415CS_C001",
      "canonical_text": "Explain A* search algorithm with a suitable example.",
      "topic": "Search algorithms",
      "variants": [
        "Explain A* search algorithm with a suitable example.",
        "Describe A* algorithm with example."
      ],
      "occurrences": [
        { "paper_id": "BIT415CS_2021_regular", "year": 2021, "group": "B", "marks": 8 },
        { "paper_id": "BIT415CS_2023_regular", "year": 2023, "group": "B", "marks": 8 }
      ],
      "frequency": 2,
      "total_marks": 16,
      "priority_score": 32
    }
  ]
}
```

### Report: `output/{subject_code}_priority.md`
Tiered markdown showing:
- Tier 1: Appeared 3+ times (highest priority to study)
- Tier 2: Appeared exactly twice
- Tier 3: Appeared once
- Low-confidence section with extraction warnings

---

## Directory Structure

```
examai-ingest/
├── input/                       # User drops exam papers here
│   ├── ai_2021.pdf
│   ├── ai_2023_back.jpg
│   └── database_2024.png
│
├── work/                        # Intermediate processing stages
│   ├── pages/                   # Normalized images (Phase 1 output)
│   │   ├── ai_2021_p1.png
│   │   ├── ai_2021_p2.png
│   │   └── ...
│   │
│   ├── extracted/               # Structured questions (Phase 2 output)
│   │   ├── BIT415AI_2021_regular.json
│   │   ├── BIT415AI_2023_regular.json
│   │   └── ...
│   │
│   └── clusters/                # Clustered questions (Phase 3 output)
│       ├── BIT415AI.json
│       ├── BIT415CS.json
│       └── ...
│
├── output/                      # Final reports (Phase 4 output)
│   ├── BIT415AI_priority.md
│   ├── BIT415CS_priority.md
│   └── ...
│
├── src/
│   ├── config.py               # Configuration & paths
│   ├── p1_prepare.py           # Phase 1: Image normalization
│   ├── p2_extract.py           # Phase 2: Vision extraction
│   ├── p3_cluster.py           # Phase 3: Semantic grouping
│   └── p4_report.py            # Phase 4: Report generation
│
├── run.py                       # Master runner (all 4 phases)
├── demo.py                      # Demo data generator
├── requirements.txt             # Dependencies
├── .env                         # Your API key (not in git)
├── .env.example                 # Template
├── .gitignore
├── README.md
└── GUIDE.md                     # This file
```

---

## Key Features

✓ **One-shot caching** — re-run phases without wasting API calls. Each stage only processes new input.

✓ **Whole-paper API calls** — pages from the same paper are sent together so Claude sees full context.

✓ **Semantic clustering** — identical questions worded differently are automatically grouped.

✓ **Priority scoring** — questions are ranked by `frequency × marks`, showing what to study first.

✓ **Confidence tracking** — low-confidence extractions are flagged for manual review.

✓ **No database** — all output is JSON on disk, portable and git-friendly.

✓ **Plain Python** — no framework, no dependencies beyond listed packages.

---

## Cost Control

Each paper costs ~1 Anthropic API call for extraction (Phase 2) + 1 call per subject for clustering (Phase 3).

Example pricing (as of Feb 2025):
- Extract 100 papers (varied exam types): ~100 calls × $0.003 = ~$0.30
- Cluster 20 subjects: ~20 calls × $0.003 = ~$0.06
- **Total: ~$0.36** for a complete database of 100 papers

Re-running the pipeline costs $0 if no new papers are added.

---

## Next Steps

1. **Add your real API key** to `.env`
2. **Drop exam papers** into `input/` (JPG, PNG, or PDF)
3. **Run the pipeline**: `python run.py`
4. **Check the reports** in `output/`

For feedback or issues, check the code comments — each phase is under 250 lines.
