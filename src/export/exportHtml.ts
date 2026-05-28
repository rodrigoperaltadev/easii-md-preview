import * as vscode from "vscode";
import { readGithubMarkdownCss } from "./readCss";

const EXPORT_CSP = [
	"default-src 'none'",
	"style-src 'unsafe-inline'",
	"img-src data:",
	"font-src 'none'",
	"script-src 'none'",
	"connect-src 'none'",
	"frame-src 'none'",
	"object-src 'none'",
	"base-uri 'none'",
	"form-action 'none'",
].join("; ");

export function buildExportHtml(
	extensionUri: vscode.Uri,
	renderedBody: string,
	forPdf = false,
): string {
	const githubCss = readGithubMarkdownCss(extensionUri);
	const pdfStyles = forPdf ? PDF_EXPORT_STYLES : "";

	return /* html */ `<!DOCTYPE html>
<html lang="en"${forPdf ? ' class="export-pdf"' : ""}>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="${EXPORT_CSP}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
${githubCss}
  </style>
  <style>
    body {
      margin: 0;
      padding: 24px;
      color: #24292f;
      background: #ffffff;
    }

    .markdown-body {
      box-sizing: border-box;
      min-width: 200px;
      max-width: ${forPdf ? "100%" : "980px"};
      width: 100%;
      margin: 0 auto;
      background: transparent;
    }

    .markdown-body input[type='checkbox'] {
      pointer-events: none;
    }

    .markdown-body a {
      color: #0969da;
      text-decoration: underline;
    }

    .markdown-body pre.shiki {
      overflow: auto;
      border-radius: 6px;
      padding: 16px;
      margin-bottom: 16px;
    }

    .markdown-body pre.shiki code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.85em;
    }
${pdfStyles}
  </style>
  <title>Markdown Export</title>
</head>
<body>
  <article class="markdown-body">
${renderedBody}
  </article>
</body>
</html>`;
}

/** PDF-only: no horizontal scroll in print — wrap long lines inside fenced code blocks. */
const PDF_EXPORT_STYLES = `
    html.export-pdf body {
      padding: 16px;
    }

    html.export-pdf .markdown-body {
      min-width: 0;
      max-width: 100%;
      overflow-wrap: anywhere;
    }

    html.export-pdf .markdown-body pre,
    html.export-pdf .markdown-body .highlight,
    html.export-pdf .markdown-body .highlight pre,
    html.export-pdf .markdown-body div.highlight {
      max-width: 100% !important;
      box-sizing: border-box !important;
    }

    html.export-pdf .markdown-body pre,
    html.export-pdf .markdown-body .highlight pre {
      overflow: visible !important;
      overflow-x: visible !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow-wrap: anywhere !important;
      word-break: break-word;
    }

    html.export-pdf .markdown-body pre code,
    html.export-pdf .markdown-body pre tt,
    html.export-pdf .markdown-body pre > code,
    html.export-pdf .markdown-body .highlight pre code {
      display: block !important;
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      overflow-wrap: anywhere !important;
      word-break: break-word;
      max-width: 100% !important;
    }

    html.export-pdf .markdown-body :not(pre) > code {
      white-space: pre-wrap;
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    @media print {
      html.export-pdf .markdown-body pre,
      html.export-pdf .markdown-body pre code {
        white-space: pre-wrap !important;
        overflow-wrap: anywhere !important;
      }
    }
`;
