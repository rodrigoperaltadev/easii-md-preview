import { highlightCodeToHtml } from "./shikiHighlighter";
import type { ShikiThemeId } from "./shikiTheme";

const FENCED_CODE_PATTERN =
	/<pre><code(?: class="language-([^"]*)")?>([\s\S]*?)<\/code><\/pre>/gi;

function decodeHtmlEntities(value: string): string {
	return value
		.replace(/&amp;/g, "&")
		.replace(/&lt;/g, "<")
		.replace(/&gt;/g, ">")
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

export async function highlightCodeBlocks(
	html: string,
	theme: ShikiThemeId,
): Promise<string> {
	const matches = [...html.matchAll(FENCED_CODE_PATTERN)];

	if (matches.length === 0) {
		return html;
	}

	let cursor = 0;
	let output = "";

	for (const match of matches) {
		const fullMatch = match[0];
		const index = match.index ?? 0;
		const language = match[1];
		const encoded = match[2] ?? "";
		const code = decodeHtmlEntities(encoded);
		const highlighted = await highlightCodeToHtml(code, language, theme);

		output += html.slice(cursor, index);
		output += highlighted;
		cursor = index + fullMatch.length;
	}

	output += html.slice(cursor);

	return output;
}
