/**
 * Flashcard extraction contract.
 *
 * These cards go straight into a spaced-repetition queue, so a malformed or
 * duplicated card gets drilled for weeks. The parser is the guard.
 */

import { describe, expect, it } from "vitest";
import { parseCards, MAX_CARDS } from "@/lib/flashcard-extraction";

describe("parseCards", () => {
  it("parses a well-formed array", () => {
    const cards = parseCards(
      '[{"front":"What is a B-tree?","back":"A self-balancing search tree.","topic":"Trees"}]'
    );
    expect(cards).toHaveLength(1);
    expect(cards[0]).toEqual({
      front: "What is a B-tree?",
      back: "A self-balancing search tree.",
      topic: "Trees",
    });
  });

  it("tolerates the model wrapping the array in prose or fences", () => {
    const cards = parseCards('Here you go:\n```json\n[{"front":"Q","back":"A","topic":"T"}]\n```');
    expect(cards).toHaveLength(1);
  });

  it("drops cards missing a front or back rather than saving blanks", () => {
    const cards = parseCards(
      '[{"front":"Q","back":"","topic":"T"},{"front":"","back":"A","topic":"T"},{"front":"Q2","back":"A2","topic":"T"}]'
    );
    expect(cards).toHaveLength(1);
    expect(cards[0].front).toBe("Q2");
  });

  it("de-duplicates by front, case-insensitively", () => {
    // A duplicate card is exactly what spaced repetition should avoid.
    const cards = parseCards(
      '[{"front":"What is X?","back":"A","topic":"T"},{"front":"what is x?","back":"B","topic":"T"}]'
    );
    expect(cards).toHaveLength(1);
  });

  it("defaults a missing topic rather than producing an empty label", () => {
    expect(parseCards('[{"front":"Q","back":"A"}]')[0].topic).toBe("General");
  });

  it("truncates over-long fields to the documented limits", () => {
    const cards = parseCards(
      JSON.stringify([{ front: "f".repeat(500), back: "b".repeat(900), topic: "t".repeat(200) }])
    );
    expect(cards[0].front.length).toBeLessThanOrEqual(200);
    expect(cards[0].back.length).toBeLessThanOrEqual(400);
    expect(cards[0].topic.length).toBeLessThanOrEqual(60);
  });

  it("caps the number of cards", () => {
    const many = Array.from({ length: MAX_CARDS + 15 }, (_, i) => ({
      front: `Q${i}`,
      back: `A${i}`,
      topic: "T",
    }));
    expect(parseCards(JSON.stringify(many))).toHaveLength(MAX_CARDS);
  });

  it("returns an empty list when the notes yield nothing", () => {
    expect(parseCards("[]")).toEqual([]);
  });

  it("throws on a response with no array at all", () => {
    expect(() => parseCards("I could not find anything.")).toThrow();
  });

  it("throws rather than silently accepting a non-array payload", () => {
    expect(() => parseCards('{"front":"Q","back":"A"}')).toThrow();
  });
});
