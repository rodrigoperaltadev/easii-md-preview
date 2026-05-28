import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
	assertSafeExecutablePath,
	isPathWithinRoot,
	resolveReadableFileWithinRoots,
} from "../../src/export/security";

describe("export security helpers", () => {
	it("detects path traversal outside root", () => {
		const root = path.join(os.tmpdir(), "easii-root");
		const outside = path.join(os.tmpdir(), "easii-outside", "file.txt");

		expect(isPathWithinRoot(outside, root)).toBe(false);
	});

	it("allows files inside allowed roots", () => {
		const root = fs.mkdtempSync(path.join(os.tmpdir(), "easii-allowed-"));
		const filePath = path.join(root, "note.md");

		fs.writeFileSync(filePath, "# test");

		expect(resolveReadableFileWithinRoots(filePath, [root])).toBe(filePath);

		fs.rmSync(root, { recursive: true, force: true });
	});

	it("rejects shell binaries as browser executables", () => {
		expect(() => assertSafeExecutablePath("/bin/bash")).toThrow(
			/browser binary/i,
		);
	});
});
