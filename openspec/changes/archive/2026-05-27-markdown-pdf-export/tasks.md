# Markdown PDF Export Tasks

## Workload Forecast

Expected size: **medium** (~270–460 lines if HTML + PDF ship together). Session preflight review budget is 400 lines — **use chained delivery**: HTML slice first, PDF slice second.

Strict TDD is not active. Each task requires manual validation evidence.

## Phase 1 — HTML Export (recommended first)

- [x] 1.1 Add `src/export/exportHtml.ts` — standalone HTML builder with inlined `github-markdown-css` and print-safe colors.
- [x] 1.2 Add `src/export/exportDocument.ts` — orchestration, save dialog, default paths.
- [x] 1.3 Register `easiiMdPreview.exportHtml` in `extension.ts` and `package.json`.
- [x] 1.4 Extend `docs/manual-validation.md` with HTML export checklist.
- [x] 1.5 Manual validation: export sample doc, open in browser, verify tables/task lists/code blocks.

**Validation evidence:** User confirmed HTML export readable; `npm run compile` passes.

## Phase 2 — PDF Export

- [x] 2.1 Add `puppeteer-core` dependency and `src/export/pdfGenerator.ts`.
- [x] 2.2 Add Chrome/Edge detection and optional `easiiMdPreview.pdf.executablePath` setting.
- [x] 2.3 Register `easiiMdPreview.exportPdf` command.
- [x] 2.4 Add `src/export/resolveAssets.ts` for relative images with path containment checks.
- [x] 2.5 Extend manual validation for PDF export and missing-browser error path.
- [x] 2.6 Manual validation: PDF readable on macOS; document remote/WSL limitation if untested.

**Validation evidence:** User confirmed PDF export on macOS; long code blocks wrap within page width after viewport fix.

## Security (apply)

- [x] S.1 `docs/export-security.md` threat model documented.
- [x] S.2 Export CSP, remote image stripping, local image data-URI embedding.
- [x] S.3 Puppeteer: JS disabled, request interception blocks network/file loads.
- [x] S.4 `executablePath` validation; CSS read constrained to extension directory.
- [x] S.5 Sanitizer hardening: `allowedSchemesByTag` for `img`, `disallowedTagsMode: discard`.

## Deferred

- Bundled Chromium auto-download
- Custom page size, margins, headers/footers
- Export from preview panel toolbar
- Automated export tests
- Shiki/Mermaid in export output

## SDD Phase Status

| Phase | Status |
| --- | --- |
| explore | complete (feasibility evaluated) |
| proposal | complete |
| spec | complete |
| design | complete |
| tasks | complete |
| apply | complete |
| verify | complete (2026-05-27 — user validated preview, HTML export, PDF export) |
| archive | complete (2026-05-27 — synced to `openspec/specs/markdown-export/`, moved to `changes/archive/2026-05-27-markdown-pdf-export/`) |
