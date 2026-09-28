#!/usr/bin/env bash

# ========================================================================
# Production Build Script: Hide .md file implementation and verify output
# ========================================================================

set -e

echo "📦 Building ExamAI Platform..."

# Pre-build verification
echo "✓ Pre-build security scan..."
node scripts/verify-no-md-files.js

# Build Next.js
echo "✓ Compiling Next.js application..."
npm run build

# Post-build verification
echo "✓ Post-build security scan..."
node scripts/verify-no-md-files.js

echo "✅ Production build verified and secure. No proprietary .md files exposed."
