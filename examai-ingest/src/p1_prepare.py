"""
Phase 1: Normalize all input images to PNG, max 2000px on longest edge.
- PDFs → one PNG per page via PyMuPDF
- JPG/PNG → resize and convert to PNG
- Skip any file whose output already exists
"""

import sys
from pathlib import Path
import cv2
import numpy as np
import fitz

from src.config import INPUT_DIR, PAGES_DIR, MAX_IMAGE_SIZE


def normalize_image(image_path, output_path):
    """Resize image so longest edge is max MAX_IMAGE_SIZE, save as PNG."""
    img = cv2.imread(str(image_path))
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")

    h, w = img.shape[:2]
    if max(w, h) > MAX_IMAGE_SIZE:
        ratio = MAX_IMAGE_SIZE / max(w, h)
        new_w = int(w * ratio)
        new_h = int(h * ratio)
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

    cv2.imwrite(str(output_path), img)


def process_file(file_path):
    """Process one file (PDF, JPG, or PNG). Return (pages_created, pages_skipped)."""
    stem = file_path.stem
    created = 0
    skipped = 0

    if file_path.suffix.lower() == ".pdf":
        try:
            pdf = fitz.open(file_path)
        except Exception as e:
            print(f"ERROR: Could not open PDF {file_path.name}: {e}")
            return 0, 0

        for page_num in range(len(pdf)):
            output_path = PAGES_DIR / f"{stem}_p{page_num + 1}.png"
            if output_path.exists():
                print(f"SKIP: {output_path.name}")
                skipped += 1
            else:
                try:
                    page = pdf[page_num]
                    pix = page.get_pixmap(matrix=fitz.Matrix(150/72, 150/72))
                    img_data = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)

                    h, w = img_data.shape[:2]
                    if max(w, h) > MAX_IMAGE_SIZE:
                        ratio = MAX_IMAGE_SIZE / max(w, h)
                        new_w = int(w * ratio)
                        new_h = int(h * ratio)
                        img_data = cv2.resize(img_data, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)

                    if pix.n == 3:
                        img_data = cv2.cvtColor(img_data, cv2.COLOR_RGB2BGR)

                    cv2.imwrite(str(output_path), img_data)
                    created += 1
                except Exception as e:
                    print(f"ERROR: Could not process page {page_num + 1} of {file_path.name}: {e}")
        pdf.close()
    else:
        output_path = PAGES_DIR / f"{stem}_p1.png"
        if output_path.exists():
            print(f"SKIP: {output_path.name}")
            skipped += 1
        else:
            try:
                normalize_image(file_path, output_path)
                created += 1
            except Exception as e:
                print(f"ERROR: Could not process {file_path.name}: {e}")
                return 0, 0

    return created, skipped


def main():
    """Process all files in input/."""
    if not INPUT_DIR.exists():
        print(f"ERROR: input/ directory not found at {INPUT_DIR}")
        sys.exit(1)

    # Find all supported files
    files = []
    for ext in [".pdf", ".jpg", ".jpeg", ".png"]:
        files.extend(INPUT_DIR.glob(f"*{ext}"))
        files.extend(INPUT_DIR.glob(f"*{ext.upper()}"))

    files = list(set(files))  # Remove duplicates
    if not files:
        print("No input files found in input/")
        return

    print(f"Processing {len(files)} file(s)...\n")

    total_created = 0
    total_skipped = 0

    for file_path in sorted(files):
        created, skipped = process_file(file_path)
        total_created += created
        total_skipped += skipped

    print(f"\nSummary: {len(files)} files in, {total_created} pages created, {total_skipped} skipped")


if __name__ == "__main__":
    main()
