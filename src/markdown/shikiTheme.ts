import * as vscode from "vscode";

export type ShikiThemeId = "github-light" | "github-dark";

export function resolvePreviewShikiTheme(): ShikiThemeId {
	const kind = vscode.window.activeColorTheme.kind;

	if (
		kind === vscode.ColorThemeKind.Light ||
		kind === vscode.ColorThemeKind.HighContrastLight
	) {
		return "github-light";
	}

	return "github-dark";
}

export function resolveExportShikiTheme(): ShikiThemeId {
	return "github-light";
}
