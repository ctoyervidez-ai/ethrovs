# DESIGN.md — ETHROVS

Sistema visual incumbente (autoridad: app/globals.css). Modo dual con el mismo
carácter: "paper" cálido claro por defecto, negro cálido en dark
(prefers-color-scheme). No invertir secciones sueltas; la banda CTA final es
oscura en ambos modos por diseño.

## Tokens

- Fondo: `--paper` #f5f4ef / dark #100f0d · Superficie: `--surface` #fffdf7 / #1a1917
- Tinta: `--ink` #141412 / #f3f2ea · Secundario: `--muted` #6d6c66, `--muted-strong`
  #55544e (usar strong para texto pequeño en mayúsculas: nav, toggles)
- Acentos: `--blue` #2452ff (palabra serif del hero, detalles) y `--acid` #d9ff52
  (CTA de conversión: WhatsApp/reservar). Un acento por función; no mezclar.
- Bordes: `--line` / `--line-soft`. Radios mínimos (1–5px): estética editorial afilada.

## Tipografía

- Sans: Archivo (variable 400–800, autoalojada) — títulos 800, tracking negativo.
- Serif: Instrument Serif itálica — SOLO la palabra gestual (hero "mueven
  negocios.", "24 h.", "recuerde."). Es la firma de la marca; no extenderla a
  párrafos.
- Labels: 0.6–0.72rem, 700, uppercase, tracking 0.13–0.17em. Son parte de la
  retícula editorial (meta a la derecha del sec-head), no eyebrows sobre títulos.

## Composición

- Retícula con reglas verticales visibles en el hero (grid-rules), wrap 1320px.
- Dials (taste): VARIANCE 7 · MOTION 5 · DENSITY 4.
- Motion: transiciones transform/opacity con `--e` cubic-bezier(0.22,0.7,0.3,1);
  scroll-reveal .rv/.in (IntersectionObserver, once); deck del hero rota cada
  4.2s con pausa en hover/focus; todo colapsa bajo prefers-reduced-motion.
- Botones: scale(0.98) en :active; flecha ↗ se desplaza en hover.

## Prohibido aquí

Glassmorphism, degradados morado-azul, tarjetas redondeadas genéricas, em-dash
(—) en copy visible, testimonios/cifras inventados, tres columnas idénticas
nuevas (las de Servicios son incumbentes).
