# Markdown Preview MVP

## Problem Statement

`easii-md-preview` needs a clear MVP for a VS Code/Cursor extension that previews Markdown files with GitHub-like rendering. The current project has TypeScript configuration and VS Code typings, but no source implementation, no reliable test runner, and only broad planning notes.

Without a scoped OpenSpec change, implementation risks drifting into advanced features such as syntax highlighting, Mermaid, KaTeX, scroll sync, settings, or publishing before the core preview path is proven.

## Goals

- Provide a VS Code command that opens a Markdown preview for the active `.md` document.
- Render Markdown to HTML using Node.js/TypeScript tooling and `markdown-it`.
- Support MVP GitHub-flavored Markdown behavior for tables and task lists.
- Present output in a VS Code webview styled with `github-markdown-css`.
- Refresh preview content on document edits using debounced updates.
- Keep webview rendering safe by default: controlled HTML shell, CSP, sanitized output, and local resource URI handling.
- Establish minimal validation commands and manual verification steps because no test runner is currently detected.

## Non-Goals

- Replacing VS Code's built-in Markdown preview feature completely.
- Bun runtime/package-manager migration.
- Full Markdown platform parity with GitHub.
- Shiki syntax highlighting.
- Mermaid diagrams.
- KaTeX/LaTeX formulas.
- Scroll sync between editor and preview.
- Extension settings UI.
- Marketplace publishing.
- PDF/HTML export or inline preview editing.

## Decisions

| Area | Decision | Rationale |
| --- | --- | --- |
| Runtime/tooling | Keep Node.js/npm + TypeScript | VS Code extension development is Node-oriented; compatibility and extension tooling matter more than Bun speed for this MVP. |
| MVP rendering | Use `markdown-it` plus small plugins/options | Keeps the renderer explicit and testable while supporting tables/task lists. |
| Preview surface | Use VS Code webview panel | This is the standard extension API path for custom HTML previews. |
| Styling | Use `github-markdown-css` | Gives a familiar README-like baseline without custom CSS design work. |
| Update strategy | Debounce document change events | Prevents rerendering on every keystroke for larger documents. |
| Advanced features | Defer | Keeps the first implementation reviewable and lowers integration risk. |

## MVP Scope

1. Extension activation and command registration.
2. Markdown document detection and active-editor preview command.
3. Webview creation/reuse for the active preview.
4. Markdown rendering pipeline with GFM table/task-list support.
5. GitHub Markdown CSS injection with basic light/dark handling.
6. Debounced refresh on source document changes.
7. Safe webview HTML shell and sanitization boundary.
8. Minimal validation script(s) and manual acceptance checklist.

## Future Scope

- Shiki syntax highlighting and lazy loading.
- Mermaid diagrams.
- KaTeX formulas.
- Scroll sync.
- Extension settings.
- Advanced relative links/assets behavior.
- Bundling and marketplace publishing.
- Export features.

## Review Workload Forecast

The MVP likely touches `package.json`, `tsconfig.json`, `src/`, and maybe docs/OpenSpec artifacts. A complete implementation may exceed 400 changed lines if bundled into one PR.

Recommended delivery:

1. Planning artifacts only: this OpenSpec change.
2. MVP implementation in reviewable work units:
   - extension skeleton and command;
   - renderer and sanitization;
   - webview/CSS/resource handling;
   - debounced update flow and validation.

If implementation forecast exceeds 400 changed lines, split into chained PRs or separate commits/work units before review.
