import { describe, expect, it } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FormattedContent, renderInlineMarkdown } from "@/components/FormattedContent";

describe("FormattedContent component", () => {
  it("returns null for empty or whitespace content", () => {
    expect(renderToStaticMarkup(React.createElement(FormattedContent, { content: "" }))).toBe("");
    expect(renderToStaticMarkup(React.createElement(FormattedContent, { content: "   " }))).toBe("");
    expect(renderToStaticMarkup(React.createElement(FormattedContent, { content: null }))).toBe("");
    expect(renderToStaticMarkup(React.createElement(FormattedContent, { content: undefined }))).toBe("");
  });

  it("renders ordinary paragraphs with base typography size", () => {
    const html = renderToStaticMarkup(
      React.createElement(FormattedContent, {
        content: "This is an ideal model answer with detailed explanation.",
      })
    );
    expect(html).toContain("This is an ideal model answer with detailed explanation.");
    expect(html).toContain("text-zinc-800");
  });

  it("renders large size typography when size='lg' is provided", () => {
    const html = renderToStaticMarkup(
      React.createElement(FormattedContent, {
        content: "Explain the working principle of B-trees.",
        size: "lg",
      })
    );
    expect(html).toContain("text-base sm:text-lg");
  });

  it("renders markdown headings (#, ##, ###) as semantic heading elements", () => {
    const content = "# Primary Concept\n## Secondary Concept\n### Implementation Details";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("<h2");
    expect(html).toContain("Primary Concept");
    expect(html).toContain("<h3");
    expect(html).toContain("Secondary Concept");
    expect(html).toContain("<h4");
    expect(html).toContain("Implementation Details");
  });

  it("renders numbered and ordered lists with correct markers", () => {
    const content = "1. First key reason\n2. Second key reason\n3. Third key reason";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("<ol");
    expect(html).toContain("1.");
    expect(html).toContain("First key reason");
    expect(html).toContain("2.");
    expect(html).toContain("Second key reason");
  });

  it("renders unordered bullet lists with custom bullet styling", () => {
    const content = "- High branching factor\n- Shallow search depth\n- Balanced tree guarantees";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("<ul");
    expect(html).toContain("High branching factor");
    expect(html).toContain("Shallow search depth");
  });

  it("renders markdown tables properly with headers and rows", () => {
    const content =
      "| Structure | Branching | Search Time |\n|---|---|---|\n| B-Tree | Multi-way | O(log N) |\n| BST | Binary | O(N) |";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("<table");
    expect(html).toContain("<th");
    expect(html).toContain("Structure");
    expect(html).toContain("Branching");
    expect(html).toContain("<td");
    expect(html).toContain("B-Tree");
    expect(html).toContain("O(log N)");
  });

  it("renders callout and key point labels with distinct styling", () => {
    const content = "**Key Concept:** B-trees maintain balance through node splitting and merging.";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("Key Concept:");
    expect(html).toContain("B-trees maintain balance");
  });

  it("renders code blocks with language badge and copy action", () => {
    const content = "```python\ndef search_btree(root, key):\n    return root.search(key)\n```";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("python");
    expect(html).toContain("def search_btree");
    expect(html).toContain("Copy");
  });

  it("renders blockquotes with accent borders", () => {
    const content = "> Note: All leaf nodes must reside at the exact same depth.";
    const html = renderToStaticMarkup(React.createElement(FormattedContent, { content }));
    expect(html).toContain("<blockquote");
    expect(html).toContain("All leaf nodes must reside at the exact same depth.");
  });

  it("renders inline markdown tokens (bold, italic, code, links)", () => {
    const nodes = renderInlineMarkdown(
      "A **B-tree** uses `keys` to maintain *strict balance* as documented at [Docs](https://example.com)."
    );
    const html = renderToStaticMarkup(React.createElement("div", null, ...nodes));
    expect(html).toContain("<strong");
    expect(html).toContain("B-tree");
    expect(html).toContain("<code");
    expect(html).toContain("keys");
    expect(html).toContain("<em");
    expect(html).toContain("strict balance");
    expect(html).toContain("<a href=\"https://example.com\"");
    expect(html).toContain("Docs");
  });
});
