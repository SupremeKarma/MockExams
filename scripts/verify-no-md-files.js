#!/usr/bin/env node

/**
 * Security Verification Script: Ensure no .md files or source maps in build output
 */

const fs = require('fs');
const path = require('path');

const DIRECTORIES_TO_CHECK = [
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), '.next', 'static'),
];

let foundViolations = 0;

function scanDirectory(dir) {
  if (!fs.existsSync(dir)) {
    return;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile()) {
      if (entry.name.endsWith('.md')) {
        console.error(`❌ SECURITY VIOLATION: Exposed .md file found: ${fullPath}`);
        foundViolations++;
      }
      if (entry.name.endsWith('.map') && !process.env.ALLOW_SOURCE_MAPS) {
        console.warn(`⚠️ Warning: Source map found in output: ${fullPath}`);
      }
    }
  }
}

console.log('🔒 Running Security Verification: Scanning for exposed .md files...');

for (const dir of DIRECTORIES_TO_CHECK) {
  scanDirectory(dir);
}

if (foundViolations > 0) {
  console.error(`\n❌ Verification Failed: Found ${foundViolations} exposed .md file(s).`);
  process.exit(1);
} else {
  console.log('✅ Security Verification Passed: Zero .md files exposed in public/build directories.');
  process.exit(0);
}
