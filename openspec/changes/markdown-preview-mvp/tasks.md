# Markdown Preview MVP Tasks

## Workload Forecast

Expected implementation size: medium. The full MVP may exceed 400 changed lines if implemented as one diff. Use one writer thread and keep work units reviewable. If this becomes a git repository before implementation, prefer separate commits or chained PRs by work unit.

Strict TDD is not active because `openspec/config.yaml` reports no reliable test runner. Each task still requires validation evidence.

## Tasks

### 1. Project and Extension Manifest Setup

- [x] 1.1 Update `package.json` with VS Code extension manifest fields: `activationEvents`, `contributes.commands`, `engines.vscode`, `main`, and compile scripts.
- [x] 1.2 Add runtime dependencies for Markdown rendering and safe output, expected: `markdown-it`, task-list plugin if needed, `github-markdown-css`, and sanitizer dependency if selected.
- [x] 1.3 Add minimal validation scripts, at least `compile`/`typecheck` via `tsc -p ./`.
- [x] 1.4 Confirm `tsconfig.json` matches `src/extension.ts` entrypoint and `out/extension.js` output.

Validation evidence:
- `npm install` succeeds.
- `npm run compile` or equivalent TypeScript command succeeds.

### 2. Markdown Rendering Core

- [x] 2.1 Create `src/markdown/renderer.ts` with a narrow `renderMarkdown(markdown: string): string` API.
- [x] 2.2 Configure `markdown-it` for baseline Markdown rendering.
- [x] 2.3 Enable/validate table rendering.
- [x] 2.4 Enable/validate task-list rendering without document mutation.
- [x] 2.5 Create `src/markdown/sanitize.ts` or equivalent sanitization boundary and document the selected sanitizer behavior.

Validation evidence:
- Renderer handles headings, paragraphs, lists, fenced code, tables, and task lists.
- Unsafe script-like Markdown does not execute in the preview path.

### 3. Webview Preview Shell

- [x] 3.1 Create `src/preview/webviewHtml.ts` to generate the complete HTML document.
- [x] 3.2 Wrap content in a `markdown-body` container.
- [x] 3.3 Load `github-markdown-css` through webview-safe URIs.
- [x] 3.4 Add minimal local CSS for VS Code background/foreground and spacing.
- [x] 3.5 Add restrictive CSP and avoid arbitrary scripts in MVP.

Validation evidence:
- Preview is readable in light and dark themes.
- Tables/task lists receive GitHub-like styling.
- Webview developer console shows no avoidable CSP/resource errors for MVP assets.

### 4. VS Code Command and Panel Lifecycle

- [x] 4.1 Create `src/extension.ts` activation/deactivation entrypoint.
- [x] 4.2 Register the preview command.
- [x] 4.3 Validate active editor/document before opening preview.
- [x] 4.4 Create `src/preview/previewPanel.ts` to own panel creation, reveal, update, and disposal.
- [x] 4.5 Show a clear message when no Markdown document is active.

Validation evidence:
- Command opens a preview for a Markdown file.
- Command does not create a broken preview for non-Markdown files.
- Re-running command reveals or updates the existing preview intentionally.

### 5. Debounced Refresh Flow

- [x] 5.1 Create `src/utils/debounce.ts` or equivalent helper.
- [x] 5.2 Subscribe to document change events for the previewed document.
- [x] 5.3 Refresh the panel after a debounce interval, not on every keystroke.
- [x] 5.4 Dispose listeners/timers when the preview closes.

Validation evidence:
- Editing a previewed Markdown document updates the preview after a short delay.
- Rapid typing does not visibly thrash the preview.
- Closing the preview stops further updates/errors.

### 6. Manual Validation Documentation

- [x] 6.1 Add a sample manual validation checklist or doc.
- [x] 6.2 Include Markdown sample cases: heading, table, task list, fenced code, link, and unsafe HTML sample.
- [x] 6.3 Record known MVP limitations and deferred features.

Validation evidence:
- A maintainer can follow the checklist to verify MVP behavior in VS Code/Cursor dev mode.

## Deferred Tasks

- [ ] Add automated unit tests for renderer.
- [ ] Add integration tests for webview behavior.
- [ ] Add Shiki syntax highlighting.
- [ ] Add Mermaid diagrams.
- [ ] Add KaTeX formulas.
- [ ] Add scroll sync.
- [ ] Add settings UI.
- [ ] Add bundling optimization.
- [ ] Prepare marketplace publishing.

## Apply Recommendation

Do not implement all tasks in one uncontrolled pass. Recommended first apply slice:

1. Project manifest/scripts and dependencies.
2. Minimal renderer.
3. Basic command/webview preview.

Then validate and review before adding debounced refresh and polish.
