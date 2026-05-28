import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { resolveReadableFileWithinRoots } from "./security";

const IMG_SRC_PATTERN =
	/<img\b([^>]*?)\bsrc=(["'])([^"']+)\2([^>]*)>/gi;

const MAX_EMBED_BYTES = 5 * 1024 * 1024;

const ALLOWED_IMAGE_EXTENSIONS = new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".webp",
	".svg",
]);

export interface EmbedAssetsResult {
	html: string;
	embeddedImages: number;
	removedRemoteImages: number;
	skippedUnsafeImages: number;
}

function isRemoteSource(src: string): boolean {
	const normalized = src.trim().toLowerCase();

	return (
		normalized.startsWith("http://") ||
		normalized.startsWith("https://") ||
		normalized.startsWith("//") ||
		normalized.startsWith("data:") ||
		normalized.startsWith("javascript:") ||
		normalized.startsWith("vbscript:")
	);
}

function toDataUri(filePath: string): string | undefined {
	const extension = path.extname(filePath).toLowerCase();

	if (!ALLOWED_IMAGE_EXTENSIONS.has(extension)) {
		return undefined;
	}

	const stats = fs.statSync(filePath);

	if (stats.size > MAX_EMBED_BYTES) {
		return undefined;
	}

	const buffer = fs.readFileSync(filePath);
	const mimeType = extension === ".svg" ? "image/svg+xml" : `image/${extension.slice(1)}`;

	return `data:${mimeType};base64,${buffer.toString("base64")}`;
}

/**
 * Embeds local images as data URIs and strips remote/unsafe image sources.
 */
export function embedLocalImages(
	html: string,
	documentUri: vscode.Uri,
	workspaceFolders: readonly vscode.WorkspaceFolder[],
): EmbedAssetsResult {
	const documentDir = path.dirname(documentUri.fsPath);
	const allowedRoots = [
		documentDir,
		...workspaceFolders.map((folder) => folder.uri.fsPath),
	];

	let embeddedImages = 0;
	let removedRemoteImages = 0;
	let skippedUnsafeImages = 0;

	const rewritten = html.replace(
		IMG_SRC_PATTERN,
		(_match, before: string, quote: string, src: string, after: string) => {
			if (isRemoteSource(src)) {
				removedRemoteImages += 1;
				return `<img${before}src=${quote}${quote}${after} alt="[image removed for export security]">`;
			}

			const candidatePath = path.isAbsolute(src)
				? src
				: path.resolve(documentDir, src);

			const safePath = resolveReadableFileWithinRoots(
				candidatePath,
				allowedRoots,
			);

			if (!safePath) {
				skippedUnsafeImages += 1;
				return `<img${before}src=${quote}${quote}${after} alt="[image unavailable]">`;
			}

			const dataUri = toDataUri(safePath);

			if (!dataUri) {
				skippedUnsafeImages += 1;
				return `<img${before}src=${quote}${quote}${after} alt="[image unavailable]">`;
			}

			embeddedImages += 1;
			return `<img${before}src=${quote}${dataUri}${quote}${after}>`;
		},
	);

	return {
		html: rewritten,
		embeddedImages,
		removedRemoteImages,
		skippedUnsafeImages,
	};
}
