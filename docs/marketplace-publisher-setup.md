# Paso A — Cuenta y datos de publicación (Marketplace)

Guía para obtener cada dato del [checklist](./marketplace-publish-checklist.md#a-identidad-y-cuenta).

## 1. Cuenta de Publisher

1. Entrá a **https://marketplace.visualstudio.com/manage**
2. Iniciá sesión con tu **cuenta Microsoft** (GitHub también redirige acá).
3. Si es la primera vez, aceptá el acuerdo de publicador.

## 2. Publisher ID (va en `package.json` → `"publisher"`)

1. En Manage Publishers → **Create publisher**
2. Elegí un ID corto y único, por ejemplo `easii` o `rodrigo-peralta`
3. **No lo cambies después** sin migración manual — es la identidad pública de todas tus extensiones.

```json
"publisher": "tu-publisher-id"
```

## 3. Personal Access Token (PAT) para `vsce publish`

`vsce` no usa contraseña de Marketplace; usa un PAT de Azure DevOps con permiso de publicación.

1. **https://dev.azure.com** → mismo usuario Microsoft
2. Arriba a la derecha → **User settings** (ícono usuario) → **Personal access tokens**
3. **+ New Token**
   - Name: `vsce-marketplace` (o el nombre que quieras)
   - Organization: **All accessible organizations**
   - Expiration: según tu política (90 días / custom)
   - Scopes: **Custom defined** → **Marketplace** → **Manage** (solo ese scope alcanza para publicar)
4. **Create** → **copiá el token** (solo se muestra una vez)

Login local:

```bash
npx @vscode/vsce login tu-publisher-id
# Pegá el PAT cuando lo pida
```

## 4. Verificar identidad antes del primer publish

```bash
npm run bundle:production
npx @vscode/vsce package --no-dependencies
# Instalá el .vsix en VS Code: Extensions → ... → Install from VSIX
npx @vscode/vsce publish   # cuando package.json tenga "publisher"
```

## 5. Otros campos del manifest

| Campo | Dónde lo obtenés |
|-------|------------------|
| `repository` | URL del repo GitHub, p. ej. `https://github.com/usuario/easii-md-preview` |
| `homepage` | Misma URL o sitio del producto |
| `bugs` | `https://github.com/usuario/easii-md-preview/issues` |
| `license` | Elegís MIT/ISC y creás `LICENSE` en el repo |
| `author` | Tu nombre o organización (texto libre) |

## 6. Errores frecuentes

- **`Publisher ID 'undefined'`**: falta `"publisher"` en `package.json` o publicás un `.vsix` viejo. Agregá `"publisher": "RodrigoAlexisPeralta"` (exactamente como en Marketplace), corré `npm run package` de nuevo y subí el VSIX nuevo.
- **`Missing publisher`**: falta `"publisher"` en `package.json`
- **`Access denied`**: PAT sin scope Marketplace Manage, o publisher ID incorrecto
- **Extension id**: Marketplace usa `publisher.name` → con publisher `easii` y name `easii-md-preview` el ID es `easii.easii-md-preview`

## Referencias oficiales

- [Publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
- [vsce](https://github.com/microsoft/vscode-vsce)
