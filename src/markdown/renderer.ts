import MarkdownIt from "markdown-it";
import taskLists from "markdown-it-task-lists";
import { sanitizeRenderedHtml } from "./sanitize";

const markdown = new MarkdownIt({
	html: false,
	linkify: true,
	typographer: false,
}).use(taskLists, {
	enabled: false,
	label: false,
	labelAfter: false,
});

export function renderMarkdown(source: string): string {
	return sanitizeRenderedHtml(markdown.render(source));
}
