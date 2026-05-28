# Export Security Model

Easii Markdown Preview exports reuse the same Markdown renderer and sanitization boundary as the live preview, then apply additional export-only hardening.

## Threat model

| Threat | Mitigation |
| --- | --- |
| Script injection in Markdown | `markdown-it` with `html: false` + `sanitize-html` (scripts/tags stripped) |
| Unsafe URLs in links/images | Scheme allowlists; export strips remote images |
| Path traversal via relative images | Images resolved only under document dir or workspace roots |
| Reading arbitrary files for CSS | `github-markdown.css` read only from extension install path |
| Malicious browser binary path | `executablePath` validated as existing file; shell interpreters rejected |
| Network exfiltration during PDF render | Puppeteer request interception blocks `http`, `https`, `file`, `ftp` |
| JavaScript in PDF render | `setJavaScriptEnabled(false)` + CSP `script-src 'none'` in export HTML |
| Oversized embedded images | 5 MB cap per image; unsupported extensions skipped |

## Export HTML

- Strict Content-Security-Policy: no scripts, no network, `img-src data:` only after embedding.
- Local images embedded as `data:` URIs so the document is self-contained.
- Remote images (`http`, `https`, `data`, etc.) are removed and replaced with a neutral placeholder.

## PDF export

- Uses `puppeteer-core` with a user- or auto-detected system browser (no bundled Chromium download).
- Renders sanitized inline HTML via `page.setContent`, not navigable `file://` or remote URLs.
- All network requests during render are aborted except `about:blank` and `data:` resources.

## User-visible security notices

When remote or unsafe images are removed, the export success message includes a short security summary.

## Known limits

- Clickable `https` links remain in exported HTML/PDF (standard for Markdown exporters).
- Syntax highlighting and diagrams are not rendered in export until those features exist in the preview pipeline.
- PDF export requires a local Chromium-based browser on the machine running the extension host (remote SSH/WSL may need extra setup).
