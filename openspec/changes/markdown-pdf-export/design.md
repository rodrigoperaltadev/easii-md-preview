# Markdown PDF Export — Design

## Summary

Add export capabilities that reuse the MVP Markdown rendering pipeline. Split delivery into HTML export (low risk) and PDF export (Puppeteer-based). Keep preview webview security unchanged (`enableScripts: false`).

## Architecture

```text
User runs export command
        │
        ▼
extension.ts ── validates active .md document
        │
        ▼
export/exportDocument.ts ── orchestrates format (html | pdf)
        │
        ├─► markdown/renderer.ts (existing)
        ├─► markdown/sanitize.ts (existing)
        └─► export/exportHtml.ts (new — print-safe shell, inlined CSS)
                │
                ├─► [html] write .html via vscode.window.showSaveDialog
                └─► [pdf] export/pdfGenerator.ts — puppeteer page.pdf()
```

## Proposed Source Structure

```text
src/
  export/
    exportDocument.ts    # Command handler: read doc, pick format, save
    exportHtml.ts        # Standalone HTML document builder
    pdfGenerator.ts      # Puppeteer launch, navigate, pdf options
    resolveAssets.ts     # Relative image paths → file URLs for export
  preview/
    webviewHtml.ts       # Refactor: shared styles/CSS URI helper (optional)
```

Refactor scope is intentionally small: extract CSS loading path from `webviewHtml.ts` only if duplication becomes painful.

## HTML Shell (export variant)

Differences from preview webview HTML:

| Concern | Preview webview | Export HTML |
| --- | --- | --- |
| CSP | Strict webview CSP | Relaxed file:// or inline-only document |
| Colors | `var(--vscode-editor-*)` | Fixed light theme (`#ffffff` / `#24292f`) |
| CSS load | `asWebviewUri` | Read `github-markdown-css` from disk and inline `<style>` |
| Scripts | None | None |
| Images | webview URIs | `file://` absolute paths after resolution |

## PDF Generator

```typescript
// Conceptual flow — not implementation
async function exportPdf(html: string, outputPath: string): Promise<void> {
  const browser = await puppeteer.launch({ executablePath: resolvedChromePath });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "networkidle0" });
  await page.pdf({ path: outputPath, format: "A4", printBackground: true });
  await browser.close();
}
```

### Chrome resolution order

1. User setting `easiiMdPreview.pdf.executablePath`
2. Detect installed Chrome / Edge / Chromium (platform-specific paths)
3. Fail with actionable message (no silent auto-download in v1)

### PDF options (v1 defaults)

- Format: A4
- `printBackground: true` (preserve code block backgrounds)
- Margins: reasonable defaults (e.g. 12mm)

## VS Code Integration

### New commands

| Command ID | Title |
| --- | --- |
| `easiiMdPreview.exportHtml` | Easii Markdown Preview: Export to HTML |
| `easiiMdPreview.exportPdf` | Easii Markdown Preview: Export to PDF |

### package.json changes

- `activationEvents`: add `onCommand` for export commands
- `contributes.commands`: two entries
- Optional `contributes.configuration` for `executablePath`

### Save UX

- Default filename: `{basename}.html` or `{basename}.pdf` beside source file
- Use `showSaveDialog` with sensible `defaultUri`

## Security

- Export HTML is generated server-side in extension host — same sanitize boundary as preview.
- Puppeteer loads only local/generated content; no arbitrary remote URLs unless markdown links include them (existing linkify behavior).
- Do not enable webview scripts for export.

## Validation Strategy

No test runner (`strict_tdd: false`). Extend `docs/manual-validation.md`:

1. Export HTML from sample doc → open in browser → print preview looks correct.
2. Export PDF with local Chrome → file opens, tables/task lists readable.
3. Document with relative image → image appears or documented skip.
4. Remote SSH without Chrome → clear error, no hang.

## Tradeoffs

| Tradeoff | Choice | Why |
| --- | --- | --- |
| HTML-first vs PDF-only | HTML-first slice | De-risks pipeline reuse without Chromium |
| puppeteer vs playwright | puppeteer-core | Ecosystem precedent in VS Code markdown PDF extensions |
| Bundled Chromium vs system Chrome | System Chrome v1 | Smaller VSIX, less maintenance; document requirement |
| Shared webview HTML vs duplicate shell | Duplicate export shell initially | Avoids CSP/theme coupling; refactor later if needed |
| WYSIWYG webview capture vs offline render | Offline render | Reliable, testable, matches security model |

## Future Extension Points

- Bundled Chromium resolver (optional setting)
- User PDF margins, header/footer, page size
- Export from preview panel context menu
- Shiki-highlighted code in export HTML when Shiki lands
