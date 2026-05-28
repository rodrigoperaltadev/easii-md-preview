import { describe, expect, it } from "vitest";
import { sanitizeRenderedHtml } from "../../src/markdown/sanitize";

describe("sanitizeRenderedHtml", () => {
	it("removes script tags from raw html", () => {
		const html = sanitizeRenderedHtml(
			'<p>ok</p><script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)">',
		);

		expect(html.toLowerCase()).not.toContain("<script");
		expect(html).toContain("ok");
	});

	it("adds rel noopener on links", () => {
		const html = sanitizeRenderedHtml('<a href="https://example.com">link</a>');

		expect(html).toContain('rel="noopener noreferrer"');
	});
});
