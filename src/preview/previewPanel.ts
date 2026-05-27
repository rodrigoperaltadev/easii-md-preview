import * as vscode from "vscode";
import { renderMarkdown } from "../markdown/renderer";
import { getWebviewHtml } from "./webviewHtml";

export class PreviewPanel {
	private static currentPanel: PreviewPanel | undefined;

	private readonly disposables: vscode.Disposable[] = [];

	private constructor(
		private readonly panel: vscode.WebviewPanel,
		private readonly extensionUri: vscode.Uri,
		private document: vscode.TextDocument,
	) {
		this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
		this.update(document);
	}

	static createOrShow(
		extensionUri: vscode.Uri,
		document: vscode.TextDocument,
	): void {
		if (PreviewPanel.currentPanel) {
			PreviewPanel.currentPanel.document = document;
			PreviewPanel.currentPanel.panel.reveal(vscode.ViewColumn.Beside);
			PreviewPanel.currentPanel.update(document);
			return;
		}

		const panel = vscode.window.createWebviewPanel(
			"easiiMarkdownPreview",
			`Preview: ${document.fileName.split(/[\\/]/).pop() ?? "Markdown"}`,
			vscode.ViewColumn.Beside,
			{
				enableScripts: false,
				localResourceRoots: [extensionUri],
			},
		);

		PreviewPanel.currentPanel = new PreviewPanel(panel, extensionUri, document);
	}

	update(document = this.document): void {
		this.document = document;
		this.panel.title = `Preview: ${document.fileName.split(/[\\/]/).pop() ?? "Markdown"}`;
		this.panel.webview.html = getWebviewHtml(
			this.panel.webview,
			this.extensionUri,
			renderMarkdown(document.getText()),
		);
	}

	dispose(): void {
		PreviewPanel.currentPanel = undefined;

		while (this.disposables.length > 0) {
			this.disposables.pop()?.dispose();
		}
	}
}
