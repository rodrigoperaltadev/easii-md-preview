import * as vscode from "vscode";
import { renderMarkdown } from "../markdown/renderer";
import { debounce } from "../utils/debounce";
import { setPreviewTrackedDocument } from "../utils/markdownDocument";
import { getWebviewHtml } from "./webviewHtml";

const REFRESH_DEBOUNCE_MS = 250;

export class PreviewPanel {
	private static currentPanel: PreviewPanel | undefined;

	private readonly disposables: vscode.Disposable[] = [];
	private readonly debouncedUpdate = debounce(() => {
		this.update();
	}, REFRESH_DEBOUNCE_MS);

	private constructor(
		private readonly panel: vscode.WebviewPanel,
		private readonly extensionUri: vscode.Uri,
		private document: vscode.TextDocument,
	) {
		this.panel.onDidDispose(() => this.dispose(), null, this.disposables);

		const changeSubscription = vscode.workspace.onDidChangeTextDocument(
			(event) => {
				if (
					event.document.uri.toString() !== this.document.uri.toString()
				) {
					return;
				}

				this.debouncedUpdate();
			},
		);
		this.disposables.push(changeSubscription);

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
		setPreviewTrackedDocument(document);
	}

	update(document = this.document): void {
		this.document = document;
		setPreviewTrackedDocument(document);
		this.panel.title = `Preview: ${document.fileName.split(/[\\/]/).pop() ?? "Markdown"}`;
		this.panel.webview.html = getWebviewHtml(
			this.panel.webview,
			this.extensionUri,
			renderMarkdown(document.getText()),
		);
	}

	dispose(): void {
		PreviewPanel.currentPanel = undefined;
		setPreviewTrackedDocument(undefined);
		this.debouncedUpdate.cancel();

		while (this.disposables.length > 0) {
			this.disposables.pop()?.dispose();
		}
	}
}
