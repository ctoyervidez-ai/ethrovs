# ETHROVS

Sitio web bilingüe de ETHROVS, un estudio de diseño y desarrollo web enfocado en crear páginas rápidas, claras y profesionales para negocios locales.

## Sitio en producción

- [ethrovs.com](https://ethrovs.com/)
- [www.ethrovs.com](https://www.ethrovs.com/)

## Portafolio incluido

- [Costa Grill](https://costagrillmx.com/)
- [VSR 444](https://vsr444.com/)

## Desarrollo local

Requiere Node.js `>=22.13.0`.

```bash
pnpm install
pnpm dev
```

Verificaciones principales:

```bash
pnpm lint
pnpm build
```

## Estructura

- `app/page.tsx`: contenido, traducciones y estructura principal.
- `app/globals.css`: sistema visual, animaciones y diseño responsivo.
- `public/assets/`: logotipos e imágenes del sitio.
- `.openai/hosting.json`: configuración del proyecto de hosting.
- `CHAT-HISTORY.md`: conversación visible que documenta la creación y evolución del proyecto.

## Tecnologías

- React / Next-compatible App Router
- TypeScript
- vinext y Vite
- Cloudflare runtime

## Historia del proyecto

Consulta [CHAT-HISTORY.md](./CHAT-HISTORY.md) para ver el proceso completo: idea de negocio, naming de ETHROVS, dominio, correo, estrategia, diseño, portafolio y publicaciones.
