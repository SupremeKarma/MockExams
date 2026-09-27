/**
 * Notes authoring contract.
 *
 * These notes are what a student revises from. A malformed, ungrounded or
 * copied topic reaching publication is the failure that matters — wrong notes
 * cost real marks, and copied notes are a legal problem. The parser and the
 * review flags are the two guards, so both are tested directly.
 */

import { readFileSync, existsSync } from "fs";
import { describe, expect, it } from "vitest";
import {
  parseTopics,
  reviewFlags,
  looksCopied,
  slugifyTopic,
  MAX_TOPICS_PER_CALL,
  type AuthoredTopic,
} from "@/lib/notes-authoring";

// vitest does not load .env.local the way Next does.
if (existsSync(".env.local") && !process.env.GEMINI_API_KEY) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = /^GEMINI_API_KEY=(.*)$/.exec(line.trim());
    if (m) process.env.GEMINI_API_KEY = m[1].replace(/^["']|["']$/g, "");
  }
}
const apiKey = process.env.GEMINI_API_KEY;

const SOURCES = [{ title: "Example", uri: "https://example.com/dbms" }];

const validTopic = {
  name: "Third Normal Form",
  importance: "High",
  keyPoints: ["3NF requires 2NF plus no transitive dependency."],
  theory: "A".repeat(300),
  commonExamQuestions: ["Define 3NF with an example."],
};

const wrap = (items: unknown[]) => JSON.stringify(items);

describe("parseTopics", () => {
  it("parses a well-formed topic and attaches the call's sources", () => {
    const topics = parseTopics(wrap([validTopic]), "BIT353CO", SOURCES);
    expect(topics).toHaveLength(1);
    expect(topics[0].name).toBe("Third Normal Form");
    expect(topics[0].sources).toEqual(SOURCES);
    expect(topics[0].grounded).toBe(true);
  });

  it("marks a topic ungrounded when the model returned no sources", () => {
    // The model answered from memory; nothing verified it.
    const topics = parseTopics(wrap([validTopic]), "BIT353CO", []);
    expect(topics[0].grounded).toBe(false);
  });

  it("tolerates prose or fences around the array", () => {
    const raw = "Here are the notes:\n```json\n" + wrap([validTopic]) + "\n```";
    expect(parseTopics(raw, "BIT353CO", SOURCES)).toHaveLength(1);
  });

  it("drops topics with no name, no theory, or no key points", () => {
    const topics = parseTopics(
      wrap([
        { ...validTopic, name: "" },
        { ...validTopic, theory: "" },
        { ...validTopic, keyPoints: [] },
        { ...validTopic, name: "Kept" },
      ]),
      "BIT353CO",
      SOURCES
    );
    expect(topics.map((t) => t.name)).toEqual(["Kept"]);
  });

  it("de-duplicates topics that slug to the same id", () => {
    const topics = parseTopics(
      wrap([validTopic, { ...validTopic, name: "third normal form" }]),
      "BIT353CO",
      SOURCES
    );
    expect(topics).toHaveLength(1);
  });

  it("falls back to Medium for an invalid importance", () => {
    const topics = parseTopics(
      wrap([{ ...validTopic, importance: "Extremely Critical" }]),
      "BIT353CO",
      SOURCES
    );
    expect(topics[0].importance).toBe("Medium");
  });

  it("clamps oversized fields and list lengths", () => {
    const topics = parseTopics(
      wrap([
        {
          ...validTopic,
          name: "N".repeat(400),
          theory: "T".repeat(9000),
          keyPoints: Array.from({ length: 40 }, (_, i) => `point ${i}`),
          commonExamQuestions: Array.from({ length: 20 }, (_, i) => `q ${i}`),
        },
      ]),
      "BIT353CO",
      SOURCES
    );
    expect(topics[0].name.length).toBeLessThanOrEqual(120);
    expect(topics[0].theory.length).toBeLessThanOrEqual(4000);
    expect(topics[0].keyPoints.length).toBeLessThanOrEqual(8);
    expect(topics[0].commonExamQuestions.length).toBeLessThanOrEqual(4);
  });

  it("strips citation markers carried over from sources", () => {
    // Live output produced "Explain the Apriori algorithm [1.1.6]." — noise to
    // a student, so it is removed rather than shown.
    const topics = parseTopics(
      wrap([
        {
          ...validTopic,
          keyPoints: ["Support measures itemset frequency [12]."],
          commonExamQuestions: ["Explain the Apriori algorithm [1.1.6]."],
        },
      ]),
      "BIT353CO",
      SOURCES
    );
    expect(topics[0].keyPoints[0]).toBe("Support measures itemset frequency.");
    expect(topics[0].commonExamQuestions[0]).toBe("Explain the Apriori algorithm.");
  });

  it("caps how many topics one call can produce", () => {
    const many = Array.from({ length: MAX_TOPICS_PER_CALL + 5 }, (_, i) => ({
      ...validTopic,
      name: `Topic ${i}`,
    }));
    expect(parseTopics(wrap(many), "BIT353CO", SOURCES)).toHaveLength(MAX_TOPICS_PER_CALL);
  });

  it("salvages intact topics from a truncated array", () => {
    // Live runs hit this: the token budget cuts the array mid-object.
    const truncated =
      "[" + JSON.stringify(validTopic) + "," + JSON.stringify({ ...validTopic, name: "Second" }).slice(0, 40);
    const topics = parseTopics(truncated, "BIT353CO", SOURCES);
    expect(topics).toHaveLength(1);
    expect(topics[0].name).toBe("Third Normal Form");
  });

  it("skips a malformed object but keeps the good ones", () => {
    // Trailing comma inside one object; the rest of the array is fine.
    const raw =
      '[{"name":"Broken","keyPoints":[1,],"theory":"x"},' +
      JSON.stringify({ ...validTopic, name: "Good" }) +
      "]";
    const topics = parseTopics(raw, "BIT353CO", SOURCES);
    expect(topics.map((t) => t.name)).toEqual(["Good"]);
  });

  it("throws when nothing at all can be salvaged", () => {
    expect(() => parseTopics("[{broken}, {also broken}]", "BIT353CO", SOURCES)).toThrow();
  });

  it("throws rather than silently accepting a non-array payload", () => {
    expect(() => parseTopics(JSON.stringify(validTopic), "BIT353CO", SOURCES)).toThrow();
    expect(() => parseTopics("I could not write these notes.", "BIT353CO", SOURCES)).toThrow();
  });
});

