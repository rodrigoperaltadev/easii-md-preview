# Marketplace assets

Place store assets here before publishing:

| File | Size | Usage |
| --- | --- | --- |
| `icon.png` | 128×128 px | `package.json` → `"icon": "images/icon.png"` |
| `screenshot-1.png` | 1260×750 px recommended | Marketplace listing (upload in portal) |

After adding `icon.png`, add to `package.json`:

```json
"icon": "images/icon.png"
```

Then rebuild: `npm run package`
