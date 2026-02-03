# Deploy a Cloudflare Pages

## Deploy manual (actual)

Desde la raíz del proyecto:

```bash
npx wrangler pages deploy . --project-name=mis-plantitas
```

Esto sube los archivos y funciones a Cloudflare Pages.

## Configurar deploy automático con GitHub

Para que Cloudflare haga deploy automático cada vez que haces push:

### 1. Ir al dashboard de Cloudflare

1. Entra a https://dash.cloudflare.com
2. Ve a **Workers & Pages** en el menú lateral
3. Busca el proyecto **mis-plantitas**
4. Click en **Settings** > **Builds & deployments**

### 2. Conectar con GitHub

1. En la sección **Source**, click en **Connect to Git**
2. Selecciona **GitHub**
3. Autoriza Cloudflare si te lo pide
4. Selecciona el repositorio `fabianhtml/mis-plantitas`
5. Configura:
   - **Production branch:** `main`
   - **Build command:** (dejar vacío, es HTML estático)
   - **Build output directory:** `.` o `/`

### 3. Guardar

Click en **Save and Deploy**.

Ahora cada push a `main` disparará un deploy automático.

## Variables de entorno

El proyecto usa KV para persistencia. El binding ya está configurado en `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "PLANTITAS_KV"
id = "2e739b24de1a4226afc313c69b4c2886"
```

Si conectas via GitHub, asegúrate de que el KV namespace esté vinculado en:
**Settings** > **Functions** > **KV namespace bindings**

- Variable name: `PLANTITAS_KV`
- KV namespace: selecciona el namespace existente

## URLs

- **Producción:** https://mis-plantitas.pages.dev
- **Preview (cada deploy):** https://[hash].mis-plantitas.pages.dev

## Troubleshooting

### "API no disponible"
El KV no está vinculado. Revisa los bindings en el dashboard.

### Cambios no aparecen
Cloudflare cachea agresivamente. Prueba con Ctrl+Shift+R o espera unos minutos.

### Deploy falla
Revisa los logs en el dashboard: **Workers & Pages** > **mis-plantitas** > **Deployments** > click en el deploy fallido.
