# Markdown Preview MVP Design

## Summary

Build a minimal VS Code/Cursor Markdown preview extension using Node.js/npm, TypeScript, `markdown-it`, and a secure webview panel. Keep the architecture modular so advanced rendering features can be added later without rewriting the preview lifecycle.

## Current Context

- `package.json` currently includes `@types/vscode` and `typescript` only.
- `tsconfig.json` uses `rootDir: ./src`, `outDir: ./out`, strict TypeScript, CommonJS, and ES2020.
- `openspec/config.yaml` has `strict_tdd: false` and no detected test runner.
- Existing docs include a broad plan, but this OpenSpec change narrows the MVP.
- The working directory is not currently a git repository, so branch/diff review tooling is unavailable.

## Proposed Source Structure

```text
src/
  extension.ts              # VS Code activation/deactivation and command registration
  preview/
    previewPanel.ts         # Webview panel lifecycle, reveal/update/dispose
    webviewHtml.ts          # Safe HTML shell, CSP, CSS/resource URI injection
  markdown/
    renderer.ts             # markdown-it setup and render API
    sanitize.ts             # Sanitization boundary for rendered HTML
  utils/
    debounce.ts             # Small debounce helper
```

Optional MVP support files:

```text
docs/
  manual-validation.md      # Manual acceptance checklist if no automated tests exist
```

## Component Design

| Component | Responsibility | Notes |
| --- | --- | --- |
| `extension.ts` | Register command and route active editor content into preview panel | Keep VS Code API calls here; avoid mixing renderer logic. |
| `previewPanel.ts` | Own one preview panel lifecycle, document association, update scheduling, disposal | Prevent updates after dispose. |
| `webviewHtml.ts` | Produce complete webview HTML shell | Include CSP, nonce if scripts become necessary, and webview-safe CSS URI. MVP should avoid arbitrary scripts. |
| `renderer.ts` | Configure `markdown-it` and expose `renderMarkdown(markdown: string): string` | Enable table support and task-list support through plugins/options. |
| `sanitize.ts` | Sanitize or constrain rendered HTML before webview insertion | Required even if Markdown HTML is disabled; document exact boundary. |
| `debounce.ts` | Debounce update calls | Small isolated helper to make behavior easy to validate. |

## Data Flow

1. User opens a Markdown file.
2. User runs `easiiMdPreview.openPreview` or equivalent command.
3. `extension.ts` validates the active editor/document.
4. `PreviewPanel` creates or reveals a webview for the document.
5. Source Markdown is sent to `renderer.ts`.
6. Rendered HTML passes through the sanitization boundary.
7. `webviewHtml.ts` wraps safe content in the GitHub-style HTML shell.
8. Document changes trigger a debounced refresh while the panel remains alive.
9. Disposal removes listeners/timers for that preview.

## Security Design

- Prefer no custom webview scripts in the MVP.
- Use a restrictive Content Security Policy.
- Convert extension CSS assets through `webview.asWebviewUri`.
- Treat raw rendered HTML as untrusted until it crosses `sanitize.ts`.
- Do not allow arbitrary remote script execution.
- Keep relative images/links conservative in the MVP; document unsupported cases rather than broadening `localResourceRoots` prematurely.

## Styling Design

- Package and load `github-markdown-css` from extension resources or dependency output.
- Wrap rendered content with `<article class="markdown-body">`.
- Add a small local CSS shim only for VS Code background/foreground integration and spacing.
- Validate readability in light and dark themes.

## Performance Design

- Use a debounce interval around 150-300ms for document change refresh.
- Re-render only the associated document for the open preview.
- Avoid expensive advanced renderers in MVP.
- Defer Shiki and diagram engines because they add startup and bundle complexity.

## Validation Strategy

Because no test runner is detected:

1. Add or document a TypeScript validation command, likely `npm run compile` using `tsc -p ./`.
2. Manually validate with a sample Markdown file containing:
   - heading;
   - paragraph;
   - table;
   - checked/unchecked task list;
   - fenced code block;
   - local/relative link or image if implemented.
3. Record known limitations in docs or task output.

Automated tests can be added after the MVP skeleton is stable.

## Tradeoffs

| Tradeoff | Choice | Why |
| --- | --- | --- |
| Node vs Bun | Node/npm | Lower VS Code tooling risk. |
| Full GFM parity vs MVP support | MVP tables/task lists | Keeps first implementation small and reviewable. |
| Built-in preview reuse vs custom webview | Custom webview | Required for controlled styling and future custom features. |
| Automated test setup now vs minimal validation | Minimal validation first | No runner exists; adding a full test stack may exceed MVP scope. |
| Advanced features now vs deferred | Deferred | Protects review workload and avoids architecture drift. |

## Future Extension Points

- `markdown/plugins/` for Shiki, Mermaid, KaTeX, anchors, and link transforms.
- `preview/scrollSync.ts` after stable panel/document mapping exists.
- `configuration.ts` for user settings.
- bundler config once dependencies and assets require packaging optimization.
