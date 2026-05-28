import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as vscode from "vscode";
import { renderMarkdownForExport } from "../markdown/renderer";
import {
	NO_MARKDOWN_EDITOR_MESSAGE,
	resolveMarkdownDocument,
} from "../utils/markdownDocument";
import { CHROME_MISSING_MESSAGE, resolveChromeExecutable } from "./chromePath";
import { buildExportHtml } from "./exportHtml";
import { generatePdf } from "./pdfGenerator";
import { embedLocalImages, type EmbedAssetsResult } from "./resolveAssets";

export type ExportFormat = "html" | "pdf";

function defaultExportUri(
	document: vscode.TextDocument,
	format: ExportFormat,
): vscode.Uri {
	const baseName = path.basename(
		document.fileName,
		path.extname(document.fileName),
	);
	const extension = format === "html" ? ".html" : ".pdf";

	return vscode.Uri.file(
		path.join(path.dirname(document.fileName), `${baseName}${extension}`),
	);
}

function formatSecuritySummary(result: EmbedAssetsResult): string | undefined {
	const parts: string[] = [];

	if (result.removedRemoteImages > 0) {
		parts.push(
			`${result.removedRemoteImages} remote image(s) removed for export security`,
		);
	}

	if (result.skippedUnsafeImages > 0) {
		parts.push(
			`${result.skippedUnsafeImages} image(s) skipped (path or size limits)`,
		);
	}

	return parts.length > 0 ? parts.join("; ") + "." : undefined;
}

async function prepareExportHtml(
	extensionUri: vscode.Uri,
	document: vscode.TextDocument,
	format: ExportFormat,
): Promise<{ html: string; assetResult: EmbedAssetsResult }> {
	const rendered = await renderMarkdownForExport(document.getText());
	const workspaceFolders = vscode.workspace.workspaceFolders ?? [];
	const assetResult = embedLocalImages(
		rendered,
		document.uri,
		workspaceFolders,
	);
	const html = buildExportHtml(
		extensionUri,
		assetResult.html,
		format === "pdf",
	);

	return { html, assetResult };
}

export async function exportActiveDocument(
	extensionUri: vscode.Uri,
	format: ExportFormat,
): Promise<void> {
	const document = resolveMarkdownDocument();

	if (!document) {
		await vscode.window.showInformationMessage(NO_MARKDOWN_EDITOR_MESSAGE);
		return;
	}
	const defaultUri = defaultExportUri(document, format);
	const filters: Record<string, string[]> =
		format === "html" ? { HTML: ["html"] } : { PDF: ["pdf"] };

	const targetUri = await vscode.window.showSaveDialog({
		defaultUri,
		filters,
		saveLabel: format === "html" ? "Export HTML" : "Export PDF",
	});

	if (!targetUri) {
		return;
	}

	const { html, assetResult } = await prepareExportHtml(
		extensionUri,
		document,
		format,
	);
	const securityNote = formatSecuritySummary(assetResult);

	try {
		if (format === "html") {
			await fs.writeFile(targetUri.fsPath, html, "utf8");
		} else {
			const configuredPath = vscode.workspace
				.getConfiguration("easiiMdPreview.pdf")
				.get<string>("executablePath");
			const chromePath = resolveChromeExecutable(configuredPath);

			if (!chromePath) {
				await vscode.window.showErrorMessage(CHROME_MISSING_MESSAGE);
				return;
			}

			await vscode.window.withProgress(
				{
					location: vscode.ProgressLocation.Notification,
					title: "Easii Markdown Preview",
					cancellable: false,
				},
				async () => {
					await generatePdf(html, targetUri.fsPath, chromePath);
				},
			);
		}

		const messages = [
			`Exported ${format.toUpperCase()} to ${path.basename(targetUri.fsPath)}.`,
		];

		if (securityNote) {
			messages.push(securityNote);
		}

		await vscode.window.showInformationMessage(messages.join(" "));
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Unknown export error";

		await vscode.window.showErrorMessage(
			`Export failed: ${message}`,
		);
	}
}
