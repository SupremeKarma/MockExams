#!/usr/bin/env node
// Full-page captures of published notes, for reading the prose rather than
// judging the chrome.
//
//   node scripts/note-screenshots.mjs <outDir> <url> [url...]
//
// Paper theme at desktop width, because that is the configuration the writing
// has to work in first — a dark theme and a phone viewport are about layout,
// and this is about the words.

import { mkdirSync } from "node:fs";
import { chromium } from "@playwright/test";

const [OUT, ...URLS] = process.argv.slice(2);

if (!OUT || URLS.length === 0) {
  console.error("usage: node scripts/note-screenshots.mjs <outDir> <url> [url...]");
  process.exit(1);
}

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1280, height: 1000 },
  deviceScaleFactor: 2,
});
await context.addCookies([
  {
    name: "examai_reader",
    value: "theme:paper,size:m,font:book,width:normal,spacing:normal",
    domain: "localhost",
    path: "/",
  },
]);

for (const url of URLS) {
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const title = await page.title();
  const name = url.split("/").pop().replace(/-[a-z0-9]{8}$/, "");

  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });

  const stats = await page.evaluate(() => ({
    words: (document.querySelector(".prose")?.textContent ?? "").trim().split(/\s+/).length,
    blocks: document.querySelectorAll(".block").length,
    tables: document.querySelectorAll("table").length,
    answers: document.querySelectorAll(".block--answer").length,
  }));

  console.log(
    `  ${name}.png — ${stats.words} words, ${stats.blocks} blocks, ` +
      `${stats.tables} tables, ${stats.answers} answer boxes  (${title.split("·")[0].trim()})`
  );
  await page.close();
}

await browser.close();
console.log(`\nSaved to ${OUT}`);
