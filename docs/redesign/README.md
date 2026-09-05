# Rediseño de ethrovs.com — referencia de diseño

`index.html` es una maqueta **estática y autocontenida** del rediseño del sitio.
Ábrela en el navegador para verla funcionando.

Nada de esta carpeta se despliega. `docs/` no se sirve, así que agregar esto
**no cambia el sitio en vivo** — es material de referencia para portar a la app.

## Qué incluye la maqueta

- Nav con switch ES/EN y CTA
- Hero: titular con el renglón en cursiva azul, fila de prueba (24 h / 3 / ES·EN / precio) y deck 3D de capturas que rota solo cada 4.2 s
- Trabajo: reja de tres proyectos con capturas reales, zoom al pasar el mouse
- Servicios, Proceso, Precio (con selector USD/MXN y extras), Dudas
- Banda de cierre oscura con acento lima y footer

Todo el texto existe en español e inglés vía atributos `data-es` / `data-en`,
y todos los precios vía `data-price="usd|mxn"`.

## Cómo portarlo a la app

La app ya tiene la estructura correcta, así que es sobre todo trasvasar:

| En la maqueta | En el repo |
|---|---|
| atributos `data-es` / `data-en` | objeto `copy` en `app/page.tsx` |
| atributos `data-price` | `pricingByMarket` en `app/page.tsx` |
| bloque `<style>` | `app/globals.css` |
| variables `--shot-*` | `public/assets/` |

Los precios y textos de la maqueta ya coinciden con los del repo. **Si hay
diferencia, gana el repo** — es la fuente de verdad.

### Las capturas

`shots/` tiene las tres capturas de los sitios de clientes (JPEG, 70–120 KB
cada una). Cada una se declara **una sola vez** como variable CSS en `:root` y
se reutiliza en el deck del hero y en la reja de trabajo:

```css
:root{ --shot-costa:url("./shots/costa-grill.jpg"); }
.deck figure{ background-image:var(--shot-costa); }
```

Si las usas en la app, muévelas a `public/assets/shots/` y ajusta las rutas.

**Falta Ciao Kitchen.** La maqueta contiene tres proyectos; el repo tiene cuatro. Al portar, agrega Ciao Kitchen.

## Pendientes del repo que conviene resolver de paso

1. **Ciao Kitchen está en `main` pero no en el aire.** El sitio servido hoy
   mostraba una selección de proyectos; consulta `app/content/site.ts` para la lista actual. Falta desplegar.

2. **1.34 MB de imágenes sin usar** en `public/assets/`, sin una sola
   referencia en el código:
   - `hero-preview.png` (1.18 MB)
   - `ethernal-mark.png` (144 KB) — es byte por byte el mismo archivo que
     `ethro-mark.png`, mismo MD5
   - `framer-mark.png` (13 KB)

3. **Fotos guardadas como PNG.** `public/assets/` pesa 6.1 MB.
   `ciao-kitchen.png` sola son 2.98 MB: es una fotografía en un formato para
   gráficos planos. En WebP o JPEG baja a ~200 KB sin diferencia visible.

4. **La imagen de VSR 444 es un hotlink.** `app/page.tsx` carga
   `https://vsr444.com/og.jpg` desde el sitio del cliente. El comentario justo
   arriba dice que las imágenes locales mantienen el portafolio independiente;
   esta es la excepción. Si ese cliente cambia su `og.jpg`, el portafolio se
   rompe solo. `shots/vsr444.jpg` sirve como reemplazo local.
