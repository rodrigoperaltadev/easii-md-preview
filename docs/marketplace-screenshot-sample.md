# Easii Markdown Preview — Demo

> Use this file for Marketplace screenshots. Open it in the editor, run **Easii Markdown Preview: Open Preview**, and capture three shots (see bottom).

GitHub-style preview for VS Code and Cursor: tables, tasks, Shiki highlighting, and export to HTML/PDF.

---
 
## Features at a glance

| Feature | Status |
| --- | --- |
| Live preview | Ready |
| GFM tables | Ready |
| Task lists | Ready |
| Shiki syntax highlighting | Ready |
| Export HTML / PDF | Ready |

---

## Task list (GFM)

- [x] Install **Easii Markdown Preview**
- [x] Open this demo file
- [ ] Export to PDF for sharing
- [ ] Star the repo on GitHub

---

## Code samples

TypeScript with types and keywords (good for **screenshot #2 — syntax colors**):

```typescript
interface PreviewConfig {
  theme: "github-light" | "github-dark";
  debounceMs: number;
}

export function openPreview(document: string, config: PreviewConfig): void {
  const rendered = renderMarkdown(document, { theme: config.theme });
  panel.show(rendered);
}
```

Shell one-liner:

```bash
npm run bundle && code --extensionDevelopmentPath=.
```

JSON config snippet:

```json
{
  "easiiMdPreview.pdf.executablePath": "",
  "editor.fontSize": 14
}
```

---

## Quote and inline code

> Preview follows your VS Code theme. Export uses a light print theme for PDF.

Use `easiiMdPreview.openPreview` from the Command Palette (`Cmd+Shift+P`).

---

## Long line (PDF export test)

```typescript
const veryLongLineForPdfWrap =
  "This line is intentionally long so you can verify that exported PDF wraps fenced code inside the page width instead of clipping on the right edge.";
```

---

## Links

- [Repository](https://github.com/rodrigoperaltadev/easii-md-preview)
- [VS Code Marketplace](https://marketplace.visualstudio.com/)

---

## Screenshot guide (delete before publish if you want)

| # | What to capture | How |
| --- | --- | --- |
| **1** | **Preview panel** | Editor + preview side by side; show headings, table, and task list |
| **2** | **Syntax highlighting** | Zoom the TypeScript fenced block with Shiki colors |
| **3** | **Export** | PDF or HTML result open (Preview app / browser), or success toast after export |

Recommended size: **1260×750** or similar 16:9 for Marketplace.
