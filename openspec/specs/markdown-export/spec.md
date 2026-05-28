# Markdown Export Specification

## Requirements

### Requirement: Export Active Markdown Document

The extension SHALL provide commands to export the active Markdown document using the same renderer as the preview.

#### Scenario: Export HTML from active editor

- **GIVEN** the active editor contains a Markdown document
- **WHEN** the user runs the export HTML command
- **THEN** the extension generates a standalone HTML file with GitHub-like styling
- **AND** the file reflects the current document content including GFM tables and task lists

#### Scenario: Export PDF from active editor

- **GIVEN** the active editor contains a Markdown document
- **AND** a supported Chromium-based browser is available on the extension host
- **WHEN** the user runs the export PDF command
- **THEN** the extension generates a PDF file with readable layout matching the export HTML pipeline
- **AND** the user receives confirmation or a clear error if generation fails

#### Scenario: No active Markdown editor

- **GIVEN** there is no active Markdown editor
- **WHEN** the user runs an export command
- **THEN** the extension shows a clear non-destructive message
- **AND** it does not write partial output files

### Requirement: Renderer Parity with Preview

Export output SHALL use `renderMarkdown` and the existing sanitization boundary.

#### Scenario: Unsafe content in export

- **GIVEN** Markdown containing script-like or unsafe HTML input
- **WHEN** export runs
- **THEN** output is sanitized before being embedded in HTML or PDF
- **AND** export does not weaken the MVP sanitization rules

### Requirement: Print-Safe Export HTML

Export HTML SHALL not depend on VS Code webview CSS variables.

#### Scenario: Standalone HTML readability

- **GIVEN** exported HTML opened in a system browser
- **WHEN** the user views or prints the document
- **THEN** typography and tables remain readable on a light background
- **AND** `github-markdown-css` styles are applied without requiring the VS Code webview

### Requirement: Chromium Availability Handling

PDF export SHALL detect missing or unusable browser binaries and fail clearly.

#### Scenario: No browser on extension host

- **GIVEN** PDF export is requested
- **AND** no Chromium-based browser can be resolved
- **WHEN** export runs
- **THEN** the extension shows an actionable error describing how to install Chrome or set `executablePath`
- **AND** it does not leave orphaned temp files without user-visible failure

### Requirement: Export Validation

The project SHALL extend manual validation for export because no automated test runner exists.

#### Scenario: Manual HTML export check

- **GIVEN** the sample Markdown from `docs/manual-validation.md`
- **WHEN** the maintainer exports HTML and opens it in a browser
- **THEN** headings, tables, task lists, and code blocks render correctly

#### Scenario: Manual PDF export check

- **GIVEN** Chrome or Chromium is installed locally
- **WHEN** the maintainer exports PDF from the sample Markdown
- **THEN** the resulting PDF is readable and includes styled tables and lists
