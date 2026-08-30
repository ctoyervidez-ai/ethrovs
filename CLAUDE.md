# ETHROVS — sitio del estudio

Sitio bilingüe de ETHROVS (ethrovs.com): estudio web de Laredo, TX / Nuevo Laredo.
React 19 + vinext (App Router sobre Vite) en Cloudflare Workers.

## Comandos

```bash
npm run dev        # servidor de desarrollo (wrangler/miniflare)
npm run build      # build de producción → dist/
npm run start      # sirve el build localmente en :3000
npm test           # build + tests del HTML renderizado (node --test)
npm run lint       # eslint (cero errores; 1 warning de <img> es deliberado)
npx tsc --noEmit   # typecheck
npm run deploy     # build + deploy a Cloudflare (requiere wrangler login)
npm run deploy:dry # ensayo del deploy sin publicar
```

pnpm no está instalado globalmente en esta máquina: usa `npx pnpm@10 <cmd>`
para tocar dependencias (el lockfile es pnpm-lock.yaml v10).

## Estructura

- `app/(es)/` y `app/(en)/en/`: dos root layouts (route groups) — uno por idioma,
  cada uno con su `<html lang>` y su metadata SEO. `/` = español (canónica), `/en` = inglés.
- `app/components/Home.tsx`: ensambla la página; islas cliente: `HeroDeck`
  (carrusel), `Pricing` (moneda USD/MXN), `LangSwitch`, `LocaleSuggest`
  (banner de sugerencia por geolocalización), `Reveal` (scroll-reveal).
- `app/content/{site,es,en}.ts`: todo el copy y los datos (precios, proyectos,
  contacto). Cambios de texto se hacen aquí, no en los componentes.
- `app/{sitemap,robots}.ts`: convenciones de metadata routes de Next.
- `worker/index.ts`: entry del Worker (no tocar; maneja /_vinext/image).
- `wrangler.jsonc`: config de deploy propio. Las rutas del dominio están
  comentadas hasta completar la paridad del cutover (ver blueprints/).

## Reglas del proyecto

- El toggle de idioma usa `<a>` nativo a propósito: el router cliente de vinext
  beta no navega entre root layouts. No lo conviertas a `next/link`.
- Las capturas del portafolio usan `<img loading="lazy">` sin optimizador de
  imágenes (el warning de eslint `no-img-element` es deliberado; no hay binding
  IMAGES en producción propia).
- Fuentes autoalojadas en `public/fonts/` (@font-face en globals.css). No
  reintroducir el @import de Google Fonts.
- La sección de testimonios existe pero está apagada (`SHOW_TESTIMONIALS` en
  Home.tsx) hasta tener frases reales de clientes.
- `.openai/hosting.json` y `app/chatgpt-auth.ts` son residuos del hosting de
  ChatGPT; se eliminan tras 7 días estables en Cloudflare (vite.config.ts aún
  importa hosting.json — quitar ambos en el mismo commit).
- Datos reales intocables sin aprobación de Daniel: precios ($300 USD /
  $5,900 MXN), plazo 24 h, WhatsApp +1 956 951 1763, nombres y URLs de clientes.
