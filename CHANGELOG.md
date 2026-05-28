# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-05-28

### Added

- GitHub-style Markdown preview with live debounced refresh
- Shiki syntax highlighting in preview and export
- Export to HTML and PDF with security hardening
- GFM tables and task lists
- Unit tests (Vitest) for renderer, sanitize, and export helpers
- esbuild bundle for marketplace packaging

### Security

- HTML sanitization, export CSP, path-safe local images, Puppeteer network blocking — see `docs/export-security.md`

[1.0.0]: https://github.com/rodrigoperaltadev/easii-md-preview/releases/tag/v1.0.0
