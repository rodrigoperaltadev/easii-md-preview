# Marketplace publish checklist — Easii Markdown Preview

Estado actual: extensión funcional en dev host (preview, export HTML/PDF, Shiki, tests unitarios). **Aún no lista para publicar** sin empaquetado, assets de tienda y documentación pública.

---

## A. Identidad y cuenta

- [ ] Crear cuenta de [Visual Studio Marketplace Publisher](https://marketplace.visualstudio.com/manage)
- [ ] Definir **Publisher ID** (único, no se cambia fácil)
- [ ] Vincular Azure DevOps / PAT para `vsce publish`
- [ ] Decidir licencia final (hoy `ISC` en `package.json`; muchas extensiones usan MIT)
- [ ] Repo público en GitHub (o URL de código fuente en manifest)

---

## B. Manifest (`package.json`)

- [ ] `publisher`
- [ ] `repository`, `homepage`, `bugs`
- [ ] `icon` → `images/icon.png` (128×128 PNG)
- [ ] `galleryBanner` (opcional, 220×140)
- [ ] `categories`: p. ej. `Other` → `Formatters` / `Visualization` según enfoque
- [ ] `keywords` ampliados (markdown, preview, github, pdf, export)
- [ ] `engines.vscode` mínimo validado en Cursor + VS Code
- [ ] `activationEvents` revisados (evitar activación global innecesaria)
- [ ] Versión semver coherente (`1.0.0` → `0.9.0` si publicás como beta primero)

---

## C. Assets de tienda

- [ ] **Logo / icon** 128×128 (marca Easii, legible en tema claro y oscuro)
- [ ] **Screenshots** (mín. 1, recomendado 3–5): preview, código resaltado, export PDF
- [ ] **GIF o video corto** (opcional): abrir preview + export
- [ ] Texto corto para listing (≤ 200 caracteres) y descripción larga en README

---

## D. Documentación obligatoria

- [ ] `README.md` en raíz (inglés recomendado para Marketplace)
  - Qué hace, requisitos, comandos, settings, PDF/Chrome
  - Screenshots embebidas
- [ ] `CHANGELOG.md` (Keep a Changelog)
- [ ] `LICENSE` en raíz (mismo texto que `package.json`)
- [ ] Sección **Known limitations** (sin Mermaid/KaTeX, imágenes remotas en export, etc.)
- [ ] Enlace a `docs/export-security.md` para usuarios avanzados

---

## E. Empaquetado (bloqueante técnico)

Shiki + Puppeteer inflan el `.vsix` si se incluye `node_modules` crudo.

- [ ] `.vscodeignore` (excluir `test/`, `openspec/`, `.pi/`, docs internos, maps de dev)
- [ ] Bundler (**esbuild** o **webpack**) para:
  - [ ] Un solo bundle de extensión o chunks controlados
  - [ ] Externalizar o tree-shake Shiki (langs/themes usados solamente)
  - [ ] No empaquetar Chromium completo (PDF ya usa Chrome del sistema)
- [ ] Script `vscode:prepublish` → compile + bundle
- [ ] Probar `npx @vscode/vsce package` y tamaño del `.vsix` (objetivo razonable: &lt; 5–15 MB según estrategia)
- [ ] Probar instalación del `.vsix` en VS Code y Cursor limpios

---

## F. Calidad pre-release

- [ ] `npm test` en CI
- [ ] `npm run compile` / bundle en CI
- [ ] Checklist `docs/manual-validation.md` completo
- [ ] Probar en macOS / Windows / Linux (al menos PDF path y preview)
- [ ] Sin secretos ni paths locales en el paquete

---

## G. Publicación

- [ ] `vsce login <publisher>`
- [ ] `vsce publish` (o `vsce publish --pre-release` para beta)
- [ ] Tag git `v1.0.0` alineado con versión publicada
- [ ] (Opcional) Publicar en [Open VSX](https://open-vsx.org/) para forks OSS de VS Code

---

## H. Post-MVP producto (antes o después de v1 — decisión tuya)

No bloquean un **beta** en Marketplace, pero sí la percepción de “completa”:

| Área | Tarea |
|------|--------|
| Preview | Imágenes relativas en webview |
| UX | Scroll sync editor ↔ preview |
| UX | Panel de settings (temas, PDF path, langs Shiki) |
| Contenido | Mermaid |
| Contenido | KaTeX |
| Calidad | Tests de integración / webview |
| OpenSpec | Archivar `post-mvp-shiki`, `markdown-preview-mvp`, `post-mvp-unit-tests` |
| Spec canónica | `openspec/specs/markdown-preview` (syntax highlighting) |

---

## I. Orden sugerido de trabajo

1. README + CHANGELOG + LICENSE  
2. Icon + screenshots  
3. `.vscodeignore` + bundle + `vscode:prepublish`  
4. Completar `package.json` publisher/repository  
5. Empaquetar `.vsix` → instalar local → validar  
6. Publicar **pre-release** `0.9.x`  
7. Cerrar ítems de tabla H según prioridad  
8. Release `1.0.0`

---

## Referencias

- [Publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [Extension manifest](https://code.visualstudio.com/api/references/extension-manifest)
- [vsce](https://github.com/microsoft/vscode-vsce)
