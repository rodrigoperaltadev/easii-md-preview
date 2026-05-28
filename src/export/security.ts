import * as fs from "node:fs";
import * as path from "node:path";

const BLOCKED_EXECUTABLE_NAMES = new Set([
	"sh",
	"bash",
	"zsh",
	"cmd",
	"powershell",
	"pwsh",
]);

/**
 * Validates a user-supplied browser binary path before launch.
 */
export function assertSafeExecutablePath(executablePath: string): void {
	const trimmed = executablePath.trim();

	if (!trimmed) {
		throw new Error("Executable path is empty.");
	}

	if (trimmed.includes("\0")) {
		throw new Error("Executable path contains invalid characters.");
	}

	const resolved = path.resolve(trimmed);
	const baseName = path.basename(resolved).toLowerCase();

	if (BLOCKED_EXECUTABLE_NAMES.has(baseName)) {
		throw new Error("Executable path must point to a browser binary.");
	}

	let stats: fs.Stats;

	try {
		stats = fs.statSync(resolved);
	} catch {
		throw new Error(`Executable not found: ${resolved}`);
	}

	if (!stats.isFile()) {
		throw new Error(`Executable path is not a file: ${resolved}`);
	}
}

/**
 * Returns true when `candidate` resolves inside `root` (no path traversal).
 */
export function isPathWithinRoot(candidate: string, root: string): boolean {
	const resolvedCandidate = path.resolve(candidate);
	const resolvedRoot = path.resolve(root);

	if (resolvedCandidate === resolvedRoot) {
		return true;
	}

	const relative = path.relative(resolvedRoot, resolvedCandidate);

	return (
		relative !== "" &&
		!relative.startsWith("..") &&
		!path.isAbsolute(relative)
	);
}

/**
 * Resolves a readable file path only when it stays inside one of the allowed roots.
 */
export function resolveReadableFileWithinRoots(
	candidatePath: string,
	allowedRoots: string[],
): string | undefined {
	const resolvedCandidate = path.resolve(candidatePath);

	for (const root of allowedRoots) {
		if (!isPathWithinRoot(resolvedCandidate, root)) {
			continue;
		}

		try {
			const stats = fs.statSync(resolvedCandidate);

			if (stats.isFile()) {
				return resolvedCandidate;
			}
		} catch {
			return undefined;
		}
	}

	return undefined;
}
