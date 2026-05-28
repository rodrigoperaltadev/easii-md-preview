import * as vscode from "vscode";

const MARKDOWN_LANGUAGE_IDS = new Set([
	"markdown",
	"mdx",
	"quarto",
	"rmd",
	"rmarkdown",
]);

const MARKDOWN_EXTENSIONS = [".md", ".markdown", ".mdx", ".mdc", ".qmd"];

let lastFocusedMarkdown: vscode.TextDocument | undefined;
let previewTrackedDocument: vscode.TextDocument | undefined;

export function isMarkdownDocument(document: vscode.TextDocument): boolean {
	if (MARKDOWN_LANGUAGE_IDS.has(document.languageId)) {
		return true;
	}

	const fileName = document.fileName.toLowerCase();

	return MARKDOWN_EXTENSIONS.some((extension) =>
		fileName.endsWith(extension),
	);
}

export function trackMarkdownEditorFocus(
	context: vscode.ExtensionContext,
): void {
	const subscription = vscode.window.onDidChangeActiveTextEditor((editor) => {
		if (editor && isMarkdownDocument(editor.document)) {
			lastFocusedMarkdown = editor.document;
		}
	});

	context.subscriptions.push(subscription);

	const active = vscode.window.activeTextEditor;

	if (active && isMarkdownDocument(active.document)) {
		lastFocusedMarkdown = active.document;
	}
}

export function setPreviewTrackedDocument(
	document: vscode.TextDocument | undefined,
): void {
	previewTrackedDocument = document;
}

function isOpenDocument(document: vscode.TextDocument): boolean {
	return !document.isClosed;
}

/**
 * Resolves the Markdown document to preview/export when the command palette
 * steals focus from the text editor (common with webviews and side panels).
 */
export function resolveMarkdownDocument(): vscode.TextDocument | undefined {
	const active = vscode.window.activeTextEditor;

	if (active && isMarkdownDocument(active.document)) {
		return active.document;
	}

	if (lastFocusedMarkdown && isOpenDocument(lastFocusedMarkdown)) {
		return lastFocusedMarkdown;
	}

	if (previewTrackedDocument && isOpenDocument(previewTrackedDocument)) {
		return previewTrackedDocument;
	}

	const visibleMarkdown = vscode.window.visibleTextEditors
		.map((editor) => editor.document)
		.filter(isMarkdownDocument);

	if (visibleMarkdown.length === 1) {
		return visibleMarkdown[0];
	}

	const activeGroup = vscode.window.tabGroups.activeTabGroup;
	const activeTabDocument = activeGroup.activeTab?.input;

	if (
		activeTabDocument &&
		typeof activeTabDocument === "object" &&
		"uri" in activeTabDocument
	) {
		const uri = (activeTabDocument as { uri: vscode.Uri }).uri;
		const document = vscode.workspace.textDocuments.find(
			(candidate) => candidate.uri.toString() === uri.toString(),
		);

		if (document && isMarkdownDocument(document)) {
			return document;
		}
	}

	return undefined;
}

export const NO_MARKDOWN_EDITOR_MESSAGE =
	"Open a Markdown file in the editor (click its tab so it has focus), then run the command again.";
