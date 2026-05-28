import { describe, expect, it } from "vitest";
import { renderMarkdown } from "../../src/markdown/renderer";

describe("renderMarkdown with Shiki", () => {
	it(
		"highlights fenced TypeScript code blocks",
		async () => {
			const html = await renderMarkdown(
				"```typescript\nconst value = 1;\n```",
				{ theme: "github-light" },
			);

			expect(html).toContain('class="shiki');
			expect(html).toContain("const");
			expect(html).not.toMatch(/<pre><code class="language-typescript">/);
		},
		30_000,
	);
});
