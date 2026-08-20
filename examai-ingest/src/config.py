import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Get API key
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
if not ANTHROPIC_API_KEY:
    raise ValueError("ANTHROPIC_API_KEY not found in .env file")

# Project root and directory paths
PROJECT_ROOT = Path(__file__).parent.parent
INPUT_DIR = PROJECT_ROOT / "input"
WORK_DIR = PROJECT_ROOT / "work"
PAGES_DIR = WORK_DIR / "pages"
EXTRACTED_DIR = WORK_DIR / "extracted"
CLUSTERS_DIR = WORK_DIR / "clusters"
OUTPUT_DIR = PROJECT_ROOT / "output"

# Create directories if they don't exist
for directory in [INPUT_DIR, PAGES_DIR, EXTRACTED_DIR, CLUSTERS_DIR, OUTPUT_DIR]:
    directory.mkdir(parents=True, exist_ok=True)

# Model configuration
MODEL = "claude-sonnet-4-6"
MAX_IMAGE_SIZE = 2000  # Max pixels on longest edge
