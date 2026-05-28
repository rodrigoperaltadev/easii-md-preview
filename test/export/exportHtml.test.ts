import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as vscode from "vscode";
import { buildExportHtml } from "../../src/export/exportHtml";

const projectRoot = path.resolve(
	path.dirname(fileURLToPath(import.meta.url)),
	"..",
	"..",
);

describe("buildExportHtml", () => {
	it("builds standalone html with github markdown css", () => {
		const html = buildExportHtml(
			vscode.Uri.file(projectRoot),
			"<p>Export body</p>",
			false,
		);

		expect(html).toContain("<!DOCTYPE html>");
		expect(html).toContain("markdown-body");
		expect(html).toContain("Export body");
		expect(html).toContain(".markdown-body {");
		expect(html).toContain("Content-Security-Policy");
	});

	it("adds pdf-only wrap styles when forPdf is true", () => {
		const html = buildExportHtml(
			vscode.Uri.file(projectRoot),
			"<pre><code>long line</code></pre>",
			true,
		);

		expect(html).toContain('class="export-pdf"');
		expect(html).toContain("pre-wrap");
	});
});
