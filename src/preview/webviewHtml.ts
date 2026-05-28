import * as vscode from "vscode";
import { GITHUB_MARKDOWN_CSS_PARTS } from "../constants/assets";

export function getWebviewHtml(
	webview: vscode.Webview,
	extensionUri: vscode.Uri,
	renderedMarkdown: string,
): string {
	const githubMarkdownCssUri = webview.asWebviewUri(
		vscode.Uri.joinPath(extensionUri, ...GITHUB_MARKDOWN_CSS_PARTS),
	);

	const csp = [
		"default-src 'none'",
		`img-src ${webview.cspSource} data: https:`,
		`style-src ${webview.cspSource} 'unsafe-inline'`,
		`font-src ${webview.cspSource}`,
	].join("; ");

	return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${csp}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${githubMarkdownCssUri}">
  <style>
    body {
      margin: 0;
      padding: 24px;
      color: var(--vscode-editor-foreground);
      background: var(--vscode-editor-background);
    }

    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: 980px;
      margin: 0 auto;
      background: transparent;
      color: inherit;
    }

    .markdown-body input[type='checkbox'] {
      pointer-events: none;
    }

    .markdown-body pre.shiki {
      overflow: auto;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .markdown-body pre.shiki code {
      font-family: var(--vscode-editor-font-family, ui-monospace, monospace);
      font-size: 0.85em;
    }
  </style>
  <title>Easii Markdown Preview</title>
</head>
<body>
  <article class="markdown-body">
${renderedMarkdown}
  </article>
</body>
</html>`;
}
