/**
 * Text-to-speech sanitisation.
 *
 * Questions are stored with LaTeX and markdown in them. Feeding that straight
 * to a screen reader produces "dollar backslash frac open brace" — actively
 * worse than no audio for the students this feature exists to serve.
 */

import { describe, expect, it } from "vitest";
import { sanitizeForSpeech } from "@/components/ReadAloud";

describe("sanitizeForSpeech", () => {
  it("unwraps inline LaTeX rather than reading the delimiters", () => {
    expect(sanitizeForSpeech("The value of $x + 1$ is two.")).toBe("The value of x + 1 is two.");
  });

  it("unwraps display LaTeX", () => {
    expect(sanitizeForSpeech("Solve $$a^2 + b^2$$ now")).toBe("Solve a^2 + b^2 now");
  });

  it("drops LaTeX commands", () => {
    expect(sanitizeForSpeech("Compute \\frac{1}{2} exactly")).toBe("Compute 1 2 exactly");
  });

  it("strips markdown emphasis and code marks", () => {
    expect(sanitizeForSpeech("**Bold** and `code` and _italic_")).toBe("Bold and code and italic");
  });

  it("collapses the whitespace left behind", () => {
    expect(sanitizeForSpeech("a    b\n\nc")).toBe("a b c");
  });

  it("leaves ordinary prose untouched", () => {
    const prose = "Explain what a B-tree is and why databases use it.";
    expect(sanitizeForSpeech(prose)).toBe(prose);
  });

  it("handles empty and whitespace-only input", () => {
    expect(sanitizeForSpeech("")).toBe("");
    expect(sanitizeForSpeech("   \n  ")).toBe("");
  });

  it("never leaves a bare delimiter in the spoken text", () => {
    const out = sanitizeForSpeech("Given $\\alpha$ and **$\\beta$**, find $\\gamma$.");
    expect(out).not.toContain("$");
    expect(out).not.toContain("\\");
    expect(out).not.toContain("*");
  });
});
