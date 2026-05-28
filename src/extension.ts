import * as vscode from "vscode";
import { exportActiveDocument } from "./export/exportDocument";
import { PreviewPanel } from "./preview/previewPanel";
import {
	NO_MARKDOWN_EDITOR_MESSAGE,
	resolveMarkdownDocument,
	trackMarkdownEditorFocus,
} from "./utils/markdownDocument";

const OPEN_PREVIEW_COMMAND = "easiiMdPreview.openPreview";
const EXPORT_HTML_COMMAND = "easiiMdPreview.exportHtml";
const EXPORT_PDF_COMMAND = "easiiMdPreview.exportPdf";

export function activate(context: vscode.ExtensionContext): void {
	trackMarkdownEditorFocus(context);

	const openPreview = vscode.commands.registerCommand(
		OPEN_PREVIEW_COMMAND,
		() => {
			const document = resolveMarkdownDocument();

			if (!document) {
				void vscode.window.showInformationMessage(NO_MARKDOWN_EDITOR_MESSAGE);
				return;
			}

			PreviewPanel.createOrShow(context.extensionUri, document);
		},
	);

	const exportHtml = vscode.commands.registerCommand(
		EXPORT_HTML_COMMAND,
		() => exportActiveDocument(context.extensionUri, "html"),
	);

	const exportPdf = vscode.commands.registerCommand(
		EXPORT_PDF_COMMAND,
		() => exportActiveDocument(context.extensionUri, "pdf"),
	);

	context.subscriptions.push(openPreview, exportHtml, exportPdf);
}

export function deactivate(): void {
	// No global resources to dispose yet. Preview panels own their disposables.
}
