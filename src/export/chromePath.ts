import * as fs from "node:fs";
import * as path from "node:path";
import { assertSafeExecutablePath } from "./security";

const MACOS_CANDIDATES = [
	"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
	"/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
	"/Applications/Chromium.app/Contents/MacOS/Chromium",
];

const LINUX_CANDIDATES = [
	"/usr/bin/google-chrome",
	"/usr/bin/google-chrome-stable",
	"/usr/bin/chromium",
	"/usr/bin/chromium-browser",
	"/snap/bin/chromium",
];

const WINDOWS_CANDIDATES = [
	path.join(
		process.env["PROGRAMFILES"] ?? "C:\\Program Files",
		"Google",
		"Chrome",
		"Application",
		"chrome.exe",
	),
	path.join(
		process.env["PROGRAMFILES(X86)"] ?? "C:\\Program Files (x86)",
		"Google",
		"Chrome",
		"Application",
		"chrome.exe",
	),
	path.join(
		process.env["PROGRAMFILES"] ?? "C:\\Program Files",
		"Microsoft",
		"Edge",
		"Application",
		"msedge.exe",
	),
];

function platformCandidates(): string[] {
	switch (process.platform) {
		case "darwin":
			return MACOS_CANDIDATES;
		case "linux":
			return LINUX_CANDIDATES;
		case "win32":
			return WINDOWS_CANDIDATES;
		default:
			return [];
	}
}

function isUsableExecutable(candidate: string): boolean {
	try {
		const stats = fs.statSync(candidate);
		return stats.isFile();
	} catch {
		return false;
	}
}

/**
 * Resolves a Chromium-based browser binary for PDF export.
 */
export function resolveChromeExecutable(
	configuredPath: string | undefined,
): string | undefined {
	if (configuredPath?.trim()) {
		assertSafeExecutablePath(configuredPath);
		return path.resolve(configuredPath.trim());
	}

	for (const candidate of platformCandidates()) {
		if (isUsableExecutable(candidate)) {
			return candidate;
		}
	}

	return undefined;
}

export const CHROME_MISSING_MESSAGE =
	"PDF export requires Google Chrome, Microsoft Edge, or Chromium. Install a browser or set easiiMdPreview.pdf.executablePath in settings.";
