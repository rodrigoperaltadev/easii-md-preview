# Post-MVP Unit Tests

## Problem Statement

The extension has no automated test runner. Validation is manual only, which blocks safe iteration on post-MVP features (Shiki, export edge cases, security regressions).

## Goals

- Add a fast unit test runner for Node-testable modules.
- Cover renderer, sanitization, export security helpers, and export HTML shell behavior.
- Wire `npm test` to run unit tests after compile.

## Non-Goals

- VS Code webview integration tests (deferred).
- PDF/Puppeteer E2E tests (deferred).
- Shiki or Mermaid in this change.

## Decision

Use **Vitest** for TypeScript-native unit tests with a minimal `vscode` mock for URI helpers used in export HTML tests.
