# Verify Report: markdown-pdf-export

## Status

**PASS**

## Executive Summary

Export HTML and PDF were implemented, secured, and validated manually by the maintainer on macOS. Preview document resolution fix was included in the same delivery and validated when reopening preview from the command palette.

## Verification Evidence

| Check | Result |
| --- | --- |
| `npm run compile` | Pass |
| Export HTML — tables, task lists, code blocks | Pass (user) |
| Export PDF — readable layout | Pass (user) |
| PDF long code blocks wrap within page width | Pass (user) |
| Preview opens with Markdown tab / resolver | Pass (user) |
| Security model documented | Pass — `docs/export-security.md` |

## Known Limits (accepted)

- Remote images stripped from export by design.
- PDF requires local Chrome/Edge/Chromium on the extension host.
- No automated tests (project has no test runner).
- Shiki/Mermaid not in export pipeline (deferred).

## Blockers

None.
