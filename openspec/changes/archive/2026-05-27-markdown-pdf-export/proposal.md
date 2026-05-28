# Markdown PDF Export — Feasibility Proposal

## Problem Statement

Users validated the Markdown Preview MVP and now want to export the same GitHub-like preview to PDF. The MVP explicitly deferred export features. Adding PDF export requires a deliberate pipeline choice because VS Code webviews do not expose a supported `printToPDF` API, and the current preview uses webview-only CSS variables and `asWebviewUri` resource loading.

## Evaluation Summary

| Verdict | Detail |
| --- | --- |
| **Feasible** | Yes, with a headless-browser or phased HTML-first approach |
| **Recommended path** | Reuse existing renderer + HTML shell; add Puppeteer-based PDF in a follow-up slice |
| **Not recommended** | Capturing the live webview directly or using pdfkit without HTML layout |
| **Complexity** | Medium — separate from MVP, likely 250–450 lines across export module, command, docs, and validation |

## Goals

- Export the **active Markdown document** using the **same rendering pipeline** as the preview (`markdown-it` → sanitize → GitHub CSS shell).
- Provide a VS Code command such as `Easii Markdown Preview: Export to PDF`.
- Save PDF next to the source file or via a save dialog (decision in design).
- Document Chromium/Chrome requirements and remote/WSL limitations.

## Non-Goals (this change)

- Pixel-perfect parity with GitHub.com (already out of MVP scope).
- Shiki, Mermaid, or KaTeX in PDF (deferred with those features).
- Marketplace publishing changes.
- Replacing dedicated extensions like `yzane.markdown-pdf` for power users who need dozens of export settings.

## Approach Options Evaluated

### Option A — Puppeteer / Chromium (recommended for real PDF)

**How:** Build standalone HTML (inline or temp file) from `renderMarkdown` + CSS, launch `puppeteer-core`, navigate, call `page.pdf()`.

**Pros:**
- Industry pattern (e.g. Markdown PDF extensions).
- High fidelity for tables, task lists, typography, and print CSS.
- Runs in extension host (Node), same process as current renderer.

**Cons:**
- Requires Chrome/Chromium on the machine where the extension host runs (painful on remote SSH/WSL without deps).
- Larger dependency footprint; may need `executablePath` setting.
- Relative images need explicit path resolution for `file://` or absolute URLs.

**Fit:** Strong — aligns with existing `webviewHtml` structure once adapted for non-webview context.

### Option B — HTML export only (recommended first slice)

**How:** Command writes a self-contained `.html` file; user prints to PDF from browser.

**Pros:**
- Small diff, no Chromium, works everywhere.
- Validates reuse of renderer/shell before PDF complexity.
- Useful artifact on its own.

**Cons:**
- Not one-click PDF; extra user step.

**Fit:** Excellent phased MVP for export.

### Option C — Capture live webview

**How:** Enable scripts, `window.print()`, or screenshot APIs inside the panel.

**Pros:**
- Theoretically WYSIWYG with on-screen preview.

**Cons:**
- VS Code webview has no official PDF API.
- Conflicts with current `enableScripts: false` security posture.
- Unreliable across themes, CSP, and headless/remote hosts.

**Fit:** Poor — reject.

### Option D — Pandoc / LaTeX / external CLI

**How:** Shell out to `pandoc` or similar.

**Pros:**
- Mature PDF toolchain.

**Cons:**
- Different layout engine — **will not match** Easii preview styling.
- External install burden; poor UX for Cursor/VS Code users expecting zero config.

**Fit:** Weak for this product — reject as primary path.

### Option E — pdfkit / pdfmake (programmatic PDF)

**How:** Map AST to PDF primitives.

**Pros:**
- No browser dependency.

**Cons:**
- Reimplement GitHub CSS layout; high effort, low fidelity for GFM tables/code.

**Fit:** Poor — reject.

## Recommendation

Adopt a **two-slice delivery** under OpenSpec change `markdown-pdf-export`:

1. **Slice 1 — HTML export:** Reuse renderer + export-oriented HTML builder (no VS Code CSS variables; inline `github-markdown-css`). Command + save path + manual validation.
2. **Slice 2 — PDF export:** Add `puppeteer-core`, Chrome detection / `executablePath` setting, temp HTML → PDF, error messages for missing browser.

Defer bundled Chromium auto-download (like modern `markdown-pdf` 2.x) unless you accept marketplace size and maintenance cost.

## Dependencies on MVP

| MVP asset | Reuse for export |
| --- | --- |
| `renderMarkdown` | Yes — same HTML body |
| `sanitize.ts` | Yes — same security boundary |
| `getWebviewHtml` | Partial — extract shared shell; replace `var(--vscode-*)` with print-safe colors |
| `PreviewPanel` | No — export runs from command, not webview state |
| `github-markdown-css` | Yes — inline or copy into temp HTML |

## Risks

| Risk | Mitigation |
| --- | --- |
| Remote SSH / WSL missing Chromium libs | Document deps; support `executablePath`; clear error UI |
| Relative images broken in PDF | Resolve paths relative to workspace/document URI in export HTML |
| Theme vars unavailable outside webview | Use light print theme defaults in export HTML |
| Review workload > 400 lines | Chained delivery: HTML slice PR, then PDF slice PR |
| Divergence from preview when Shiki added later | Document limitation; extend export when Shiki lands |

## Review Workload Forecast

- HTML-only slice: ~120–180 lines — single PR.
- PDF slice: ~150–280 lines + dependency — second PR.
- Combined if rushed: may exceed 400 lines — prefer chained PRs per session preflight (`auto-forecast`, budget 400).

## Decision

**Proceed with OpenSpec spec + design for `markdown-pdf-export`.** Do not implement until user approves the phased plan (HTML first vs PDF-only).
