# Manual Validation: Markdown Preview MVP

Use this checklist until automated extension tests exist.

## Setup

1. Run `npm install`.
2. Run `npm run compile`.
3. Launch the extension in VS Code/Cursor extension development mode.

## Sample Markdown

```markdown
# Preview Smoke Test

This is a paragraph with a [link](https://example.com).

| Feature | Status |
| --- | --- |
| Tables | Working |
| Task lists | Working |

- [ ] Unchecked task
- [x] Checked task

```ts
console.log('hello preview');
```

<script>alert('unsafe')</script>
```

## Checks

- [ ] Running `Easii Markdown Preview: Open Preview` on a Markdown file opens a preview panel.
- [ ] Headings, paragraphs, links, tables, task lists, and fenced code render as HTML.
- [ ] The preview has GitHub-like Markdown styling.
- [ ] Unsafe script-like input does not execute.
- [ ] Running the command on a non-Markdown file shows a clear message instead of a broken panel.
- [ ] Editing the previewed Markdown file updates the preview after a short delay.
- [ ] Rapid typing does not visibly thrash the preview on every keystroke.
- [ ] Closing the preview stops further updates when the source file keeps changing.

## Known MVP Limits
- Scroll sync is deferred.
- Syntax highlighting, Mermaid, and KaTeX are deferred.
- Advanced relative asset/link handling is deferred.
