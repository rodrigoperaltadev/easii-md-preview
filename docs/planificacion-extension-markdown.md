# Planificación: Extensión VS Code Markdown Preview

## Visión General
Extensión para VS Code y Cursor que permite ver una preview de archivos `.md` estilo GitHub README.

---

## Fases y Tareas

### 1. Setup Inicial del Proyecto
- [ ] 1.1. Inicializar proyecto TypeScript/Node.js
- [ ] 1.2. Configurar VS Code Extension API (`@types/vscode`)
- [ ] 1.3. Configurar estructura básica (`package.json`, `tsconfig.json`)
- [ ] 1.4. Instalar dependencias: `markdown-it`, `github-markdown-css`, `shiki`

### 2. Core: Parsing Markdown
- [ ] 2.1. Integrar `markdown-it` con plugins necesarios
- [ ] 2.2. Configurar renderizado básico a HTML
- [ ] 2.3. Agregar soporte para GFM (tablas, task lists)
- [ ] 2.4. Optimizar rendimiento con debounced parsing

### 3. Core: Estilos GitHub
- [ ] 3.1. Integrar `github-markdown-css`
- [ ] 3.2. Ajustar estilos para preview local
- [ ] 3.3. Soporte para dark/light mode

### 4. Webview: Renderizado Seguro
- [ ] 4.1. Crear panel Webview seguro
- [ ] 4.2. Sanitizar HTML de salida
- [ ] 4.3. Manejar imágenes y assets relativos
- [ ] 4.4. Inyectar estilos y scripts

### 5. Core: Syntax Highlighting
- [ ] 5.1. Integrar Shiki para resaltado de código
- [ ] 5.2. Lazy-loading de Shiki (optimización)
- [ ] 5.3. Soporte para lenguajes comunes

### 6. Features: Interfaz de Usuario
- [ ] 6.1. Comando "Open Preview"
- [ ] 6.2. Sidebar auto-actualizable
- [ ] 6.3. Scroll sync (editor ↔ preview)
- [ ] 6.4. Panel de configuraciones (settings)

### 7. Features: Compatibilidad Avanzada
- [ ] 7.1. Mermaid.js (diagramas)
- [ ] 7.2. KaTeX (fórmulas LaTeX)
- [ ] 7.3. Links relativos funcionales
- [ ] 7.4. Anchors/headers con IDs

### 8. Testing y Calidad
- [ ] 8.1. Tests unitarios del parser
- [ ] 8.2. Tests de integración Webview
- [ ] 8.3. Performance benchmarks
- [ ] 8.4. Compatibilidad con Cursor

### 9. Bundling y Distribución
- [ ] 9.1. Configurar webpack/rollup
- [ ] 9.2. Bundle size optimization
- [ ] 9.3. Publicar en VS Code Marketplace
- [ ] 9.4. Documentación README

### 10. Extras (Opcional)
- [ ] 10.1. Exportar a PDF/HTML
- [ ] 10.2. Edición inline desde preview
- [ ] 10.3. Soporte para múltiples ventanas de preview

---

## Prioridad (MVP)
1. Setup inicial
2. Parsing Markdown + GFM
3. Webview básico con estilos GitHub
4. Preview funcional
5. Publicar versión beta

---

## Próximos pasos
Ir iterando fase por fase, asignando tareas a subagentes o ejecutándolas manualmente.