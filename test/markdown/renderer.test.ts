import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../../src/markdown/renderer";

describe("renderMarkdown", () => {
	it("renders headings and paragraphs", () => {
		const html = renderMarkdown("# Title\n\nHello world.");

		expect(html).toContain("<h1>");
		expect(html).toContain("Title");
		expect(html).toContain("<p>");
		expect(html).toContain("Hello world.");
	});

	it("renders GFM tables", () => {
		const html = renderMarkdown("| A | B |\n| --- | --- |\n| 1 | 2 |");

		expect(html).toContain("<table>");
		expect(html).toContain("<td>");
	});

	it("renders task list checkboxes as disabled inputs", () => {
		const html = renderMarkdown("- [ ] Open\n- [x] Done");

		expect(html).toContain('type="checkbox"');
		expect(html).toContain("disabled");
	});

	it("strips script injection from markdown", () => {
		const html = renderMarkdown('<script>alert("x")</script>\n\n# Safe');

		expect(html.toLowerCase()).not.toContain("<script");
		expect(html).toContain("Safe");
	});
});