describe("slugifyTopic", () => {
  it("namespaces the id by subject so two subjects can share a topic name", () => {
    expect(slugifyTopic("BIT353CO", "Third Normal Form")).toBe("bit353co-third-normal-form");
    expect(slugifyTopic("BIT203CO", "Third Normal Form")).not.toBe(
      slugifyTopic("BIT353CO", "Third Normal Form")
    );
  });
});

describe("looksCopied", () => {
  it("flags the obvious tells of lifted text", () => {
    expect(looksCopied("Normalization is a process [12] used in databases.")).toBe(true);
    expect(looksCopied("This article describes normalization.")).toBe(true);
    expect(looksCopied("All rights reserved.")).toBe(true);
  });

  it("flags nested section markers like [1.1.6]", () => {
    // Live output leaked exactly this into a generated exam question.
    expect(looksCopied("Explain the K-means algorithm [1.1.6].")).toBe(true);
    expect(looksCopied("See section [4.2] for details.")).toBe(true);
  });

  it("leaves ordinary explanation alone", () => {
    expect(
      looksCopied("Normalization removes redundancy by splitting a table into related tables.")
    ).toBe(false);
  });
});

describe("reviewFlags", () => {
  const topic = (over: Partial<AuthoredTopic> = {}): AuthoredTopic => ({
    id: "bit353co-3nf",
    name: "Third Normal Form",
    importance: "High",
    keyPoints: ["3NF requires no transitive dependency."],
    theory: "A".repeat(300),
    commonExamQuestions: ["Define 3NF."],
    sources: SOURCES,
    grounded: true,
    ...over,
  });

  it("passes a well-formed grounded topic", () => {
    expect(reviewFlags(topic())).toEqual([]);
  });

  it("flags an ungrounded topic", () => {
    expect(reviewFlags(topic({ grounded: false }))[0]).toMatch(/no sources/);
  });

  it("flags possible copying in the theory or a key point", () => {
    expect(reviewFlags(topic({ theory: "This article explains 3NF. " + "A".repeat(300) }))).toContain(
      "theory may contain copied text"
    );
    expect(reviewFlags(topic({ keyPoints: ["See page 4 of 12"] }))).toContain(
      "a key point may contain copied text"
    );
  });

  it("flags a copied marker inside an exam question", () => {
    // commonExamQuestions was originally unchecked; live output proved it needed to be.
    expect(
      reviewFlags(topic({ commonExamQuestions: ["Explain the Apriori algorithm [1.1.6]."] }))
    ).toContain("an exam question may contain copied text");
  });

  it("flags a thin explanation and a missing question set", () => {
    const flags = reviewFlags(topic({ theory: "Too short.", commonExamQuestions: [] }));
    expect(flags).toContain("explanation is very short");
    expect(flags).toContain("no exam questions produced");
  });
});

describe("authorUnitNotes (live model)", () => {
  const liveIt = apiKey ? it : it.skip;

  liveIt(
    "produces grounded, original notes for a real syllabus unit",
    async () => {
      const { authorUnitNotes } = await import("@/lib/notes-authoring");

      let topics;
      try {
        topics = await authorUnitNotes(apiKey!, {
          subjectCode: "BIT353CO",
          subjectName: "Data Warehousing and Data Mining",
          unit: "Data Mining Approaches and Methods",
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        // Quota or invalid auth is an environment problem, not a regression.
        if (message.includes("(429)") || message.includes("401")) {
          console.warn(`[skipped] Gemini API quota or authentication unavailable: ${message}`);
          return;
        }
        throw err;
      }

      expect(topics.length).toBeGreaterThan(0);

      for (const topic of topics) {
        expect(topic.name.length).toBeGreaterThan(0);
        expect(topic.keyPoints.length).toBeGreaterThanOrEqual(1);
        expect(topic.theory.length).toBeGreaterThan(200);

        // Whether the model searches is its own decision and varies between
        // runs, so assert the invariant rather than the behaviour: grounded
        // topics carry sources, ungrounded ones are flagged for review and
        // never look publishable.
        expect(topic.grounded).toBe(topic.sources.length > 0);
        if (!topic.grounded) {
          expect(reviewFlags(topic).join(" ")).toMatch(/no sources/);
        }

        // Citation markers must never survive into student-facing text.
        expect(topic.theory).not.toMatch(/\[\d+(\.\d+)*\]/);
        for (const q of topic.commonExamQuestions) {
          expect(q).not.toMatch(/\[\d+(\.\d+)*\]/);
        }
      }
    },
    120000
  );
});
