# Markdown Preview Specification

## ADDED Requirements

### Requirement: Open Markdown Preview Command

The extension SHALL expose a VS Code command that opens a preview for the active Markdown document.

#### Scenario: Active editor is Markdown

- **GIVEN** the active editor contains a `.md` or Markdown-language document
- **WHEN** the user runs the preview command
- **THEN** the extension opens or reveals a preview webview for that document
- **AND** the preview renders the document content as HTML

#### Scenario: Active editor is not Markdown

- **GIVEN** the active editor is missing or not a Markdown document
- **WHEN** the user runs the preview command
- **THEN** the extension shows a clear non-destructive message
- **AND** it does not create a broken preview panel

### Requirement: Markdown Rendering

The extension SHALL render Markdown through a dedicated renderer module using `markdown-it`.

#### Scenario: Basic Markdown

- **GIVEN** Markdown containing headings, paragraphs, lists, links, code spans, and fenced code blocks
- **WHEN** the renderer processes the content
- **THEN** the output contains valid HTML for those structures

#### Scenario: GFM tables

- **GIVEN** Markdown containing pipe table syntax
- **WHEN** the renderer processes the content
- **THEN** the output contains an HTML table representation

#### Scenario: Task lists

- **GIVEN** Markdown containing `- [ ]` and `- [x]` task list items
- **WHEN** the renderer processes the content
- **THEN** the preview displays unchecked and checked task markers without enabling arbitrary document mutation

### Requirement: GitHub-like Styling

The preview SHALL apply `github-markdown-css` or an equivalent packaged CSS asset to the rendered content.

#### Scenario: Styled preview shell

- **GIVEN** a rendered Markdown document
- **WHEN** the preview webview displays it
- **THEN** the content is wrapped in a GitHub-style `markdown-body` container
- **AND** base typography, tables, lists, code blocks, and spacing use the GitHub-like stylesheet

#### Scenario: Theme compatibility baseline

- **GIVEN** VS Code is using a light or dark theme
- **WHEN** the preview opens
- **THEN** the preview remains readable
- **AND** the MVP documents any known theme limitations

### Requirement: Safe Webview Rendering

The extension SHALL render previews inside a controlled webview HTML shell with explicit security boundaries.

#### Scenario: Sanitized output

- **GIVEN** Markdown content containing potentially unsafe HTML or script-like input
- **WHEN** the renderer produces preview content
- **THEN** unsafe script execution is prevented by sanitization and webview policy

#### Scenario: Controlled resource loading

- **GIVEN** preview HTML needs local CSS or document-relative assets
- **WHEN** the webview HTML is generated
- **THEN** extension resources use VS Code webview-safe URIs
- **AND** unsupported or unsafe asset behavior is documented rather than silently widening permissions

### Requirement: Debounced Refresh

The preview SHALL update after Markdown document edits using a debounced refresh flow.

#### Scenario: Rapid edits

- **GIVEN** a preview is open for a Markdown document
- **WHEN** the user types rapidly
- **THEN** the extension avoids rendering on every keystroke
- **AND** it refreshes once the debounce interval settles

#### Scenario: Preview disposal

- **GIVEN** the preview panel was closed
- **WHEN** the source document changes
- **THEN** the extension does not attempt to update a disposed webview

### Requirement: MVP Validation

The project SHALL include a minimal validation path for the MVP despite no detected test runner.

#### Scenario: TypeScript validation

- **GIVEN** the MVP source exists
- **WHEN** the maintainer runs the documented validation command
- **THEN** TypeScript compilation succeeds or reports actionable errors

#### Scenario: Manual extension validation

- **GIVEN** the extension is launched in VS Code/Cursor development mode
- **WHEN** the maintainer runs the preview command on a sample Markdown file
- **THEN** headings, tables, task lists, styling, and debounced refresh can be manually verified
