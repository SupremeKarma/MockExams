# ExamAI — Past Paper Ingestion Pipeline

Convert scanned/photographed past exam papers into a structured, deduplicated question database and generate a study-priority report showing which questions repeat most across years.

Designed for Purbanchal University BIT program past papers from Nepal.

## Install

```bash
pip install -r requirements.txt
```

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your Anthropic API key to `.env`:
   ```
   ANTHROPIC_API_KEY=sk-...
   ```

## Usage

### Quick Start (recommended)
```bash
python run.py
```
This runs all 4 phases in sequence with progress output.

### Or run phases individually:
```bash
python -m src.p1_prepare    # Normalize all images from input/
python -m src.p2_extract    # Extract questions via Claude vision API
python -m src.p3_cluster    # Group semantically identical questions
python -m src.p4_report     # Generate markdown priority reports
```

## Input Files

Drop PDF, JPG, or PNG files into the `input/` directory. Name them with metadata for easier extraction:
- `ai_2023.pdf` 
- `software_engineering_2021_back.jpg`
- `database_systems_2024_regular.png`

The format is: `{subject}_{year}[_{exam_type}].{ext}`

## Output

Study-priority reports are generated in `output/` as `{subject_code}_priority.md`, ranked by how often questions repeat.

## How it Works

1. **Phase 1 (Prepare):** Normalize all input images to PNG, max 2000px on longest edge
2. **Phase 2 (Extract):** Send full papers to Claude vision API, extract structured questions
3. **Phase 3 (Cluster):** Group questions that ask the same thing across different years
4. **Phase 4 (Report):** Generate markdown priority lists sorted by study value

All stages cache their output — re-running never re-calls the API for already-processed files.
