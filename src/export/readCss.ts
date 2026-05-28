import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";
import { isPathWithinRoot } from "./security";

const GITHUB_CSS_RELATIVE = path.join(
	"node_modules",
	"github-markdown-css",
	"github-markdown.css",
);

/**
 * Reads github-markdown-css only from the extension install directory.
 */
export function readGithubMarkdownCss(extensionUri: vscode.Uri): string {
	const cssPath = path.join(extensionUri.fsPath, GITHUB_CSS_RELATIVE);

	if (!isPathWithinRoot(cssPath, extensionUri.fsPath)) {
		throw new Error("Refusing to read CSS outside the extension directory.");
	}

	return fs.readFileSync(cssPath, "utf8");
}
