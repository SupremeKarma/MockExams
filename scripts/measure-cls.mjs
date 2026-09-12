#!/usr/bin/env node
// Measure Cumulative Layout Shift on a Reader page.
//
// The deep-link bug was a layout-shift symptom: headings moved after first
// paint, so the browser's jump to `#anchor` landed in the wrong place. Fixing
// the cause (next/font metrics, KaTeX in the head) should show up here as a
// near-zero CLS — and this script is how that claim gets checked rather than
// asserted.
//
//   node scripts/measure-cls.mjs <url> [runs]
//
// Google's "good" threshold is 0.1. A content page with no ads or late images
// should be far below that.

import { chromium } from "@playwright/test";

const URL_ARG = process.argv[2];
const RUNS = Number(process.argv[3] ?? 3);

if (!URL_ARG) {
  console.error("usage: node scripts/measure-cls.mjs <url> [runs]");
  process.exit(1);
}

const browser = await chromium.launch();
const results = [];

for (let run = 0; run < RUNS; run += 1) {
  // A cold context per run: a warm font cache hides exactly the shift this is
  // meant to catch, so measuring a reload would always report zero.
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    window.__cls = 0;
    window.__shifts = [];
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const shift = entry;
        // Shifts within 500ms of a user interaction are expected and excluded
        // from the metric; there is no interaction here, so every shift counts.
        if (!shift.hadRecentInput) {
          window.__cls += shift.value;
          if (shift.value > 0.001) {
            window.__shifts.push({
              value: Number(shift.value.toFixed(4)),
              at: Math.round(shift.startTime),
              sources: (shift.sources ?? []).map(
                (s) => s.node?.nodeName + (s.node?.className ? `.${s.node.className}` : "")
              ),
            });
          }
        }
      }
    }).observe({ type: "layout-shift", buffered: true });
  });

  await page.goto(URL_ARG, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);

  const { cls, shifts } = await page.evaluate(() => ({
    cls: window.__cls,
    shifts: window.__shifts,
  }));

  results.push({ cls, shifts });
  console.log(`run ${run + 1}: CLS ${cls.toFixed(4)}`);
  for (const shift of shifts) {
    console.log(`    ${shift.value} at ${shift.at}ms  ${shift.sources.join(", ")}`);
  }

  await context.close();
}

await browser.close();

const worst = Math.max(...results.map((r) => r.cls));
console.log(`\nworst CLS across ${RUNS} cold loads: ${worst.toFixed(4)}`);
console.log(worst <= 0.1 ? "within the 'good' threshold (0.1)" : "ABOVE the 0.1 threshold");
