#!/usr/bin/env node
// Capture the Reader at the four configurations DESIGN.md §11 asks for.
//
// Kept as a script rather than a one-off so a design change can be re-shot with
// one command, and so the same four captures are compared each time.
//
//   node scripts/reader-screenshots.mjs <url> <outDir>

import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const URL_ARG = process.argv[2];
const OUT = process.argv[3] ?? "screenshots";

if (!URL_ARG) {
  console.error("usage: node scripts/reader-screenshots.mjs <url> <outDir>");
  process.exit(1);
}

/**
 * Theme is set through the cookie the app actually reads, not by poking the DOM
 * — so these shots exercise the real server-rendered path, including the
 * no-flash guarantee, rather than a state only the screenshot can reach.
 */
function cookie(value) {
  return {
    name: "examai_reader",
    value,
    domain: "localhost",
    path: "/",
  };
}

const SHOTS = [
  {
    name: "1-paper-desktop-1440",
    viewport: { width: 1440, height: 900 },
    cookie: "theme:paper,size:m,font:book,width:normal,spacing:normal",
    note: "Paper, desktop — three panes",
  },
  {
    name: "2-blackboard-phone-390",
    viewport: { width: 390, height: 844 },
    cookie: "theme:blackboard,size:m,font:book,width:normal,spacing:normal",
    note: "Blackboard, phone — bottom toolbar",
  },
  {
    name: "3-night-phone-wide-table",
    viewport: { width: 390, height: 844 },
    cookie: "theme:night,size:m,font:book,width:normal,spacing:normal",
    // The allocation/request matrix is the widest thing in the note and the
    // real test of the phone layout.
    scrollTo: ".table-wrap",
    note: "Night, phone — wide table scrolling in its own box",
  },
  {
    name: "4-tv-1920x1080",
    viewport: { width: 1920, height: 1080 },
    cookie: "theme:blackboard,size:m,font:book,width:normal,spacing:normal,viewing:tv",
    note: "TV view — large type, safe-area margins",
  },
];

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();

for (const shot of SHOTS) {
  const context = await browser.newContext({
    viewport: shot.viewport,
    deviceScaleFactor: 2,
    // Phones are touch devices: the design system grows tap targets to 44px
    // under `(pointer: coarse)`, and shooting with a mouse pointer would show
    // the desktop sizes on a phone screenshot.
    hasTouch: shot.viewport.width < 768,
    isMobile: shot.viewport.width < 768,
  });

  await context.addCookies([cookie(shot.cookie)]);

  const page = await context.newPage();
  await page.goto(URL_ARG, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  if (shot.scrollTo) {
    await page.locator(shot.scrollTo).first().scrollIntoViewIfNeeded();
    // Let the sticky header settle and the scroll-spy update.
    await page.waitForTimeout(300);
  }

  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${shot.name}.png` });

  const theme = await page.evaluate(() => ({
    theme: document.documentElement.getAttribute("data-theme"),
    viewing: document.documentElement.getAttribute("data-viewing"),
  }));

  console.log(
    `  ${shot.name}.png  ${shot.viewport.width}x${shot.viewport.height}  ` +
      `theme=${theme.theme}${theme.viewing ? ` viewing=${theme.viewing}` : ""}  — ${shot.note}`
  );

  await context.close();
}

await browser.close();
console.log(`\nSaved to ${OUT}`);
