import MarkdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";
import { highlightCodeBlocks } from "./highlightCodeBlocks";
import { sanitizeRenderedHtml } from "./sanitize";
import {
	resolveExportShikiTheme,
	resolvePreviewShikiTheme,
	type ShikiThemeId,
} from "./shikiTheme";

const markdown = new MarkdownIt({
	html: false,
	linkify: true,
	typographer: false,
}).use(taskLists, {
	enabled: false,
	label: false,
	labelAfter: false,
});

export interface RenderMarkdownOptions {
	theme?: ShikiThemeId;
}

function resolveTheme(options?: RenderMarkdownOptions): ShikiThemeId {
	return options?.theme ?? resolvePreviewShikiTheme();
}

export async function renderMarkdown(
	source: string,
	options?: RenderMarkdownOptions,
): Promise<string> {
	const sanitized = sanitizeRenderedHtml(markdown.render(source));
	const theme = resolveTheme(options);

	return highlightCodeBlocks(sanitized, theme);
}

export async function renderMarkdownForExport(
	source: string,
): Promise<string> {
	return renderMarkdown(source, { theme: resolveExportShikiTheme() });
}

/** @deprecated Use {@link renderMarkdown} — kept for quick sync markdown-it output in tests. */
export function renderMarkdownWithoutHighlighting(source: string): string {
	return sanitizeRenderedHtml(markdown.render(source));
}
