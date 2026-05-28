import * as path from "node:path";
import { vi } from "vitest";

vi.mock("vscode", () => {
	const uri = (fsPath: string) => ({
		fsPath,
		toString: () => fsPath,
	});

	return {
		Uri: {
			file: uri,
			joinPath: (base: { fsPath: string }, ...segments: string[]) =>
				uri(path.join(base.fsPath, ...segments)),
		},
		workspace: {
			workspaceFolders: [],
			textDocuments: [],
		},
		window: {
			activeTextEditor: undefined,
			visibleTextEditors: [],
			tabGroups: {
				activeTabGroup: {
					activeTab: undefined,
				},
			},
		},
	};
});
