const BUNDLED_LANGS = [
	"bash",
	"css",
	"go",
	"html",
	"java",
	"javascript",
	"json",
	"markdown",
	"plaintext",
	"python",
	"rust",
	"shell",
	"sql",
	"typescript",
	"tsx",
	"xml",
	"yaml",
];

const LANG_ALIASES: Record<string, string> = {
	js: "javascript",
	jsx: "javascript",
	ts: "typescript",
	md: "markdown",
	sh: "bash",
	shellsession: "bash",
	text: "plaintext",
	txt: "plaintext",
	yml: "yaml",
};

type CodeHighlighter = {
	codeToHtml: (
		code: string,
		options: { lang: string; theme: "github-light" | "github-dark" },
	) => string;
};

let highlighterPromise: Promise<CodeHighlighter> | undefined;

async function loadHighlighter(): Promise<CodeHighlighter> {
	const { createHighlighter } = await import("shiki");

	return createHighlighter({
		themes: ["github-light", "github-dark"],
		langs: BUNDLED_LANGS,
	});
}

export function getShikiHighlighter(): Promise<CodeHighlighter> {
	if (!highlighterPromise) {
		highlighterPromise = loadHighlighter();
	}

	return highlighterPromise;
}

export function normalizeLanguageId(language: string | undefined): string {
	const raw = (language ?? "").trim().toLowerCase();

	if (!raw) {
		return "plaintext";
	}

	const base = raw.split(/[\s#]/)[0];

	return LANG_ALIASES[base] ?? base;
}

export async function highlightCodeToHtml(
	code: string,
	language: string | undefined,
	theme: "github-light" | "github-dark",
): Promise<string> {
	const highlighter = await getShikiHighlighter();
	const lang = normalizeLanguageId(language);

	try {
		return highlighter.codeToHtml(code, { lang, theme });
	} catch {
		return highlighter.codeToHtml(code, { lang: "plaintext", theme });
	}
}
