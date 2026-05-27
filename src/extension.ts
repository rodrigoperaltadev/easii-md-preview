import * as vscode from "vscode";
import { PreviewPanel } from "./preview/previewPanel";

const OPEN_PREVIEW_COMMAND = "easiiMdPreview.openPreview";

export function activate(context: vscode.ExtensionContext): void {
	const openPreview = vscode.commands.registerCommand(
		OPEN_PREVIEW_COMMAND,
		() => {
			const editor = vscode.window.activeTextEditor;

			if (!editor || !isMarkdownDocument(editor.document)) {
				vscode.window.showInformationMessage(
					"Open a Markdown document before running Easii Markdown Preview.",
				);
				return;
			}

			PreviewPanel.createOrShow(context.extensionUri, editor.document);
		},
	);

	context.subscriptions.push(openPreview);
}

export function deactivate(): void {
	// No global resources to dispose yet. Preview panels own their disposables.
}

function isMarkdownDocument(document: vscode.TextDocument): boolean {
	const fileName = document.fileName.toLowerCase();

	return (
		document.languageId === "markdown" ||
		fileName.endsWith(".md") ||
		fileName.endsWith(".markdown")
	);
}
