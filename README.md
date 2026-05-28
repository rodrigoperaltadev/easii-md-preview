# Easii Markdown Preview

GitHub-style Markdown preview, export, and syntax highlighting for **VS Code** and **Cursor**.

## Features

- **Live preview** — GitHub-like rendering with tables, task lists, and debounced refresh while you edit
- **Syntax highlighting** — Shiki-powered fenced code blocks (theme follows your editor in preview)
- **Export to HTML** — Standalone file with inlined GitHub CSS
- **Export to PDF** — Uses your local Chrome, Edge, or Chromium (no bundled browser)
- **Security-first export** — Sanitized HTML, strict CSP, local images only in exports

## Requirements

- VS Code **1.120+** or Cursor with compatible extension host
- **PDF export:** Google Chrome, Microsoft Edge, or Chromium installed on the machine running the extension (not only on your laptop if you use Remote SSH)

## Commands

| Command | Description |
| --- | --- |
| `Easii Markdown Preview: Open Preview` | Open or focus preview for the active `.md` file |
| `Easii Markdown Preview: Export to HTML` | Save a standalone `.html` file |
| `Easii Markdown Preview: Export to PDF` | Save a `.pdf` file |

Open the Command Palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and search for **Easii Markdown Preview**.

## Settings

| Setting | Description |
| --- | --- |
| `easiiMdPreview.pdf.executablePath` | Absolute path to Chrome/Edge/Chromium for PDF export. Leave empty to auto-detect. |

## PDF export notes

- First export may take a few seconds while Shiki initializes.
- Remote/WSL hosts need Chromium libraries or a configured browser path — see [export security](docs/export-security.md).
- Remote images in Markdown are **not** embedded in export (by design).

## Known limitations

- No Mermaid or KaTeX yet
- No scroll sync between editor and preview
- Relative images work in preview via webview; export embeds local images under the document/workspace only

## Development

```bash
npm install
npm run bundle
npm test
```

Press **F5** in VS Code to launch the Extension Development Host (`preLaunchTask: bundle`).

Package a VSIX:

```bash
npm run package
```

## License

[ISC](LICENSE) — Copyright (c) Rodrigo Peralta

## Repository

https://github.com/rodrigoperaltadev/easii-md-preview
