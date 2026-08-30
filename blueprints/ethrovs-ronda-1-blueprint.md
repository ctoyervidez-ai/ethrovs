# ETHROVS — Ronda 1 — Blueprint de cambio (brownfield)

> **ESTADO 2026-08-30: implementado directamente en la sesión que lo generó**
> (pasos 1–12 completados en el working tree, con dos divergencias deliberadas:
> la captura de Ciao vive ahora en `/assets/shots/ciao.jpg` en lugar de
> `/assets/ciao-kitchen.png`, y el toggle de idioma usa `<a>` nativo porque el
> router cliente de vinext beta no navega entre root layouts). Este documento
> queda como especificación de referencia y como guía del cutover (§9.1) y el
> launch checklist, que siguen pendientes.

> Generado por The Architect el 2026-08-30
> Shape: sitio de marketing estático-dinámico sobre Workers (brownfield: el sistema ya existe)
> Runtime track: Node 22 + React 19 + vinext (vite) sobre Cloudflare Workers — pins del lockfile del repo
> Emission mode: archivo único (preferencia explícita del usuario; 13 pasos)
> Blueprint version: 2
> Versions last verified: 2026-08-30 — ver §11 para procedencia por paquete

**Repo objetivo:** `/Users/doyer/ethrovs` (GitHub `ctoyervidez-ai/ethrovs`, branch `main`).
**Regla de idioma:** el blueprint está en español; código, comandos, rutas de archivo y palabras clave
EARS (`WHEN`, `THE SYSTEM SHALL`) quedan en inglés.

---

## 1. Project Overview & Non-Goals

### Vision

ETHROVS (ethrovs.com) es el estudio web bilingüe de Daniel Oyervidez, con base en Laredo, TX y
Nuevo Laredo, MX. Vende un solo producto claro — **"Website Express 24 h"** desde **$300 USD /
$5,900 MXN** — a negocios locales de ambos lados de la frontera, con un portafolio de cinco sitios
en vivo (Costa Grill, VSR 444, BECK, Excessive Detailing, Ciao Kitchen). Esta ronda **no cambia el
producto ni el copy de venta**: migra el hosting de la infraestructura de ChatGPT/OpenAI (que hoy
sirve una versión desactualizada con precio $200) a la propia cuenta Cloudflare del usuario, separa
los idiomas por URL (`/` = ES, `/en` = EN) para SEO local, y añade metadata localizada, sitemap,
JSON-LD, testimonios placeholder y un refactor a componentes sin cambio visual.

### Current state (mapa del repo — leído del código, no asumido)

| Qué | Estado actual |
|---|---|
| Framework | vinext 1.0.0-beta.2 (App Router estilo Next sobre vite 8) + React 19.2.6, target Cloudflare Workers |
| Sitio | **Todo en `app/page.tsx`** (195 líneas): componente cliente `"use client"` con objeto `copy` es/en, estado `language`/`market` en `useState` + `localStorage` (`ethrovs-language`, `ethrovs-market`, `ethrovs-language-manual`), autodetección vía `fetch("/api/locale")` |
| Layout | `app/layout.tsx`: `<html lang="es">` fijo, metadata estática **en inglés** ("ETHROVS — Digital Energy in Motion"), `metadataBase` https://ethrovs.com |
| API | `app/api/locale/route.ts`: geodetección (US→en, MX→es, si no `accept-language`), JSON `{city, country, language, region}`, `Cache-Control: private, no-store` |
| Worker | `worker/index.ts`: entry Workers; ruta `/_vinext/image` con binding `IMAGES`; delega el resto a `vinext/server/app-router-entry` |
| Estilos | `app/globals.css`: sistema editorial oscuro/claro con variables (`--paper`, `--ink`, `--acid`…), Archivo + Instrument Serif (Google Fonts), `:focus-visible` y `prefers-reduced-motion` ya presentes |
| Tests | `tests/rendered-html.test.mjs`: **obsoleto** — heredado del starter, afirma el esqueleto "Your site is taking shape" y archivos `app/_sites-preview/` que ya no existen. Verificado 2026-08-30: falla con 2 errores (`ERR_ASSERTION` y `ENOENT app/_sites-preview/SkeletonPreview.tsx`) |
| Build | `pnpm build` → `dist/server/index.js` (worker) + `dist/client/` (assets). Verificado 2026-08-30 ejecutando el build: vinext genera además `dist/server/wrangler.json` con `compatibility_date: "2026-05-15"`, `nodejs_compat`, `assets.directory: "../client"` |
| Hosting | **Producción vive en el hosting de ChatGPT/OpenAI** (`.openai/hosting.json`, project `appgprj_6a7c99be6be08191a2d52d4339de682e`) y está desactualizada (muestra $200; el repo dice $300). El dominio ethrovs.com ya está en la cuenta Cloudflare del usuario (registrador y NS Cloudflare: `eleanor`/`vin.ns.cloudflare.com`); el DNS actual apunta al hosting de OpenAI |
| Package manager | pnpm (hay `pnpm-lock.yaml` **y** `package-lock.json`; `package-lock.json` es residuo — ver DECOM-2 en §9.1) |
| Legado sin uso | `app/chatgpt-auth.ts` (auth de ChatGPT), `db/` + drizzle (sin uso), `build/sites-vite-plugin.ts`, `CHAT-HISTORY.md` |
| Agent files | **No existe CLAUDE.md ni AGENTS.md en el repo hoy** — los de §19 se crean nuevos, no fusionan nada |

Comandos reales del repo: `pnpm dev` · `pnpm build` · `pnpm start` · `pnpm test` (= `npm run build
&& node --test tests/rendered-html.test.mjs`) · `pnpm lint` · `pnpm db:generate` (drizzle, sin uso).

### Target state

Mismo sitio, mismo copy, mismo sistema visual — pero:

1. Deploy propio a Cloudflare Workers con `wrangler.jsonc` + `@vinext/cloudflare` (`pnpm deploy`),
   probado en su URL `workers.dev` mientras el hosting viejo sigue sirviendo ethrovs.com (§9.1).
2. `/` = español (canónica), `/en` = inglés, cada una server-renderizada con su `<html lang>`; el
   toggle ES/EN del nav navega entre rutas; la geodetección solo **sugiere** el otro idioma con un
   banner discreto, nunca redirige.
3. Metadata, OG/twitter y hreflang localizados por ruta; `sitemap.xml`; JSON-LD `ProfessionalService`.
4. `app/page.tsx` separado en `app/components/` + `app/content/{es,en,site}.ts`, con paridad probada
   por strings clave en el HTML renderizado.
5. Testimonios placeholder (`TODO(daniel)`) + fila de credibilidad en el hero.
6. Test suite real que sustituye al del starter y sirve de arnés para todo lo anterior.

### Users

| Persona | A qué viene | Frecuencia |
|---|---|---|
| Dueño de negocio local (Laredo/Nuevo Laredo) que llegó por búsqueda o recomendación | Ver el portafolio, entender el precio, escribir por WhatsApp | Una vez (conversión) |
| Prospecto angloparlante de Texas | Lo mismo, en inglés, en `/en` | Una vez |
| Daniel (dueño) | Actualizar copy/testimonios, desplegar | Semanal |

### Goals — alcance v1 (esta ronda)

1. El sitio se despliega a la cuenta Cloudflare del usuario con un comando (`pnpm deploy`) y es
   verificable en `workers.dev` antes de tocar DNS.
2. `/` y `/en` sirven el sitio completo en su idioma, con `lang`, título, descripción, OG y hreflang
   correctos por ruta, más `sitemap.xml` y JSON-LD `ProfessionalService`.
3. El código queda en componentes + contenido separado, con paridad de strings probada por tests.
4. El sitio muestra testimonios (placeholder marcado) y fila de credibilidad, respetando el sistema
   visual existente.
5. Existe un plan de cutover ejecutable con paridad, kill criteria y decomiso (§9.1).

### Non-Goals — explícitamente fuera de alcance en v1

| No se construye | Por qué no ahora | Se revisa cuando |
|---|---|---|
| Blog, panel de clientes o CMS | Cero demanda validada; añade superficie de fallo a una migración de hosting | Haya ≥3 pedidos de clientes reales |
| Cambios de precio o de copy de venta ($300 USD / $5,900 MXN y todos los textos de `app/page.tsx` quedan **tal cual**) | El copy actual es el contrato de la oferta; esta ronda es infraestructura | Daniel decida una nueva oferta |
| Uso de D1/drizzle (el código `db/` queda intacto y sin uso) | No hay datos que persistir | Se añada un formulario de leads |
| Rediseño de marca o del sistema visual de `globals.css` | La estética editorial actual es un activo; la ronda exige CERO cambio visual salvo las adiciones marcadas | Nunca en esta línea de trabajo |
| Upgrade de vinext (se queda en 1.0.0-beta.2) o de cualquier pin del lockfile | Regla brownfield: manda el lockfile; un upgrade beta en plena migración duplica las incógnitas | La migración lleve 30 días estable |
| Redirect automático por geolocalización | Google penaliza redirects por IP; el hreflang + banner es el patrón SEO correcto | Nunca (decisión de diseño, no aplazamiento) |
| Mover `/` a `/es` o eliminar URLs existentes | `/` es la URL indexada y compartida; romperla destruye el SEO que la ronda busca ganar | Nunca |
| Tocar `worker/index.ts`, su ruta `/_vinext/image`, o el contrato JSON de `/api/locale` | Interfaces congeladas — espejo de §5 *Interfaces held constant* | Nunca en esta ronda |
| Pipeline de CI | El gate §20.1 corre local; CI sin cuenta configurada bloquearía el build | La ronda 2, con el hosting ya migrado |

**El builder no implementa nada de esta tabla**, aunque parezca una adición pequeña durante un paso
adyacente. Si un paso parece exigir un non-goal, es un defecto del blueprint: detente y repórtalo.

### Success metrics

| Métrica | Objetivo | Cómo se mide |
|---|---|---|
| Paridad en preview | `scripts/parity.sh` sale 0 contra la URL workers.dev antes del cutover | `BASE_URL=<workers.dev> bash scripts/parity.sh; echo $?` |
| Precio correcto en producción | ethrovs.com muestra $300 (hoy muestra $200) dentro de las 48 h post-cutover | `curl -s https://ethrovs.com/ \| grep -c '\$300'` ≥ 1 |
| Indexación bilingüe | `/` y `/en` indexadas en Search Console dentro de 30 días post-cutover | Search Console → Páginas |
| Estabilidad | 0 respuestas 5xx sostenidas en los 7 días de soak (gate del decomiso DECOM-1) | Dashboard Cloudflare → Workers → métricas |

---

## 2. Tech Stack

**Runtime track: Node 22 + React 19 + vinext sobre Cloudflare Workers.** Esta tabla nombra
*elecciones*, no versiones. Todo pin vive en §11 y en ningún otro lugar. Regla brownfield: los pins
salen de `pnpm-lock.yaml` del repo, verificados 2026-08-30 — cero upgrades.

| Capa | Elección | Por qué esta, sobre qué alternativa |
|---|---|---|
| Language / runtime | TypeScript sobre Node >=22.13.0 (engines de package.json) y workerd en producción | Ya es lo que hay; cambiar runtime en una migración de hosting duplica riesgo |
| Framework | vinext (App Router estilo Next sobre vite), **ya en el repo** | Es la línea del starter que produce el sitio actual; reescribir a Next.js real sería un rewrite big-bang, prohibido por la regla brownfield 1 |
| Styling | CSS plano en `app/globals.css` con variables (sistema existente) | Tailwind está instalado pero el sitio real no usa utilidades; introducirlas ahora crearía dos estilos en un árbol |
| Component layer | Componentes React propios en `app/components/` (nuevo, del refactor) | Sin librería de componentes: el sitio es una página editorial, no una app |
| Database | Ninguna (D1/drizzle presentes, **sin uso, no tocar**) | No hay datos que persistir; ver Non-Goals |
| ORM / data access | NOT APPLICABLE — sin base de datos en uso | — |
| Auth | Ninguna (el `app/chatgpt-auth.ts` legado se decomisa en §9.1, no se usa) | Sitio público sin cuentas |
| Background work | Ninguno | No hay trabajos asíncronos |
| Payments | NOT APPLICABLE — el cobro es 50/50 por WhatsApp, fuera del sitio | — |
| File storage | `public/` servido como assets estáticos del Worker (binding `ASSETS`) | Ya funciona así; R2 sería infraestructura sin consumidor |
| Email / notifications | `mailto:` y links de WhatsApp (los del copy actual) | Cero backend que mantener; es el canal real del negocio |
| Hosting | **Cloudflare Workers (cuenta propia del usuario)** — el delta de la ronda | Reemplaza el hosting de ChatGPT/OpenAI, que está desactualizado y fuera del control del usuario; el dominio ya está en Cloudflare (NS `eleanor`/`vin.ns.cloudflare.com`) |
| Deploy tooling | `@vinext/cloudflare` 1.0.0-beta.6 + `wrangler.jsonc` (nuevo) | Adaptador oficial de la línea vinext del repo; fallback documentado `wrangler deploy` (§20.2) |
| Package manager | pnpm (pnpm-lock.yaml manda; `package-lock.json` es residuo → DECOM-2) | Dos lockfiles en un repo son dos verdades; pnpm es el que instala limpio con `--frozen-lockfile` (verificado 2026-08-30) |

### Compatibility check

Verificado contra el propio repo, que es la fuente de compatibilidad en brownfield: la combinación
completa (vinext 1.0.0-beta.2 + vite 8.0.13 + @cloudflare/vite-plugin 1.37.1 + wrangler 4.92.0 +
React 19.2.6) **compila y renderiza hoy** — `pnpm install --frozen-lockfile && pnpm build` ejecutado
2026-08-30 con exit 0 y HTML completo servido por el worker compilado. La única pieza nueva con
código en runtime, `@vinext/cloudflare` 1.0.0-beta.6, es de la misma línea beta de vinext
(verificado en registry.npmjs.org 2026-08-30); la otra alta, `@cloudflare/workers-types` (§11),
son solo declaraciones de tipos — cero código ejecutable. No se introduce ninguna combinación no
probada; el riesgo residual del adaptador beta está en §20.2 con fallback.

---

## 3. Directory Structure

```
ethrovs/
├── app/
│   ├── (es)/                        # route group ES — raíz de idioma español
│   │   ├── layout.tsx               # <html lang="es"> + metadata ES + JSON-LD ES  [paso 8, metadata paso 10]
│   │   └── page.tsx                 # ruta / → <HomePage locale="es" />            [paso 8]
│   ├── (en)/                        # route group EN
│   │   ├── layout.tsx               # <html lang="en"> + metadata EN + JSON-LD EN  [paso 8, metadata paso 10]
│   │   └── en/
│   │       └── page.tsx             # ruta /en → <HomePage locale="en" />          [paso 8]
│   ├── api/
│   │   └── locale/route.ts          # CONGELADO — contrato en §5, no se toca
│   ├── chatgpt-auth.ts              # legado OpenAI — se decomisa en DECOM-1 (§9.1), NO en esta ronda
│   ├── components/                  # componentes de presentación (nuevo)
│   │   ├── Nav.tsx                  # [paso 4; toggle a links en paso 7]
│   │   ├── Hero.tsx                 # [paso 4; fila de credibilidad en paso 11]
│   │   ├── Footer.tsx               # [paso 4]
│   │   ├── Work.tsx                 # [paso 5; <img loading="lazy"> en paso 12]
│   │   ├── Services.tsx             # [paso 5]
│   │   ├── Process.tsx              # [paso 5]
│   │   ├── Pricing.tsx              # [paso 6]
│   │   ├── Faq.tsx                  # [paso 6]
│   │   ├── Contact.tsx              # [paso 6]
│   │   ├── HomePage.tsx             # composición cliente, prop locale [paso 6; parametrizado paso 7]
│   │   ├── LocaleSuggestion.tsx     # banner de sugerencia de idioma [paso 9]
│   │   └── Testimonials.tsx         # testimonios placeholder [paso 11]
│   ├── content/                     # todo el copy y los datos del sitio (nuevo)
│   │   ├── site.ts                  # tipos, precios, proyectos, links WhatsApp/email [paso 3]
│   │   ├── es.ts                    # copy español, byte-idéntico al actual [paso 3]
│   │   └── en.ts                    # copy inglés, byte-idéntico al actual [paso 3]
│   └── globals.css                  # sistema visual existente — solo adiciones marcadas [pasos 9]
├── worker/index.ts                  # CONGELADO — entry Workers + /_vinext/image
├── tests/site.test.mjs              # arnés real [paso 1] — sustituye a rendered-html.test.mjs
├── scripts/parity.sh                # arnés de paridad contra un deploy [paso 13]
├── docs/cutover/
│   ├── dns-before.txt               # captura dig del DNS previo al cutover [paso 13]
│   └── launch-checklist.md          # pasos humanos post-build [paso 13]
├── public/
│   ├── sitemap.xml                  # ambas URLs + hreflang [paso 10]
│   └── …                            # favicon.svg, og.png, assets/ — existentes, intactos
├── wrangler.jsonc                   # config del Worker propio [paso 2]
├── blueprints/
│   └── ethrovs-ronda-1-blueprint.md # este documento
├── CLAUDE.md                        # §19.1 — nuevo (hoy no existe)
├── AGENTS.md                        # §19.2 — nuevo
├── .claude/
│   ├── settings.json                # §19.3
│   └── rules/
│       ├── content.md               # §19.5
│       └── components.md            # §19.5
├── package.json                     # delta en paso 1 (script test + devDep @cloudflare/workers-types) y paso 2 (devDep @vinext/cloudflare + script deploy)
├── pnpm-lock.yaml                   # manda; se actualiza en los pasos 1 y 2 (pnpm add)
├── package-lock.json                # RESIDUO — DECOM-2, no borrar en caliente
├── .openai/hosting.json             # legado — DECOM-1; vite.config.ts lo importa (ver §9.1)
├── tsconfig.json                    # existente; única edición: "types" añade @cloudflare/workers-types [paso 1]
├── vite.config.ts, eslint.config.mjs, next.config.ts, …  # existentes, intactos
└── db/, drizzle/, build/, docs/, examples/, CHAT-HISTORY.md              # existentes, intactos
```

### Delta (archivos que esta ronda toca)

| Acción | Archivos |
|---|---|
| **Nuevos** | `wrangler.jsonc`, `tests/site.test.mjs`, `app/content/{site,es,en}.ts`, `app/components/*.tsx` (12), `app/(es)/{layout,page}.tsx`, `app/(en)/layout.tsx`, `app/(en)/en/page.tsx`, `public/sitemap.xml`, `scripts/parity.sh`, `docs/cutover/{dns-before.txt,launch-checklist.md}`, `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.claude/rules/{content,components}.md` |
| **Modificados** | `package.json` (script `test` + devDep `@cloudflare/workers-types` en paso 1; devDep `@vinext/cloudflare` + script `deploy` en paso 2), `tsconfig.json` (**solo** `"types"` en `compilerOptions` — añade `@cloudflare/workers-types`, paso 1), `app/page.tsx` (fix acotado del efecto de restauración de idioma, paso 1 — autorización en el Do del paso 1 y decisión 13 de §20.3), `pnpm-lock.yaml` (pasos 1 y 2), `app/globals.css` (solo `.lang-hint`, paso 9) |
| **Eliminados** | `tests/rendered-html.test.mjs` (paso 1), `app/layout.tsx` y `app/page.tsx` (paso 8 — sustituidos por los route groups) |
| **Intactos (congelados)** | `worker/index.ts`, `app/api/locale/route.ts`, `vite.config.ts`, `.openai/hosting.json`, `app/chatgpt-auth.ts`, `db/**`, `package-lock.json`, todo `public/` existente |

**Boundary rules**

- `app/content/**` no importa React ni nada de `app/components/`: solo datos y tipos.
- `app/components/**` importa contenido de `app/content/` y tipos; nunca hace `fetch` salvo
  `LocaleSuggestion.tsx` (el único componente con red, y solo a `/api/locale`).
- Los route groups `(es)/`, `(en)/` solo componen: importan `HomePage` y contenido; cero lógica.
- Nada nuevo importa `db/`, `app/chatgpt-auth.ts` ni `build/`.
- Convención de imports: **relativos** dentro de `app/` (el alias `@/*` de tsconfig existe pero no
  se usa en código nuevo) — resuelta contra cada loader en la matriz de §19.6.

Ningún archivo de este árbol "se crea solo": cada nuevo/modificado aparece por nombre en el **Do**
del paso indicado entre corchetes, o se emite en §19 (workspace). `dist/` lo genera `pnpm build` y
está gitignorado.

---

## 4. Data Model

NOT APPLICABLE — el sitio no persiste datos: no hay base de datos en uso, no hay formularios que
escriban, y el estado de cliente (moneda elegida, banner descartado) vive en `localStorage` del
navegador. Los artefactos drizzle/D1 del starter (`db/`, `drizzle/`, `drizzle.config.ts`,
`pnpm db:generate`) existen en el repo pero **no se usan ni se tocan** (Non-Goal en §1). Ningún paso
de §9 referencia esta sección.

---

## 5. API Design

### Conventions

El sitio expone exactamente **una** API propia (`/api/locale`) más el endpoint interno de imágenes
del worker. No hay envelope, versión, paginación ni rate limiting propios: son dos endpoints GET sin
estado, y añadir convenciones de API a un folleto sería inventar superficie. Cloudflare aplica sus
límites de plan (§16).

### Routes

| Method | Path | Descripción | Auth | Estado en esta ronda |
|---|---|---|---|---|
| GET | `/` | Sitio en español (SSR) | público | existente; pasa a route group `(es)` |
| GET | `/en` | Sitio en inglés (SSR) | público | **nuevo** (paso 8) |
| GET | `/api/locale` | Geodetección para sugerir idioma | público | **CONGELADO** |
| GET | `/_vinext/image` | Optimización de imágenes (worker) | público | **CONGELADO** — sin consumidores en las páginas hoy; no tocar |
| GET | `/sitemap.xml` | Sitemap estático desde `public/` | público | **nuevo** (paso 10) |

### Critical endpoints — detalle completo

**GET `/api/locale` — contrato congelado (el código actual es la especificación):**

- Respuesta 200, `Content-Type: application/json`, header `Cache-Control: private, no-store`.
- Body exacto: `{ "city": string, "country": string, "language": "es"|"en", "region": string }`.
- Lógica: `country` de `cf-ipcountry` → `x-vercel-ip-country` → `request.cf.country` (descartando
  `"XX"`); `language` = `"en"` si country `US`, `"es"` si `MX`, si no según `accept-language`
  empieza con `en`; `city`/`region` de `request.cf` o headers, `""` si faltan.
- Sin parámetros, sin errores propios (siempre 200).
- **Cambio de uso, no de contrato:** hoy el cliente lo usa para *fijar* el idioma; desde el paso 9
  solo lo usa `LocaleSuggestion.tsx` para *sugerir* el otro idioma. El endpoint no se edita.

**GET `/` y GET `/en`:** 200 `text/html`, HTML completo server-renderizado (verificado: el worker
compilado ya emite el documento entero). Contienen los strings de paridad de §9.1. `/en` no existe
en el sistema viejo: es delta aprobado, no ruptura de paridad.

### Interfaces held constant (espejo en Non-Goals §1)

| Interfaz | Qué se congela | Probado por |
|---|---|---|
| URL `/` | Sigue siendo el sitio en español; sin redirects, sin URLs eliminadas | test "/ renderiza el sitio real en español" (paso 1) |
| `/api/locale` | Contrato JSON y header de caché exactos de arriba | test "/api/locale conserva su contrato JSON" (paso 1) |
| `worker/index.ts` y `/_vinext/image` | El archivo no se edita en ningún paso | `git diff --stat` del rango de la ronda no lo lista (gate manual §20.1) |
| Precios y copy de venta | `$300` USD / `$5,900` MXN y todos los strings de `app/page.tsx` | tests de paridad (pasos 1, 3) + `scripts/parity.sh` |
| Comandos existentes | `pnpm dev` / `build` / `start` / `test` / `lint` siguen funcionando | §20.1 |

---

## 6. Frontend Architecture

### Routes

| Route | Página | Fuente de datos | Auth |
|---|---|---|---|
| `/` | `app/(es)/page.tsx` → `<HomePage locale="es" />` | `app/content/es.ts` + `site.ts` (import estático) | público |
| `/en` | `app/(en)/en/page.tsx` → `<HomePage locale="en" />` | `app/content/en.ts` + `site.ts` | público |

### Rendering strategy

Todo es SSR por el Worker en cada request (vinext no expone SSG en esta línea beta; el HTML ya sale
completo del server — verificado). Los assets estáticos (`/_next/static/*`, `public/*`) los sirve el
binding `ASSETS` con `Cache-Control: public, max-age=31536000, immutable` para los hasheados
(`dist/client/_headers`, generado por el build). No se añade caché de HTML en esta ronda.

### Component hierarchy

```
app/(es)/layout.tsx  (server: <html lang="es">, metadata ES, JSON-LD ES)
└── app/(es)/page.tsx  (server)
    └── HomePage locale="es"  ("use client" — estado: market, deck, banner)
        ├── Nav          (toggle ES/EN = links a "/" y "/en")
        ├── LocaleSuggestion  (banner; único componente que hace fetch)
        ├── Hero         (incluye fila de credibilidad desde paso 11)
        ├── Work · Services · Process · Pricing · Faq · Testimonials · Contact
        └── Footer
app/(en)/layout.tsx / app/(en)/en/page.tsx — idéntico con locale="en"
```

`HomePage` es el único límite server→client. Los hijos son presentacionales: reciben `c` (el objeto
de copy del idioma) y callbacks; `Pricing` recibe además `market` y `setMarket`.

### State management

- **Idioma = la ruta.** Desde el paso 7 no hay estado `language` ni claves `ethrovs-language` /
  `ethrovs-language-manual` en localStorage (dejan de escribirse; las viejas quedan huérfanas e
  inofensivas).
- **Moneda** (`market: "us" | "mx"`): `useState` + `localStorage["ethrovs-market"]` — sin cambios.
- **Deck del hero** (`activeProject`, `deckPaused`): `useState` local — sin cambios.
- **Banner**: `localStorage["ethrovs-lang-hint-dismissed"]`, lecturas/escrituras en `try/catch`.
- Nada de estado global ni librería de fetching: una página, dos fetch posibles en total.

### Loading, empty, and error states

- `LocaleSuggestion`: no renderiza nada hasta tener respuesta (sin spinner — es una sugerencia, no
  contenido); si `fetch` falla o el JSON no trae `language` válido, no renderiza nada y no loguea
  error al usuario; si la sugerencia coincide con el idioma de la ruta, no renderiza nada.
- El resto del sitio no tiene estados async: todo el contenido llega en el HTML.
- 404: la que sirva vinext por defecto (sin página custom — fuera de alcance, no medible en paridad
  porque el sitio viejo tampoco tiene).

---

## 7. Design System

**El sistema visual ya existe en `app/globals.css` y está CONGELADO: esta sección lo documenta para
que los componentes nuevos (banner, testimonios, credibilidad) lo respeten — no autoriza a cambiar
un solo valor.** Adiciones permitidas: únicamente la clase `.lang-hint` (paso 9), construida con
estos mismos tokens.

### Colors (valores literales de `globals.css`)

| Token | Light | Dark | Uso |
|---|---|---|---|
| `--paper` | `#f5f4ef` | `#100f0d` | fondo de página |
| `--surface` | `#fffdf7` | `#1a1917` | cards, paneles |
| `--ink` | `#141412` | `#f3f2ea` | texto principal |
| `--muted` | `#6d6c66` | `#9a988e` | texto secundario, labels |
| `--line` | `rgba(20,20,18,.14)` | `rgba(243,242,234,.17)` | divisores |
| `--line-soft` | `rgba(20,20,18,.07)` | `rgba(243,242,234,.08)` | divisores suaves |
| `--blue` | `#2452ff` | `#7d97ff` | acentos, serif del h1, focus ring |
| `--acid` | `#d9ff52` | `#d9ff52` | CTA primario |
| `--on-acid` | `#141412` | `#141412` | texto sobre acid |
| `--band-bg` / `--band-fg` | `#141412` / `#f5f4ef` | `#211f1c` / `#f5f4ef` | banda CTA final |

**Contraste (medido 2026-08-30, WCAG 2.2 AA):** `--muted`/`--paper` light = **4.78:1** (pasa texto
normal), `--on-acid`/`--acid` = **16.14:1**, `--blue`/`--paper` light = **5.12:1**; en dark,
`--muted`/`--paper` = 6.62:1 y `--blue`/`--paper` = 7.06:1. Todos los pares usados pasan AA; nada
que corregir.

### Typography

| Rol | Familia | Tamaño / interlineado | Peso | Tracking |
|---|---|---|---|---|
| Display (h1) | Archivo | `clamp(2.85rem, 7.4vw, 5.9rem)` / 0.93 | 800 | -0.045em |
| Serif de acento | Instrument Serif itálica | 1.04em del contenedor | 400 | -0.015em |
| Headings h2 | Archivo | `clamp(1.7rem, 3.4vw, 2.7rem)` / 1.05 | 700 | -0.04em |
| Body | Archivo | 0.94–1rem / 1.55–1.65 | 400 | normal |
| Kickers (`.label`) | Archivo | 0.66rem, MAYÚSCULAS | 700 | 0.17em |

**Font loading:** Google Fonts vía `@import` en `globals.css` (Archivo 400–800, Instrument Serif),
`display=swap`; fallbacks `Helvetica Neue/Arial` y `Georgia/Times`. No se cambia.

### Spacing, radius, elevation

- Ancho máximo `--max: 1320px`; gutter `clamp(20px, 4vw, 64px)`; secciones `padding-block:
  clamp(52px, 7.5vw, 100px)`.
- Radius: 2px botones/toggles, 4px imágenes, 5px cards. Sombra: `--shadow` (dos capas suaves).
- Breakpoints existentes: 620 / 800 / 860 / 920 / 940 / 980 / 1000 px.

### Motion

Easing global `--e: cubic-bezier(0.22, 0.7, 0.3, 1)`; transiciones 0.2–0.7s; deck rota cada 4200 ms.
`prefers-reduced-motion: reduce` ya anula animaciones y transiciones globalmente (CSS) y pausa el
deck (JS) — los componentes nuevos no añaden animación alguna.

### Component style

Editorial de estudio: papel cálido, tinta casi negra, un solo acento eléctrico (`--acid`) reservado
para el CTA de dinero, kickers en mayúsculas con tracking ancho, serif itálica solo para el giro
emocional del titular. Un componente nuevo pertenece si se construye con `.sec`, `.wrap`,
`.sec-head`, `.label`, `.serif`, `.btn*` y los tokens de arriba, y desentona si introduce un hex
nuevo, un radius nuevo o una sombra nueva.

---

## 8. Authentication & Authorization

NOT APPLICABLE — el sitio es público y sin cuentas. El único artefacto de auth del repo,
`app/chatgpt-auth.ts`, pertenece al hosting de ChatGPT que esta ronda abandona: nada lo importa
desde las páginas, ningún paso lo usa, y se elimina en el decomiso DECOM-1 (§9.1), no antes. Ningún
paso de §9 referencia esta sección.

---

## 9. BUILD ORDER

Reglas operativas para el builder: un paso por sentada; los cuatro campos (`Do`, `Done when`,
`Verify`, `Checkpoint`) son obligatorios; `Verify` es shell literal que sale 0 en un paso correcto;
nunca saltar adelante; si un paso se rompe, `git reset --hard` al tag del paso anterior y reintentar.
Los `Verify` no asertan estado git del propio paso (los asserts post-commit van en el `Checkpoint`).

**Contexto de ejecución de los `Verify`:** todos corren desde la raíz del repo. `pnpm test` ejecuta
`npm run build && node --test <archivo>` — es decir, **cada `pnpm test` recompila y prueba el HTML
real**: es el arnés de paridad de toda la ronda.

### Step map

| # | Paso | Depende de | Toca | Gate |
|---|---|---|---|---|
| 1 | Arnés de tests reales + gates en verde | — | tests/, package.json, tsconfig.json, app/page.tsx, pnpm-lock.yaml | `pnpm test` → 0 failed + `pnpm lint` + `npx tsc --noEmit` |
| 2 | Deploy propio: wrangler.jsonc + @vinext/cloudflare | 1 | wrangler.jsonc, package.json, pnpm-lock.yaml | sondeo del paquete (sin invocar deploy) + `pnpm build` |
| 3 | Contenido a `app/content/` | 1 | content/, page.tsx, tests | `pnpm test` |
| 4 | Componentes I: Nav, Hero, Footer | 3 | components/, page.tsx | `pnpm test` |
| 5 | Componentes II: Work, Services, Process | 4 | components/, page.tsx | `pnpm test` |
| 6 | Componentes III: Pricing, Faq, Contact + HomePage | 5 | components/, page.tsx | `pnpm test` |
| 7 | HomePage por locale + toggle a links | 6 | HomePage, Nav, page.tsx | `pnpm test` |
| 8 | Rutas de idioma `/` y `/en` | 7 | app/(es), app/(en), tests | `pnpm test` (incluye /en) |
| 9 | Banner de sugerencia de idioma | 8 | LocaleSuggestion, HomePage, globals.css, tests | `pnpm test` + greps |
| 10 | Metadata localizada + hreflang + sitemap + JSON-LD | 8 | layouts, public/sitemap.xml, tests | `pnpm test` |
| 11 | Testimonios + credibilidad en hero | 10 | Testimonials, Hero, content, HomePage | `pnpm build` + grep del HTML |
| 12 | Pulido observable: imágenes lazy | 11 | Work.tsx, app/content/site.ts, tests | `pnpm test` |
| 13 | Preparación de cutover | 12 | scripts/, docs/cutover/ | `bash -n` + `test -s` + `pnpm test` |

Ordenamiento: el arnés va primero (paso 1) porque es el gate de todos los demás; el deploy propio va
segundo (regla fail-fast: el artefacto ejecutable y su config se ejercitan mientras el error cuesta
una línea); el refactor 3–7 avanza bajo paridad continua; las rutas y el SEO (8–10) construyen sobre
el refactor; contenido nuevo (11), pulido (12) y preparación de cutover (13) cierran.

---

#### Paso 1 — Arnés de tests reales + gates en verde

**Do**
Sustituir el test del starter por asserts del sitio real, y dejar en verde los tres gates
transversales (`pnpm test`, `pnpm lint`, `npx tsc --noEmit`) que hoy fallan (verificado 2026-08-30).
El test viejo está roto (verificado: 2 fallos por el esqueleto "Your site is taking shape" y
`app/_sites-preview/` inexistente).

- **Editar** `app/page.tsx` — fix mínimo y acotado, **autorizado por esta ronda** (decisión 13,
  §20.3): `pnpm lint` falla HOY con `react-hooks/set-state-in-effect` en la línea 130 — el efecto de
  restauración de idioma (líneas ~123–148) llama `setLanguage`/`setMarket` de forma síncrona en el
  cuerpo del `useEffect`. Reestructurar **solo ese efecto** al patrón que la regla acepta (sin
  setState síncrono en el cuerpo del efecto; las llamadas dentro del `.then`/`.catch` del fetch ya
  son aceptadas), sin tocar claves de `localStorage`, el contrato de `/api/locale` ni ningún string
  renderizado. Prohibido resolverlo con `eslint-disable` o bajando la severidad de la regla. La
  paridad la prueba `pnpm test` en este mismo paso; el efecto entero desaparece en el paso 7 — este
  fix solo existe para que el gate de lint nazca en verde.
- Instalar los tipos de Workers (alta de devDependency; pin y procedencia en §11):
  `pnpm add -D @cloudflare/workers-types@5.20260830.1` — `npx tsc --noEmit` sale 2 HOY por
  `worker/index.ts` y `db/index.ts` (tipos `Fetcher`/`ImagesBinding`/`D1Database` sin declarar).
- **Editar** `tsconfig.json` — única edición del archivo en toda la ronda (autorizada aquí; el resto
  del archivo sigue intacto): añadir a `compilerOptions` el array
  `"types": ["node", "react", "react-dom", "@cloudflare/workers-types"]`. Nota: declarar `"types"`
  desactiva la auto-inclusión de `@types/*`, por eso se listan explícitos los tres `@types` que el
  repo ya usa además del nuevo.
- **Eliminar** `tests/rendered-html.test.mjs`.
- **Crear** `tests/site.test.mjs` con este contenido (los strings esperados fueron verificados
  2026-08-30 contra el HTML que el worker compilado emite hoy — no son predicciones):

```js
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);

const env = { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };

async function fetchPath(path, headers = {}) {
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html", ...headers } }),
    env,
    ctx,
  );
}

test("/ renderiza el sitio real en español", async () => {
  const response = await fetchPath("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/i);
  const html = await response.text();
  assert.match(html, /<html lang="es"/);
  assert.ok(html.includes("Páginas web que"), "falta la primera línea del h1");
  assert.ok(html.includes("mueven negocios."), "falta la segunda línea del h1");
  assert.ok(html.includes("$300"), "falta el precio USD");
  assert.ok(html.includes("https://wa.me/19569511763"), "falta el link de WhatsApp");
  assert.ok(html.includes("ethernaldevops@gmail.com"), "falta el email");
});

test("los cinco proyectos del portafolio están enlazados", async () => {
  const html = await (await fetchPath("/")).text();
  const urls = [
    "https://costagrillmx.com/",
    "https://vsr444.com/",
    "https://beckcentrodebelleza.com/",
    "https://excessivedetailing.com/",
    "https://ciaokitchenmx.com/",
  ];
  for (const url of urls) assert.ok(html.includes(url), `falta ${url}`);
});

test("/api/locale conserva su contrato JSON", async () => {
  const response = await fetchPath("/api/locale");
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  const data = await response.json();
  for (const key of ["city", "country", "language", "region"]) {
    assert.ok(key in data, `falta la clave ${key}`);
  }
  assert.ok(["es", "en"].includes(data.language));
  const us = await (await fetchPath("/api/locale", { "cf-ipcountry": "US" })).json();
  assert.equal(us.language, "en");
  const mx = await (await fetchPath("/api/locale", { "cf-ipcountry": "MX" })).json();
  assert.equal(mx.language, "es");
});

test("el precio MXN vive en el código fuente", async () => {
  // Lee app/content/site.ts cuando exista (paso 3); antes, app/page.tsx.
  let source = "";
  try {
    source = await readFile(new URL("../app/content/site.ts", import.meta.url), "utf8");
  } catch {
    source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  }
  assert.ok(source.includes("$5,900"), "falta el precio MXN en la fuente");
});
```

- **Editar** `package.json`: `"test": "npm run build && node --test tests/site.test.mjs"` (solo
  cambia el nombre del archivo; la forma del comando se conserva).

**Done when**
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 with 0 failed and 0 skipped tests.
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL return 200 `text/html` containing
      `<html lang="es"`, `mueven negocios.`, `$300`, `https://wa.me/19569511763` and
      `ethernaldevops@gmail.com`.
- [ ] WHEN the compiled worker serves `GET /api/locale` with header `cf-ipcountry: US` THE SYSTEM
      SHALL return JSON with `language` equal to `"en"`, and with `cf-ipcountry: MX` equal to `"es"`.
- [ ] WHEN the test file list is read THE SYSTEM SHALL contain `tests/site.test.mjs` and not
      `tests/rendered-html.test.mjs`.
- [ ] WHEN `pnpm lint` runs THE SYSTEM SHALL exit 0 with zero errors and zero warnings, and
      `app/page.tsx` SHALL contain no `eslint-disable` for `react-hooks/set-state-in-effect`.
- [ ] WHEN `npx tsc --noEmit` runs THE SYSTEM SHALL exit 0, with `@cloudflare/workers-types` listed
      in both `package.json` `devDependencies` and the `types` array of `tsconfig.json`.

**Verify**
```bash
test -f tests/site.test.mjs                      # expect: exit 0
test ! -e tests/rendered-html.test.mjs           # expect: exit 0 (el viejo ya no existe)
grep -q 'tests/site.test.mjs' package.json       # expect: exit 0
grep -q '@cloudflare/workers-types' package.json # expect: exit 0
grep -q '@cloudflare/workers-types' tsconfig.json # expect: exit 0
test "$(grep -c 'eslint-disable' app/page.tsx)" = 0   # expect: exit 0 — el fix es real, no supresión
pnpm test                                        # expect: exit 0, "fail 0", "skipped 0"
pnpm lint                                        # expect: exit 0
npx tsc --noEmit                                 # expect: exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 1: arnes de tests reales del sitio"
git tag step-01-arnes
```

---

#### Paso 2 — Deploy propio: `wrangler.jsonc` + `@vinext/cloudflare`

**Do**
- Instalar la única dependencia nueva de la ronda (pin exacto, §11):
  `pnpm add -D @vinext/cloudflare@1.0.0-beta.6`
- **Editar** `package.json`: añadir el script `"deploy": "vinext-cloudflare deploy"` — si el paquete
  no expone ese bin, usar la forma equivalente `"deploy": "npx @vinext/cloudflare deploy"` (las
  opciones verificadas del comando son `--preview`, `--env`, `--name`, `--skip-build`, `--dry-run`).
- **Crear** `wrangler.jsonc` en la raíz. Los valores replican lo que el build de vinext ya genera en
  `dist/server/wrangler.json` (verificado 2026-08-30), más el nombre propio y los bindings que
  `worker/index.ts` espera (`ASSETS`, `IMAGES`):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "ethrovs",
  "main": "dist/server/index.js",
  "compatibility_date": "2026-05-15",
  "compatibility_flags": ["nodejs_compat"],
  "assets": { "directory": "dist/client", "binding": "ASSETS" },
  "images": { "binding": "IMAGES" },
  "observability": { "enabled": true }
}
```

  No se declara binding D1 (`.openai/hosting.json` trae `d1: null` y el worker no lo usa). El deploy
  real a la cuenta requiere `wrangler login` — eso es humano y vive en el launch checklist
  (`docs/cutover/launch-checklist.md`, paso 13), **no aquí**.

  El paquete se sondea **sin invocar `deploy`** (todo `* deploy` está deny-listado en §19.3 a
  propósito): versión instalada vía su `package.json` y existencia del bin en `node_modules/.bin`.

**Done when**
- [ ] WHEN `package.json` is read THE SYSTEM SHALL list `@vinext/cloudflare` at `1.0.0-beta.6` in
      `devDependencies` and a `deploy` script.
- [ ] WHEN `node -e "console.log(require('@vinext/cloudflare/package.json').version)"` runs THE
      SYSTEM SHALL exit 0 and print `1.0.0-beta.6`, and the file
      `node_modules/.bin/vinext-cloudflare` SHALL exist — probing the installed package without
      invoking any deploy command.
- [ ] WHEN `pnpm build` runs THE SYSTEM SHALL exit 0 and produce `dist/server/index.js` and
      `dist/client/` — the exact paths `wrangler.jsonc` names.
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL still exit 0 (gate del paso 1 intacto).

**Verify**
```bash
node -e "const p=require('./package.json');process.exit(p.devDependencies['@vinext/cloudflare']==='1.0.0-beta.6'&&p.scripts.deploy?0:1)"   # expect: exit 0
node -e "console.log(require('@vinext/cloudflare/package.json').version)" | grep -qx '1.0.0-beta.6'   # expect: exit 0 — sondeo sin invocar deploy
test -e node_modules/.bin/vinext-cloudflare      # expect: exit 0 — el bin instalado existe (si este check falla, usar la forma npx del script deploy, ver Do)
pnpm build                                       # expect: exit 0
test -f dist/server/index.js && test -d dist/client   # expect: exit 0 — mismos paths que wrangler.jsonc
node -e "JSON.parse(require('fs').readFileSync('wrangler.jsonc','utf8').replace(/\\/\\/.*$/gm,''))"  # expect: exit 0 — JSONC parseable
pnpm test                                        # expect: exit 0, fail 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 2: wrangler.jsonc + @vinext/cloudflare + script deploy"
git tag step-02-deploy-propio
git check-ignore -q wrangler.jsonc; test $? -eq 1   # expect: exit 0 — 1 = no lo tapa .gitignore
```

---

#### Paso 3 — Contenido a `app/content/`

**Do**
Extraer datos y copy de `app/page.tsx` **byte-idénticos** (la paridad de esta ronda es por strings;
un acento cambiado rompe el gate):

- **Crear** `app/content/site.ts`: tipos `Language`, `Market`, `ProjectKey`; `pricingByMarket`
  (con `$300`/`$5,900` y los extras `+$20/+$30/+$35/+$25` y `+$390/+$590/+$690/+$490`); `projects`
  (los 5, con `name`, `href`, `image` — la var CSS —, `alt`, `category`); `deckOrder`; `workOrder`;
  y las constantes de contacto: `whatsappBookUrl`, `whatsappContactUrl` (las dos URLs `wa.me`
  actuales con su `?text=…` exacto) y `contactEmail` (`ethernaldevops@gmail.com`). Exportar una
  interfaz `Copy` que describa la forma del objeto de copy (nav, hero, work, services, process,
  pricing, faq, contact, footer — campos `string`, arrays y tuplas como en el objeto actual).
- **Crear** `app/content/es.ts`: `export const es: Copy = { … }` — el bloque `copy.es` actual, tal
  cual.
- **Crear** `app/content/en.ts`: `export const en: Copy = { … }` — el bloque `copy.en` actual.
- **Editar** `app/page.tsx`: eliminar las definiciones locales e importar todo de `./content/…`
  (imports relativos, §3). Cero cambio de JSX en este paso.

**Done when**
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 — same rendered strings as before the change.
- [ ] WHEN `app/page.tsx` is read THE SYSTEM SHALL contain neither `pricingByMarket` nor a local
      `copy` object definition, and SHALL import from `./content/`.
- [ ] WHEN `app/content/site.ts` is read THE SYSTEM SHALL contain `$5,900` and
      `wa.me/19569511763` (el test del paso 1 pasa a leer este archivo por su rama `try`).
- [ ] WHEN `npx tsc --noEmit` runs THE SYSTEM SHALL exit 0.

**Verify**
```bash
test -f app/content/site.ts && test -f app/content/es.ts && test -f app/content/en.ts  # expect: exit 0
grep -q "from \"./content/" app/page.tsx          # expect: exit 0
test "$(grep -c 'pricingByMarket = {' app/page.tsx)" = 0   # expect: exit 0 — ya no se define ahí
grep -q '\$5,900' app/content/site.ts             # expect: exit 0
npx tsc --noEmit                                  # expect: exit 0
pnpm lint                                         # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0 — paridad intacta
```

**Checkpoint**
```bash
git add -A && git commit -m "step 3: copy y datos a app/content"
git tag step-03-contenido
```

---

#### Paso 4 — Componentes I: Nav, Hero, Footer

**Do**
- **Crear** `app/components/Nav.tsx`, `app/components/Hero.tsx`, `app/components/Footer.tsx`
  moviendo el JSX correspondiente de `app/page.tsx` **sin alterar clases, atributos ni textos**.
  Props: `Nav` recibe `c` (copy) y —por ahora— `language` + `chooseLanguage` (el toggle sigue siendo
  botones hasta el paso 7); `Hero` recibe `c`, `pricing` y las props del deck (`activeProject`,
  `setActiveProject`, `deckPaused` setters); `Footer` recibe `c`.
- **Editar** `app/page.tsx` para componer con ellos. El estado sigue viviendo en `page.tsx`.

**Done when**
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 — the rendered HTML still contains every parity
      string from step 1.
- [ ] WHEN `app/components/` is listed THE SYSTEM SHALL contain `Nav.tsx`, `Hero.tsx`, `Footer.tsx`.
- [ ] WHEN `npx tsc --noEmit` and `pnpm lint` run THE SYSTEM SHALL exit 0.

**Verify**
```bash
test -f app/components/Nav.tsx && test -f app/components/Hero.tsx && test -f app/components/Footer.tsx  # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 4: componentes Nav, Hero, Footer"
git tag step-04-componentes-i
```

---

#### Paso 5 — Componentes II: Work, Services, Process

**Do**
- **Crear** `app/components/Work.tsx`, `app/components/Services.tsx`, `app/components/Process.tsx`
  (mismas reglas: JSX movido tal cual; `Work` recibe `c` y `language` para las categorías).
- **Editar** `app/page.tsx` para usarlos.

**Done when**
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 — the five portfolio URLs still render.
- [ ] WHEN `npx tsc --noEmit` and `pnpm lint` run THE SYSTEM SHALL exit 0.

**Verify**
```bash
test -f app/components/Work.tsx && test -f app/components/Services.tsx && test -f app/components/Process.tsx  # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 5: componentes Work, Services, Process"
git tag step-05-componentes-ii
```

---

#### Paso 6 — Componentes III: Pricing, Faq, Contact + HomePage

**Do**
- **Crear** `app/components/Pricing.tsx` (`c`, `pricing`, `market`, `setMarket`),
  `app/components/Faq.tsx` (`c`), `app/components/Contact.tsx` (`c`; usa `whatsappContactUrl` y
  `contactEmail` de `site.ts`).
- **Crear** `app/components/HomePage.tsx` (`"use client"`): mover ahí TODO el estado y los efectos
  que quedan en `page.tsx` (language, market, deck, localStorage, fetch a `/api/locale`) y la
  composición completa Nav→Footer.
- **Editar** `app/page.tsx` a la forma mínima: `export default function Page() { return <HomePage />; }`
  (sin `"use client"`; page pasa a ser server component).

**Done when**
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 — full parity via the harness.
- [ ] WHEN `app/page.tsx` is read THE SYSTEM SHALL be under 10 lines and contain no `useState`.
- [ ] WHEN `npx tsc --noEmit` and `pnpm lint` run THE SYSTEM SHALL exit 0.

**Verify**
```bash
test -f app/components/Pricing.tsx && test -f app/components/Faq.tsx && test -f app/components/Contact.tsx && test -f app/components/HomePage.tsx  # expect: exit 0
test "$(grep -c useState app/page.tsx)" = 0       # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 6: componentes Pricing, Faq, Contact + HomePage"
git tag step-06-componentes-iii
```

---

#### Paso 7 — HomePage por locale + toggle a links

**Do**
El idioma deja de ser estado de cliente y pasa a ser un prop (preparación de las rutas del paso 8):

- **Editar** `app/components/HomePage.tsx`: recibir `locale: "es" | "en"`; `const c = locale === "es"
  ? es : en;`. **Eliminar** el estado `language`, el efecto que escribía
  `ethrovs-language`/`ethrovs-language-manual`, el efecto `document.documentElement.lang` y el
  `fetch("/api/locale")` que fijaba idioma (la geodetección vuelve como *sugerencia* en el paso 9).
  El estado `market` y el deck no se tocan.
- **Editar** `app/components/Nav.tsx`: el toggle pasa de `<button>` a dos links —
  `<a href="/" aria-current={locale === "es" ? "true" : undefined}>ES</a>` y
  `<a href="/en" aria-current={locale === "en" ? "true" : undefined}>EN</a>` — conservando el
  contenedor `.lang` y su estilo (la clase de estado activo pasa de `[aria-pressed="true"]` a
  `[aria-current="true"]`: añade el selector gemelo en la regla `.lang` existente de `globals.css`
  **sin** eliminar el selector viejo). `/en` resuelve en el paso 8; este paso no lo navega.
- **Editar** `app/page.tsx`: `return <HomePage locale="es" />;`.

**Done when**
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL render the Spanish site with an
      anchor `href="/en"` in the nav and zero `aria-pressed` language buttons.
- [ ] WHEN `app/components/HomePage.tsx` is read THE SYSTEM SHALL contain no reference to
      `ethrovs-language` and no `fetch("/api/locale")`.
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 — every step-1 parity string still renders.

**Verify**
```bash
test "$(grep -c 'ethrovs-language' app/components/HomePage.tsx)" = 0   # expect: exit 0
test "$(grep -c 'api/locale' app/components/HomePage.tsx)" = 0         # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0
node --input-type=module -e '
const u = new URL("./dist/server/index.js?v=" + Date.now(), "file://" + process.cwd() + "/").href;
const { default: w } = await import(u);
const r = await w.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }),
  { ASSETS: { fetch: async () => new Response("", { status: 404 }) } },
  { waitUntil() {}, passThroughOnException() {} });
const h = await r.text();
if (!h.includes("href=\"/en\"")) { console.error("falta el link /en"); process.exit(1); }
console.log("OK toggle por links");'              # expect: OK toggle por links, exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 7: HomePage por locale y toggle por links"
git tag step-07-locale-prop
```

---

#### Paso 8 — Rutas de idioma `/` y `/en`

**Do**
Route groups con dos root layouts (patrón estándar del App Router para `<html lang>` por ruta):

- **Crear** `app/(es)/layout.tsx`: el contenido del `app/layout.tsx` actual (mismo `metadata`
  export, mismo `<html lang="es">`, mismo import de `../globals.css`).
- **Crear** `app/(es)/page.tsx`: `export default function Page() { return <HomePage locale="es" />; }`.
- **Crear** `app/(en)/layout.tsx`: copia del anterior con `<html lang="en">` (la metadata se
  localiza en el paso 10; por ahora la misma).
- **Crear** `app/(en)/en/page.tsx`: `return <HomePage locale="en" />;`.
- **Eliminar** `app/layout.tsx` y `app/page.tsx` (sustituidos; con dos root layouts no puede existir
  un layout raíz suelto).
- **Editar** `tests/site.test.mjs`: añadir el test de `/en` —

```js
test("/en renderiza el sitio real en inglés", async () => {
  const response = await fetchPath("/en");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<html lang="en"/);
  assert.ok(html.includes("Websites that"), "falta la primera línea del h1 EN");
  assert.ok(html.includes("move businesses."), "falta la segunda línea del h1 EN");
  assert.ok(html.includes("$300"));
  assert.ok(html.includes("https://wa.me/19569511763"));
});
```

  Riesgo conocido: si vinext beta no soporta múltiples root layouts en route groups, este paso se
  bloquea — **detente y aplica el fallback de §20.2 (fila 3)**; no inventes un tercer mecanismo.

**Done when**
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL return 200 with `<html lang="es"` and
      the Spanish h1.
- [ ] WHEN the compiled worker serves `GET /en` THE SYSTEM SHALL return 200 with `<html lang="en"`,
      `Websites that` and `move businesses.`.
- [ ] WHEN `app/` is listed THE SYSTEM SHALL contain neither a root `layout.tsx` nor a root
      `page.tsx` outside the route groups.
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0 with the new `/en` test included, 0 failed.

**Verify**
```bash
test -f "app/(es)/layout.tsx" && test -f "app/(es)/page.tsx" && test -f "app/(en)/layout.tsx" && test -f "app/(en)/en/page.tsx"  # expect: exit 0
test ! -e app/layout.tsx && test ! -e app/page.tsx   # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0 — incluye "/en renderiza el sitio real en inglés"
```

**Checkpoint**
```bash
git add -A && git commit -m "step 8: rutas de idioma / y /en con route groups"
git tag step-08-rutas-idioma
```

---

#### Paso 9 — Banner de sugerencia de idioma

**Do**
La geodetección existente vuelve, pero solo como sugerencia (nunca redirect — Non-Goal §1):

- **Crear** `app/components/LocaleSuggestion.tsx` (`"use client"`), prop `locale`:
  - En mount: si `localStorage["ethrovs-lang-hint-dismissed"] === "1"` (lectura en `try/catch`), no
    hace nada. Si no, `fetch("/api/locale")`; si `data.language` es válido y **distinto** de
    `locale`, muestra el banner; en cualquier error o coincidencia, no renderiza nada.
  - Banner: `<div className="lang-hint" role="status">` con el texto en el idioma *sugerido* —
    en `/`: `This site is also available in English.` + link `View in English →` a `/en`;
    en `/en`: `Este sitio también está disponible en español.` + link `Ver en español →` a `/`;
    más un botón de cierre `✕` con `aria-label` (`"Dismiss"` / `"Cerrar"`) que guarda la clave de
    descarte (en `try/catch`) y oculta el banner. Los strings viven en este componente (cada página
    invita en el *otro* idioma; no pertenecen a `es.ts`/`en.ts`).
  - Prohibido en el componente: `location.replace`, `location.href =`, `router.push` automático —
    la única navegación es el click del usuario en el link.
- **Editar** `app/components/HomePage.tsx`: renderizar `<LocaleSuggestion locale={locale} />` justo
  después de `<Nav …/>`.
- **Editar** `app/globals.css` — única adición de CSS de la ronda, con tokens existentes:

```css
.lang-hint { display: flex; align-items: center; justify-content: center; gap: 14px; padding: 9px var(--gutter); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em; color: var(--muted); background: var(--surface); border-bottom: 1px solid var(--line-soft); }
.lang-hint a { color: var(--blue); font-weight: 700; }
.lang-hint button { color: var(--muted); padding: 2px 6px; }
```

**Done when**
- [ ] WHEN `app/components/LocaleSuggestion.tsx` is read THE SYSTEM SHALL contain
      `fetch("/api/locale")` and zero occurrences of `location.replace`, `location.href` or
      `router.push`.
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL render identical parity strings
      (banner renders nothing server-side; el gate del paso 1 sigue verde).
- [ ] WHEN `pnpm test`, `npx tsc --noEmit` and `pnpm lint` run THE SYSTEM SHALL exit 0.

**Verify**
```bash
grep -q 'fetch("/api/locale")' app/components/LocaleSuggestion.tsx    # expect: exit 0
test "$(grep -cE 'location\.replace|location\.href|router\.push' app/components/LocaleSuggestion.tsx)" = 0  # expect: exit 0
grep -q 'lang-hint' app/globals.css               # expect: exit 0
grep -q 'ethrovs-lang-hint-dismissed' app/components/LocaleSuggestion.tsx  # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 9: banner de sugerencia de idioma sin redirect"
git tag step-09-banner-idioma
```

---

#### Paso 10 — Metadata localizada + hreflang + sitemap + JSON-LD

**Do**
- **Editar** `app/(es)/layout.tsx` — `metadata` ES completo:
  - `title: "ETHROVS — Diseño de páginas web en Laredo y Nuevo Laredo"`
  - `description: "Diseño de páginas web para negocios en Laredo, TX y Nuevo Laredo. Website Express: tu sitio profesional en 24 horas, desde $300 USD o $5,900 MXN."`
  - `alternates: { canonical: "https://ethrovs.com/", languages: { es: "https://ethrovs.com/", en: "https://ethrovs.com/en", "x-default": "https://ethrovs.com/" } }`
  - `openGraph`: título y descripción ES, `locale: "es_MX"`, misma imagen `/og.png` (1536×1024) y
    `type: "website"`; `twitter` igual con textos ES. `metadataBase` e `icons` se conservan tal cual.
  - En el `<body>`, antes de `{children}`, el JSON-LD ES:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: "ETHROVS",
    url: "https://ethrovs.com/",
    image: "https://ethrovs.com/og.png",
    description: "Diseño de páginas web para negocios en Laredo, TX y Nuevo Laredo. Website Express: tu sitio profesional en 24 horas.",
    email: "ethernaldevops@gmail.com",
    telephone: "+1-956-951-1763",
    priceRange: "desde $300 USD / $5,900 MXN",
    areaServed: [
      { "@type": "City", name: "Laredo", address: { "@type": "PostalAddress", addressRegion: "TX", addressCountry: "US" } },
      { "@type": "City", name: "Nuevo Laredo", address: { "@type": "PostalAddress", addressRegion: "Tamaulipas", addressCountry: "MX" } },
    ],
    contactPoint: { "@type": "ContactPoint", contactType: "sales", telephone: "+1-956-951-1763", email: "ethernaldevops@gmail.com", availableLanguage: ["es", "en"] },
  }) }}
/>
```

  (Teléfono y email son los reales del repo: `wa.me/19569511763` y `ethernaldevops@gmail.com`.)
- **Editar** `app/(en)/layout.tsx` — lo mismo en EN:
  - `title: "ETHROVS — Website Design in Laredo, TX & Nuevo Laredo"`
  - `description: "Website design for businesses in Laredo, TX and Nuevo Laredo. Website Express: your professional site in 24 hours, from $300 USD or $5,900 MXN."`
  - `alternates.canonical: "https://ethrovs.com/en"`, mismas `languages`; OG/twitter EN,
    `locale: "en_US"`; JSON-LD con `url: "https://ethrovs.com/en"` y descripción EN.
- **Crear** `public/sitemap.xml` (estático — dos URLs que no cambian; sin depender de features beta):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://ethrovs.com/</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://ethrovs.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://ethrovs.com/en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://ethrovs.com/"/>
  </url>
  <url>
    <loc>https://ethrovs.com/en</loc>
    <xhtml:link rel="alternate" hreflang="es" href="https://ethrovs.com/"/>
    <xhtml:link rel="alternate" hreflang="en" href="https://ethrovs.com/en"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://ethrovs.com/"/>
  </url>
</urlset>
```

- **Editar** `tests/site.test.mjs` — añadir:

```js
test("metadata localizada y hreflang por ruta", async () => {
  const es = await (await fetchPath("/")).text();
  const en = await (await fetchPath("/en")).text();
  assert.ok(es.includes("Diseño de páginas web en Laredo y Nuevo Laredo"), "falta el título ES");
  assert.ok(en.includes("Website Design in Laredo"), "falta el título EN (evitar '&' escapado)");
  for (const html of [es, en]) {
    assert.ok(html.includes('hreflang="es"'));
    assert.ok(html.includes('hreflang="en"'));
    assert.ok(html.includes('hreflang="x-default"'));
  }
});

test("JSON-LD ProfessionalService parseable en ambas rutas", async () => {
  for (const path of ["/", "/en"]) {
    const html = await (await fetchPath(path)).text();
    const match = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s);
    assert.ok(match, `falta el bloque JSON-LD en ${path}`);
    const data = JSON.parse(match[1]);
    assert.equal(data["@type"], "ProfessionalService");
    assert.equal(data.email, "ethernaldevops@gmail.com");
    assert.equal(data.telephone, "+1-956-951-1763");
  }
});

test("sitemap.xml lista ambas URLs", async () => {
  const xml = await readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8");
  assert.ok(xml.includes("<loc>https://ethrovs.com/</loc>"));
  assert.ok(xml.includes("<loc>https://ethrovs.com/en</loc>"));
  assert.ok(xml.includes('hreflang="x-default"'));
});
```

  (El arnés stubea `ASSETS` con 404, así que el 200 del sitemap servido se prueba contra el deploy
  real con `scripts/parity.sh` — paso 13 y launch checklist; aquí se prueba el archivo.)

**Done when**
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL include the ES title, ES description,
      and the three hreflang alternates.
- [ ] WHEN the compiled worker serves `GET /en` THE SYSTEM SHALL include the EN title and the same
      three hreflang alternates.
- [ ] WHEN the JSON-LD block of either route is extracted THE SYSTEM SHALL parse as JSON with
      `@type` `ProfessionalService`, the real telephone and the real email.
- [ ] WHEN `public/sitemap.xml` is read THE SYSTEM SHALL contain `<loc>` entries for exactly the two
      routes of §6.
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0, 0 failed.

**Verify**
```bash
test -f public/sitemap.xml                        # expect: exit 0
grep -q '<loc>https://ethrovs.com/en</loc>' public/sitemap.xml   # expect: exit 0
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0 — incluye metadata, JSON-LD y sitemap
```

**Checkpoint**
```bash
git add -A && git commit -m "step 10: metadata localizada, hreflang, sitemap y JSON-LD"
git tag step-10-seo
git check-ignore -q public/sitemap.xml; test $? -eq 1   # expect: exit 0 — no lo tapa .gitignore
```

---

#### Paso 11 — Testimonios + fila de credibilidad en el hero

**Do**
Primera adición visible (fuera del "cero cambio visual" del refactor, que terminó en el paso 8).
Todo con clases y tokens existentes de §7 — **cero CSS nuevo en este paso**:

- **Editar** `app/content/es.ts` y `app/content/en.ts`: añadir al objeto de copy
  - `hero.credibility`: ES `"5 sitios en vivo · entrega 24 h · 2 países"`, EN
    `"5 live sites · 24 h delivery · 2 countries"`.
  - `testimonials`: `label` (ES `"Lo que dicen"` / EN `"What they say"`), `title` (ES
    `"Clientes que ya están en vivo."` / EN `"Clients already live."`) y `items`: 3 entradas
    `{ quote, name, business }` con quotes placeholder **claramente marcados**:
    `"TODO(daniel): frase real del cliente"` y `name`/`business` de tres clientes reales del
    portafolio (Costa Grill, BECK, Excessive Detailing). Ampliar la interfaz `Copy` en `site.ts`.
- **Crear** `app/components/Testimonials.tsx`: `<section className="sec wrap" id="testimonios">`
  con `.sec-head` (h2 = title, `.label` = label) y un grid `.svc` de tres `<article>`, cada uno con
  `<blockquote className="serif">` (la cita), y un `<p className="label">` con `name · business`.
  Sin estilos nuevos: `.svc article` ya da el borde superior y el ritmo del sistema.
- **Editar** `app/components/Hero.tsx`: bajo `.hero-cta`, añadir
  `<p className="label">{c.hero.credibility}</p>`.
- **Editar** `app/components/HomePage.tsx`: renderizar `<Testimonials c={c} />` entre `Faq` y
  `Contact`.

**Done when**
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL render `id="testimonios"`, three
      `<blockquote>` elements, the marker `TODO(daniel)` and the string
      `5 sitios en vivo · entrega 24 h · 2 países`.
- [ ] WHEN the compiled worker serves `GET /en` THE SYSTEM SHALL render
      `5 live sites · 24 h delivery · 2 countries`.
- [ ] WHEN `git diff` for this step is inspected THE SYSTEM SHALL show zero changes to
      `app/globals.css` (adiciones solo con clases existentes).
- [ ] WHEN `pnpm test`, `npx tsc --noEmit` and `pnpm lint` run THE SYSTEM SHALL exit 0.

**Verify**
```bash
npx tsc --noEmit && pnpm lint                     # expect: exit 0
pnpm test                                         # expect: exit 0, fail 0 — regresión de paridad
node --input-type=module -e '
const u = new URL("./dist/server/index.js?v=" + Date.now(), "file://" + process.cwd() + "/").href;
const { default: w } = await import(u);
const env = { ASSETS: { fetch: async () => new Response("", { status: 404 }) } };
const ctx = { waitUntil() {}, passThroughOnException() {} };
const es = await (await w.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), env, ctx)).text();
const en = await (await w.fetch(new Request("http://localhost/en", { headers: { accept: "text/html" } }), env, ctx)).text();
const need = [[es, "id=\"testimonios\""], [es, "TODO(daniel)"], [es, "5 sitios en vivo · entrega 24 h · 2 países"], [en, "5 live sites · 24 h delivery · 2 countries"]];
for (const [h, s] of need) if (!h.includes(s)) { console.error("FALTA: " + s); process.exit(1); }
if ((es.match(/<blockquote/g) ?? []).length !== 3) { console.error("no hay 3 blockquotes"); process.exit(1); }
console.log("OK testimonios y credibilidad");'    # expect: OK testimonios y credibilidad, exit 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 11: testimonios placeholder y fila de credibilidad"
git tag step-11-testimonios
```

---

#### Paso 12 — Pulido observable: imágenes lazy

**Do**
El repo ya trae `:focus-visible` global y `prefers-reduced-motion` (CSS y deck JS) — verificado en
§1; lo que falta de la lista aprobada es el lazy-loading real de las imágenes bajo el fold:

- **Editar** `app/components/Work.tsx`: en cada `.case-shot`, sustituir el `<div className="img"
  style={{ backgroundImage }} role="img" aria-label>` por
  `<img className="img" src={…} alt={project.alt} loading="lazy" decoding="async"
  style={{ objectFit: "cover", objectPosition: "top center", width: "100%", height: "100%" }} />`.
  Los `src` son los archivos reales detrás de las vars CSS (de `globals.css`):
  `/assets/shots/costa-grill.jpg`, `/assets/shots/vsr444.jpg`, `/assets/shots/beck.jpg`,
  `/assets/shots/excessive.jpg`, `/assets/ciao-kitchen.png` — añadirlos como campo `src` de cada
  proyecto en `app/content/site.ts`. El deck del hero (above the fold) queda como está.
- **Editar** `tests/site.test.mjs` — asserts permanentes de los pasos 11 y 12:

```js
test("testimonios, credibilidad e imágenes lazy", async () => {
  const es = await (await fetchPath("/")).text();
  assert.ok(es.includes('id="testimonios"'));
  assert.equal((es.match(/<blockquote/g) ?? []).length, 3); // una por testimonio (3 en §9 paso 11)
  assert.ok(es.includes("5 sitios en vivo · entrega 24 h · 2 países"));
  assert.equal((es.match(/loading="lazy"/g) ?? []).length, 5); // una por proyecto del portafolio (5 en §1)
});
```

  (El conteo de 5 se aserta en el **HTML** renderizado — el `map` sobre los 5 proyectos emite 5
  `<img>` desde una sola ocurrencia de `loading="lazy"` en la fuente de `Work.tsx`.)

**Done when**
- [ ] WHEN the compiled worker serves `GET /` THE SYSTEM SHALL contain exactly 5 occurrences of
      `loading="lazy"` — one per portfolio project — and each `<img>` SHALL carry a non-empty `alt`.
- [ ] WHEN `app/content/site.ts` is read THE SYSTEM SHALL define a `src` field per project pointing
      at the five real asset paths listed in the Do.
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL exit 0, 0 failed, 0 skipped.

**Verify**
```bash
grep -q 'assets/shots/costa-grill.jpg' app/content/site.ts   # expect: exit 0 — src reales en contenido
npx tsc --noEmit && pnpm lint                      # expect: exit 0
pnpm test                                          # expect: exit 0, fail 0, skipped 0 — incluye el assert de 5 loading="lazy" en el HTML
```

**Checkpoint**
```bash
git add -A && git commit -m "step 12: imagenes lazy del portafolio"
git tag step-12-pulido
```

---

#### Paso 13 — Preparación de cutover

**Do**
Los artefactos que el launch checklist humano ejecuta (§9.1) — ninguno toca el código de la app:

- **Crear** `scripts/parity.sh` — el arnés de paridad de §9.1 (contenido completo en §9.1, *Parity
  harness*; es el mismo bloque, copiado tal cual).
- **Crear** `docs/cutover/dns-before.txt` ejecutando la captura (kill criteria de §9.1 dependen de
  este archivo):

```bash
mkdir -p docs/cutover
{ echo "# ethrovs.com — DNS antes del cutover — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "## A";        dig +short ethrovs.com A
  echo "## AAAA";     dig +short ethrovs.com AAAA
  echo "## CNAME www"; dig +short www.ethrovs.com CNAME
  echo "## NS";       dig +short ethrovs.com NS
} > docs/cutover/dns-before.txt
```

- **Crear** `docs/cutover/launch-checklist.md` con exactamente la secuencia humana de §9.1
  (*Cutover* + los pasos con auth): wrangler login → `pnpm deploy` → parity contra workers.dev →
  verificación del binding IMAGES (fallback §20.2) → bajar TTL → dominio custom / cambio DNS →
  parity contra ethrovs.com → enviar sitemap en Search Console → vigilancia 48 h con kill criteria →
  DECOM-1/DECOM-2 tras 7 días estables. Cada punto con su comando y su resultado esperado.

**Done when**
- [ ] WHEN `scripts/parity.sh` is syntax-checked THE SYSTEM SHALL exit 0.
- [ ] WHEN `docs/cutover/dns-before.txt` is read THE SYSTEM SHALL be non-empty and contain the
      section headers `## A` and `## NS`.
- [ ] WHEN `docs/cutover/launch-checklist.md` is read THE SYSTEM SHALL be non-empty.
- [ ] WHEN `pnpm test` runs THE SYSTEM SHALL still exit 0, 0 failed, 0 skipped (este paso no toca la
      app).

**Verify**
```bash
bash -n scripts/parity.sh                          # expect: exit 0
test -s docs/cutover/dns-before.txt && grep -q '## A' docs/cutover/dns-before.txt && grep -q '## NS' docs/cutover/dns-before.txt  # expect: exit 0
test -s docs/cutover/launch-checklist.md           # expect: exit 0
pnpm test                                          # expect: exit 0, fail 0, skipped 0
```

**Checkpoint**
```bash
git add -A && git commit -m "step 13: arnes de paridad y preparacion de cutover"
git tag step-13-cutover-prep
git check-ignore -q scripts/parity.sh; test $? -eq 1            # expect: exit 0
git check-ignore -q docs/cutover/dns-before.txt; test $? -eq 1  # expect: exit 0
```

---

### 9.1 Parity and cutover

**Aplica: esta ronda ES una migración de hosting** (del hosting de ChatGPT/OpenAI al Worker propio).
Nota de marco: la paridad se mide contra **el repo** (fuente de verdad), no contra la producción
vieja — que está desactualizada a propósito de esta migración (muestra $200; el repo dice $300). El
único delta conocido repo↔prod-vieja es ese precio, y es deseado.

#### Parity set (1/6 — checklist de paridad)

| # | Comportamiento constante | Cómo se prueba | Tolerancia |
|---|---|---|---|
| 1 | `/` en español: `<html lang="es">`, h1 `mueven negocios.` | `pnpm test` + `parity.sh` "ES home h1"/"ES lang" | exacta |
| 2 | `/en` en inglés: `<html lang="en">`, h1 `move businesses.` | `pnpm test` + `parity.sh` "EN home h1"/"EN lang" | exacta (ruta nueva — delta aprobado) |
| 3 | Precios `$300` (HTML) y `$5,900` (fuente/toggle) | `pnpm test` + `parity.sh` "precio USD" | exacta |
| 4 | 5 imágenes de portafolio servidas | `parity.sh` head_ok de los 5 assets | HTTP 200 cada una |
| 5 | Links WhatsApp `wa.me/19569511763` y email | `pnpm test` + `parity.sh` "WhatsApp"/"email" | exacta |
| 6 | `/api/locale` contrato JSON + `Cache-Control` | `pnpm test` + `parity.sh` "API locale" | exacta |
| 7 | favicon (`/assets/ethrovs-favicon.png`), `og.png`, `apple-touch-icon.png` | `parity.sh` head_ok | HTTP 200 |
| 8 | hreflang es/en/x-default en ambas rutas | `pnpm test` + `parity.sh` "hreflang" | exacta |
| 9 | `sitemap.xml` servido | `parity.sh` "sitemap" | HTTP 200 con ambas `<loc>` |

**Shadow period:** mínimo 48 h con el Worker en su URL `workers.dev` recibiendo tráfico de prueba
(el propio Daniel + parity script), mientras OpenAI hosting sigue sirviendo el 100% del tráfico real
de ethrovs.com. Paridad = `parity.sh` sale 0 en ≥3 corridas separadas por horas. Un fallo cualquiera
bloquea el cutover.

#### Parity harness (2/6)

El arnés es doble: `pnpm test` (contra el worker compilado, local) y `scripts/parity.sh` (contra un
deploy vivo). Contenido completo de `scripts/parity.sh` (el paso 13 lo crea tal cual):

```bash
#!/usr/bin/env bash
# Arnés de paridad ETHROVS — uso: BASE_URL=https://<worker>.workers.dev bash scripts/parity.sh
set -euo pipefail
: "${BASE_URL:?Define BASE_URL, p. ej. BASE_URL=https://ethrovs.<cuenta>.workers.dev}"
fail=0
check() { # check <desc> <url> <substring esperado>
  local desc="$1" url="$2" want="$3" body
  body=$(curl -fsSL --max-time 20 "$url") || { echo "FAIL $desc: $url no responde 2xx"; fail=1; return 0; }
  if grep -qF -- "$want" <<<"$body"; then echo "OK   $desc"; else echo "FAIL $desc: falta '$want'"; fail=1; fi
}
head_ok() { # head_ok <desc> <url> — espera HTTP 200
  local desc="$1" url="$2" code
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "$url")
  if [ "$code" = 200 ]; then echo "OK   $desc"; else echo "FAIL $desc: HTTP $code"; fail=1; fi
}
check "ES home h1"   "$BASE_URL/"           "mueven negocios."
check "ES lang"      "$BASE_URL/"           '<html lang="es"'
check "EN home h1"   "$BASE_URL/en"         "move businesses."
check "EN lang"      "$BASE_URL/en"         '<html lang="en"'
check "precio USD"   "$BASE_URL/"           '$300'
check "WhatsApp"     "$BASE_URL/"           "wa.me/19569511763"
check "email"        "$BASE_URL/"           "ethernaldevops@gmail.com"
check "hreflang"     "$BASE_URL/"           'hreflang="x-default"'
check "API locale"   "$BASE_URL/api/locale" '"language"'
check "sitemap"      "$BASE_URL/sitemap.xml" "<loc>https://ethrovs.com/en</loc>"
head_ok "favicon"          "$BASE_URL/assets/ethrovs-favicon.png"
head_ok "og.png"           "$BASE_URL/og.png"
head_ok "apple-touch-icon" "$BASE_URL/apple-touch-icon.png"
head_ok "shot costa"       "$BASE_URL/assets/shots/costa-grill.jpg"
head_ok "shot vsr"         "$BASE_URL/assets/shots/vsr444.jpg"
head_ok "shot beck"        "$BASE_URL/assets/shots/beck.jpg"
head_ok "shot excessive"   "$BASE_URL/assets/shots/excessive.jpg"
head_ok "shot ciao"        "$BASE_URL/assets/ciao-kitchen.png"
exit $fail
```

#### Coexistence (3/6)

Sin flags ni dual-write (no hay datos): la coexistencia es **dos deploys simultáneos del mismo
repo**. OpenAI hosting sigue detrás de ethrovs.com (DNS intacto) mientras el Worker nuevo vive en
`https://ethrovs.<cuenta>.workers.dev` y se prueba ahí. Nota registrada: un `git push` a GitHub
durante este periodo puede redesplegar el hosting viejo **con el precio nuevo** — no es un problema
(el $300 es el precio correcto), solo un efecto anotado.

#### Cutover sequence (4/6)

Todos los pasos con auth de Cloudflare o acción de consola son **humanos** y viven en
`docs/cutover/launch-checklist.md` (autorado en el paso 13) — NO son pasos de §9. La secuencia, con
su verificación script-decidable una vez ejecutada la acción humana:

| Fase | Qué cambia | Afecta a | Reversible con | Verify (tras la acción humana) |
|---|---|---|---|---|
| 1. Login | `npx wrangler login` (humano) | nadie | n/a | `npx wrangler whoami` → exit 0 |
| 2. Deploy preview | `pnpm deploy` → Worker en workers.dev | nadie (URL privada de facto) | `npx wrangler delete` | `BASE_URL=https://ethrovs.<cuenta>.workers.dev bash scripts/parity.sh` → exit 0 |
| 3. Soak 48 h | nada — corridas repetidas de parity | nadie | n/a | 3 corridas de parity con exit 0 |
| 4. TTL down | Bajar TTL de los registros de ethrovs.com a 300 s (consola Cloudflare DNS, humano); esperar el TTL anterior | nadie | subir TTL | `dig +short ethrovs.com A` responde (sin cambio aún) |
| 5. Cutover | Conectar ethrovs.com como custom domain del Worker / apuntar DNS al Worker (humano, consola) | todos | restaurar registros desde `docs/cutover/dns-before.txt` (~5 min con TTL 300) | `BASE_URL=https://ethrovs.com bash scripts/parity.sh` → exit 0 |
| 6. Vigilancia 48 h | nada | todos | kill switch abajo | parity diaria exit 0 + dashboard sin 5xx |
| 7. Decomiso (día 7+) | DECOM-1 y DECOM-2 (abajo) | nadie | revert del commit de decomiso | `pnpm test` → exit 0 tras el borrado |

**Kill switch:** restaurar en la consola DNS de Cloudflare los registros capturados en
`docs/cutover/dns-before.txt` (por eso el paso 13 los captura ANTES, a un archivo versionado).
Con TTL 300 s, la reversión efectiva es ≤5 minutos. No requiere deploy.

#### Kill criteria (5/6)

Decididos antes del cutover; evaluables con un comando. Vigía: Daniel, con el dashboard de Workers
abierto las primeras 48 h.

- [ ] WHEN `curl -s -o /dev/null -w '%{http_code}' https://ethrovs.com/` returns a 5xx on 2
      consecutive checks 5 minutes apart THE SYSTEM SHALL be rolled back (restore DNS) y se
      investiga en workers.dev.
- [ ] WHEN `BASE_URL=https://ethrovs.com bash scripts/parity.sh` exits non-zero for any content row
      (contenido faltante) after cutover THE SYSTEM SHALL be rolled back.
- [ ] WHEN the Workers dashboard shows sustained error rate above 1% for 30 minutes THE SYSTEM
      SHALL be rolled back.

#### Data migration

NOT APPLICABLE — no hay datos que migrar: el sitio no persiste nada del lado servidor y el estado de
cliente vive en el `localStorage` de cada visitante.

#### Decommission (6/6)

Tareas con id, ejecutables **solo** tras 7 días de cutover estable (kill criteria nunca disparados).
No son pasos de §9; el gate del build es llegar a la fase 5 con la vieja ruta aún restaurable.

| Id | Qué se borra | Detalle |
|---|---|---|
| **DECOM-1** | `.openai/hosting.json`, `app/chatgpt-auth.ts` | **Atención:** `vite.config.ts` importa `./.openai/hosting.json` (líneas 3 y 9). El mismo commit debe editar `vite.config.ts` sustituyendo `const { d1, r2 } = hostingConfig;` por `const d1 = null, r2 = null;` y eliminando el import. Gate: `pnpm build && pnpm test` → exit 0 tras el borrado. |
| **DECOM-2** | `package-lock.json` | Residuo npm junto al `pnpm-lock.yaml` que manda (§2). Borrarlo solo aquí, no en caliente durante el build. Gate: `pnpm install --frozen-lockfile` → exit 0. |

---

## 10. Environment Setup

### Prerequisites

| Herramienta | Versión | Check |
|---|---|---|
| Node.js | >=22.13.0 (engines de package.json; verificado con v26.7.0 en la máquina del usuario) | `node --version` |
| pnpm | 10.x (el bootstrap lo instala si falta) | `pnpm --version` |
| git | cualquiera reciente | `git --version` |
| dig, curl | los del sistema (macOS los trae) | `dig -v; curl --version` |

### Accounts to create first

| Servicio | Estado | Para qué / desde qué paso |
|---|---|---|
| Cloudflare (con el dominio ethrovs.com ya en la cuenta) | **YA EXISTE** — NS `eleanor`/`vin.ns.cloudflare.com` verificados | Deploy y cutover — solo launch checklist (humano), ningún paso de §9 la necesita |
| Google Search Console | crear/verificar si no existe — https://search.google.com/search-console | Enviar sitemap post-cutover (launch checklist, humano) |

### Environment variables

**El build y todos los gates de §9 corren sin una sola variable de entorno.** No hay `.env`, y la
app no valida env al boot (nada que validar). Las únicas variables de toda la ronda:

| Variable | Propósito | De dónde sale | Requerida desde | ¿Secreta? |
|---|---|---|---|---|
| `BASE_URL` | Parámetro de `scripts/parity.sh` — URL del deploy a verificar | La imprime `pnpm deploy` (workers.dev) o es `https://ethrovs.com` | Launch checklist (ningún paso de §9) | no |
| `CLOUDFLARE_API_TOKEN` | Alternativa no interactiva a `wrangler login` para el deploy | Dashboard Cloudflare → My Profile → API Tokens (plantilla "Edit Cloudflare Workers") | Launch checklist, opcional | **sí** — nunca en el repo; solo en el shell del humano |

### Files that must be committed

`.gitignore` existente verificado 2026-08-30: sus patrones (`/node_modules`, `/dist/`, `.env*`,
`/.wrangler/`, `/outputs/`, `/work/`, `/.next/`, `/.vinext/`) **no tapan ninguno** de estos archivos.
El repo ya está inicializado y el `.gitignore` ya está commiteado (brownfield), así que la regla "el
ignore precede al primer commit" ya se cumple; no se edita el `.gitignore` en esta ronda.

| Archivo | Por qué se commitea | Excepción de ignore necesaria |
|---|---|---|
| `wrangler.jsonc` | Config del deploy — sin él no hay fallback `wrangler deploy` | — ningún patrón lo tapa (checked en Checkpoint paso 2) |
| `tests/site.test.mjs` | El arnés de todos los gates | — no lo tapa nada |
| `public/sitemap.xml` | Servido en producción | — no lo tapa nada (checked en Checkpoint paso 10) |
| `scripts/parity.sh`, `docs/cutover/dns-before.txt`, `docs/cutover/launch-checklist.md` | Arnés y plan de cutover — el kill switch depende del dns-before versionado | — no los tapa nada (checked en Checkpoint paso 13) |
| `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json`, `.claude/rules/*.md` | Workspace del agente (§19) | — no los tapa nada |
| `blueprints/ethrovs-ronda-1-blueprint.md` | Este documento vive dentro del repo para que los Verify corran contra él | — no lo tapa nada |

### Bootstrap

```bash
# order matters: repo git (ya existe) → pnpm disponible → install congelado → build de humo
# Todo idempotente y no interactivo: este bloque se ejecuta dos veces y sale 0 ambas.
git rev-parse --git-dir >/dev/null 2>&1 || git init -b main   # no-op: el repo brownfield ya existe con historia y .gitignore commiteado
command -v pnpm >/dev/null 2>&1 || { command -v corepack >/dev/null 2>&1 && corepack enable || npm install -g pnpm@10; }   # corepack no existe en el Node 26 de Homebrew de esta máquina (verificado); el fallback npm -g cubre ese caso
pnpm --version                       # expect: 10.x
pnpm install --frozen-lockfile       # expect: exit 0; no modifica pnpm-lock.yaml (verificado 2026-08-30)
pnpm build                           # humo: compila el worker; safe de re-ejecutar
test -f dist/server/index.js         # expect: exit 0 — el path que wrangler.jsonc y los tests nombran
```

No hay `workspace/` que copiar (modo archivo único: los archivos de §19 los escribe el builder a
mano una sola vez, **antes de ejecutar este Bootstrap** — ver §19; si ya existen, no se reescriben). No hay servicios locales que levantar, ni
migraciones, ni seeds. §9 usa checkpoints git: el repositorio y su primer commit ya existen
(brownfield), así que la obligación de "crear el repo antes del paso 1" está satisfecha por la
historia real del repo.

---

## 11. Dependencies

Única sección del blueprint donde aparecen versiones. Regla brownfield: **manda `pnpm-lock.yaml`**
(verificado 2026-08-30 con `pnpm install --frozen-lockfile` + `pnpm build` en exit 0); cero
upgrades. Los paquetes existentes ya están instalados — su "Installed by" es el Bootstrap de §10,
que materializa el lockfile. Las altas son dos: `@cloudflare/workers-types` (paso 1) y
`@vinext/cloudflare` (paso 2).

### Runtime

| Paquete | Versión | Fuente | Checked | Installed by | Propósito |
|---|---|---|---|---|---|
| react / react-dom | 19.2.6 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | UI |
| drizzle-orm | 0.45.2 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | **presente, sin uso — no tocar** (Non-Goal §1) |

### Development

| Paquete | Versión | Fuente | Checked | Installed by | Propósito |
|---|---|---|---|---|---|
| vinext | 1.0.0-beta.2 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | Framework (PRE-RELEASE — es la línea del repo, **NO upgradear**) |
| **@cloudflare/workers-types** | **5.20260830.1** | https://registry.npmjs.org/@cloudflare/workers-types (dist-tag `latest`, publicado 2026-08-30) | 2026-08-30 | **paso 1** (`pnpm add -D @cloudflare/workers-types@5.20260830.1`) | Tipos de Workers para `worker/index.ts` y `db/index.ts` — sin ellos `npx tsc --noEmit` sale 2 HOY. Entra al array `"types"` de `tsconfig.json` (única edición de ese archivo, autorizada en el paso 1) |
| **@vinext/cloudflare** | **1.0.0-beta.6** | https://registry.npmjs.org/@vinext/cloudflare | 2026-08-30 | **paso 2** (`pnpm add -D @vinext/cloudflare@1.0.0-beta.6`) | Deploy a Workers (PRE-RELEASE, consistente con la línea beta del repo). Opciones verificadas: `--preview`, `--env`, `--name`, `--skip-build`, `--dry-run` |
| vite | 8.0.13 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | Bundler |
| wrangler | 4.92.0 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | CLI Cloudflare (fallback de deploy) |
| @cloudflare/vite-plugin | 1.37.1 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | Integración vite↔workerd |
| tailwindcss / @tailwindcss/postcss | 4.2.1 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | Instalado por el starter; el sitio usa CSS plano — no introducir utilidades (§2) |
| typescript | 5.9.3 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | `npx tsc --noEmit` en los gates |
| eslint (+ plugins del repo) | 9.39.4 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | `pnpm lint` |
| drizzle-kit | 0.31.10 | pnpm-lock.yaml del repo | 2026-08-30 | §10 Bootstrap | sin uso — no tocar |

### Deliberately not used

| Rechazado | En su lugar | Por qué |
|---|---|---|
| Upgrade a vinext estable / Next.js real | vinext 1.0.0-beta.2 congelado | Regla brownfield: el lockfile manda; un cambio de framework en plena migración de hosting es un big-bang prohibido |
| `app/sitemap.ts` (convención Next de sitemap dinámico) | `public/sitemap.xml` estático | Dos URLs fijas no ameritan depender de una convención cuyo soporte en vinext beta no está verificado |
| npm como package manager | pnpm | `package-lock.json` es residuo (DECOM-2); pnpm-lock.yaml es el lockfile que instala limpio |
| next-intl / i18n frameworks | Rutas + dos archivos de contenido | Dos idiomas y una página: un framework i18n es más código que el sitio |

---

## 12. Deployment Strategy

### Hosting

Cloudflare Workers, cuenta propia del usuario (el dominio ethrovs.com ya está en ella). Build:
`pnpm build` → `dist/server/index.js` (worker) + `dist/client/` (assets). Deploy: `pnpm deploy`
(= `@vinext/cloudflare deploy`); **fallback verificable**: `pnpm build && npx wrangler deploy`
usando el `wrangler.jsonc` del paso 2 (por eso el archivo referencia el output del build y no
delega todo al adaptador). Config runtime: `nodejs_compat`, `compatibility_date 2026-05-15` (la que
genera el build de vinext — verificado), bindings `ASSETS` + `IMAGES`.

### Environments

| Environment | Branch | URL | Database | Modo de terceros |
|---|---|---|---|---|
| Local | — | `pnpm dev` (vite dev server) / `pnpm start` (worker local) | ninguna | n/a |
| Preview / shadow | `main` | `https://ethrovs.<cuenta>.workers.dev` (fase 2 de §9.1) | ninguna | n/a |
| Production | `main` | `https://ethrovs.com` — **hoy OpenAI hosting; tras el cutover, el Worker** | ninguna | n/a |

### CI/CD

Sin pipeline en esta ronda (Non-Goal §1): el gate §20.1 corre local antes de cada deploy manual.
Anotado: el push a GitHub puede seguir redesplegando el hosting viejo de OpenAI con el precio nuevo
— aceptado (§9.1 Coexistence).

### Release and rollback

Release = `pnpm deploy` desde `main` con el gate §20.1 verde. Rollback de release:
`npx wrangler rollback` (Workers guarda versiones) o redeploy del tag `step-NN` anterior. Rollback
de cutover: restaurar DNS desde `docs/cutover/dns-before.txt` (≤5 min con TTL 300) — §9.1.

### Domain, DNS, TLS

Dominio y NS ya en Cloudflare. El cutover (humano, launch checklist): bajar TTL a 300 → conectar
ethrovs.com como custom domain del Worker (Workers & Pages → Settings → Domains & Routes) o apuntar
los registros al Worker → TLS lo gestiona Cloudflare automáticamente. `www.ethrovs.com`: conservar
el comportamiento actual capturado en `dns-before.txt`; si hoy no existe, no se crea en esta ronda.

---

## 13. Testing Strategy

| Capa | Framework | Qué cubre | Dónde | Corre |
|---|---|---|---|---|
| Integración SSR | `node:test` + `node:assert` (cero deps nuevas) | El worker compilado entero: rutas `/`, `/en`, `/api/locale`, strings de paridad, metadata, JSON-LD | `tests/site.test.mjs` | en cada `pnpm test` (que además compila) |
| Paridad de deploy | bash + curl | El deploy vivo: contenido + assets + sitemap con HTTP reales | `scripts/parity.sh` | pre-cutover y post-cutover (launch checklist) |

### Critical flows to cover

1. Prospecto ES: llega a `/`, ve precio $300 y toca el CTA de WhatsApp (strings + link probados).
2. Prospecto EN: llega a `/en`, ve el sitio en inglés con `lang` y metadata correctos.
3. Google: lee hreflang, sitemap y JSON-LD parseables (probado en ambas rutas).

### Test data

Ninguno: el arnés importa `dist/server/index.js` (con query de cache-busting) y stubea `ASSETS` con
404 — sin puertos, sin servicios, sin estado compartido entre tests. La geodetección se prueba
inyectando el header `cf-ipcountry` (determinista).

### What is deliberately not tested

Interacción de cliente (toggle de moneda, rotación del deck, banner tras hidratación) — requeriría
un runner de browser que la ronda no introduce; el riesgo queda cubierto porque esa lógica no cambia
(moneda, deck) o es aditiva y a prueba de fallos (banner). Tampoco: `/_vinext/image` (congelado y
sin consumidores), rendimiento, y regresión visual por pixel (la paridad es por strings — decisión
en §20.3).

---

## 14. Security & Secrets

| Concern | Control | Implementado en |
|---|---|---|
| Secretos | **Cero secretos en el repo** — no hay `.env`; el único secreto posible (`CLOUDFLARE_API_TOKEN`) vive solo en el shell del humano en el launch | §10 |
| Validación de entrada | El sitio no acepta entrada de usuario (sin formularios); `/api/locale` solo lee headers y no los refleja en HTML | diseño |
| XSS | El único `dangerouslySetInnerHTML` es el JSON-LD del paso 10, construido con `JSON.stringify` sobre literales del blueprint — sin datos de usuario | `app/(es|en)/layout.tsx` |
| SQL injection | NOT APPLICABLE — sin base de datos en uso | — |
| AuthN/AuthZ | Sitio público sin cuentas; el legado `chatgpt-auth.ts` se elimina en DECOM-1 | §9.1 |
| CSRF | Sin mutaciones ni cookies propias | — |
| Rate limiting / abuso | Límites del plan de Cloudflare Workers (§16) | plataforma |
| Webhooks | No hay | — |
| Auditoría de dependencias | `pnpm audit` manual antes del launch (checklist); sin CI esta ronda | launch checklist |
| Security headers | Los que sirve la plataforma + `_headers` generado por el build para assets; no se añaden CSP custom en esta ronda (sitio estático sin datos sensibles — decisión, §20.3) | build |
| PII | No se recolecta PII; `/api/locale` responde con `private, no-store` y no persiste nada | `app/api/locale/route.ts` |
| Logging | Observabilidad de Workers activada; no se loguea nada propio | `wrangler.jsonc` |

**Reglas duras:** ningún token de Cloudflare se commitea, se imprime ni se pega en archivos del
repo; el deploy autenticado es siempre acción humana del launch checklist. No hay datos regulados:
el sitio no maneja salud, finanzas, menores ni datos personales de la UE.

---

## 15. Accessibility

**Objetivo WCAG 2.2 AA.** El sistema existente ya cumple lo grueso (verificado en el código):
`:focus-visible` global con outline `--blue` ≥3:1, `prefers-reduced-motion` en CSS y en el deck JS,
contraste AA en todos los pares de §7 (medido), `aria-label`/`aria-pressed`/`aria-current` en los
controles, `alt` semántico en las imágenes (`role="img"` + `aria-label` hoy; `<img alt>` real desde
el paso 12).

### Requisitos que los pasos de esta ronda añaden

| Requisito | Dónde se cumple |
|---|---|
| El toggle de idioma como links marca el activo con `aria-current` | paso 7 (Done when + selector CSS gemelo) |
| El banner usa `role="status"` (anuncio no intrusivo), su botón de cierre tiene `aria-label`, y todo es operable por teclado (links y button nativos) | paso 9 |
| Testimonios: `<blockquote>` semántico dentro de `<article>`, sección con h2 en orden | paso 11 |
| Imágenes del portafolio: `<img>` con `alt` no vacío (el `project.alt` existente) | paso 12 (Done when) |
| Target size: los controles nuevos usan `.btn*`/padding existentes ≥24px | pasos 9, 11 |

### Verification

```bash
# No hay runner axe en esta ronda (sin e2e — §13). El chequeo automatizable:
pnpm test        # expect: exit 0 — incluye lang correcto por ruta y alt en imágenes vía strings
```

Pases manuales antes del launch (checklist): navegación completa solo con teclado en `/` y `/en`
(toggle, banner, FAQ `<details>`, CTAs), un pase de VoiceOver sobre el flujo principal, y zoom 200%
en el breakpoint más angosto. Automatizar axe queda para la ronda con e2e (§20.4).

---

## 16. Observability & Cost

### Instrumentation

| Señal | Herramienta | Qué captura | Quién la mira |
|---|---|---|---|
| Errores y logs | Workers Observability (`observability: enabled` en `wrangler.jsonc`, paso 2) | excepciones del worker, logs de runtime | Daniel, dashboard Cloudflare |
| Métricas | Workers Analytics (incluido) | requests, error rate, CPU time, p50/p95 | Daniel |
| Uptime | corridas de `scripts/parity.sh` (manual, diaria en la vigilancia post-cutover) | contenido y 200s reales end-to-end | Daniel |

### The metrics that matter

| Métrica | Objetivo | Alerta / acción |
|---|---|---|
| Error rate (5xx) | 0% sostenido | >1% por 30 min → kill criteria §9.1 |
| Requests/día | informativo (línea base del negocio) | >80,000/día → acercándose al cliff del plan free |
| p95 CPU time | <50 ms | >50 ms sostenido revisa el SSR |
| Mensajes de WhatsApp entrantes | tendencia semanal (métrica de negocio; se cuenta a mano — sin analytics de eventos esta ronda) | caída a 0 tras el cutover → revisar links |

### Health check

`GET /api/locale` es el health check de facto: ejercita el worker completo (routing + runtime) y
responde JSON estable. Lo consume `parity.sh` ("API locale"). Sin poller automático esta ronda.

### Cost model

| Servicio | Free tier | Costo a escala v1 | Costo a 10× | Cliff |
|---|---|---|---|---|
| Workers (plan Free) | 100,000 req/día | $0/mes | $0 (un sitio local no se acerca) | 100k req/día → plan Paid $5/mes |
| Cloudflare Images (binding IMAGES) | 5,000 transformaciones únicas/mes | $0 — hoy **ninguna página consume** `/_vinext/image` | $0 | si se activa `next/image` en el futuro |
| Dominio ethrovs.com | ya pagado (registrador Cloudflare) | ~$10/año | igual | ninguno |

**Costo mensual estimado al launch: $0.** La línea mayor potencial es el salto a Workers Paid
($5/mes) que solo dispara un tráfico 20× el esperado; nada escala superlinealmente.

---

## 17. Model Routing

NOT APPLICABLE — this project does not call an LLM at runtime.

---

## 18. Skills to Use During Build

| Skill | Pasos | Por qué | Install |
|---|---|---|---|
| `frontend-design` (auto-activa; no es slash command) | 9, 11 | Mantener las adiciones (banner, testimonios) dentro del sistema editorial de §7 en vez del "AI look" por defecto | `/plugin marketplace add anthropics/skills` y luego `/plugin install example-skills@anthropic-agent-skills` |
| `/claude-seo-ai:audit` | post-paso 10 (opcional) y launch | Auditar hreflang/JSON-LD/sitemap contra SEO clásico y GEO/AEO antes del cutover | `/plugin marketplace add Hainrixz/claude-seo-ai` · `/plugin install claude-seo-ai@claude-seo-ai` · `/reload-plugins` |

**Degradación:** ninguna skill es dependencia dura. Si no está instalada, el builder sigue con la
guía del propio blueprint (§7 para lo visual, paso 10 para SEO), anota el fallback en una línea y
continúa.

---

## 19. Agent Workspace

Modo archivo único: cada artefacto va como bloque cercado etiquetado con su ruta destino; el builder
los escribe tal cual **antes del Bootstrap §10** (y por tanto antes del paso 1): así los permisos de
`.claude/settings.json` gobiernan desde el primer comando ejecutado en el repo. **El repo NO tiene hoy CLAUDE.md
ni AGENTS.md ni `.claude/`** (verificado 2026-08-30), así que no hay nada que fusionar: los cuatro
archivos se crean nuevos. Si en el futuro existieran, estos contenidos se FUSIONAN (las reglas de
aquí se añaden; las existentes del repo mandan en conflicto). Nunca se emite `.claude/commands/`.

### 19.1 `CLAUDE.md` (ruta destino: `CLAUDE.md`, raíz del repo)

```markdown
# ETHROVS

Sitio bilingüe (ES en `/`, EN en `/en`) del estudio web de Daniel Oyervidez. Vende "Website
Express 24 h" desde $300 USD / $5,900 MXN. Corre como Cloudflare Worker (vinext).

## Commands

| Task | Command |
|---|---|
| Install | `pnpm install --frozen-lockfile` |
| Dev server | `pnpm dev` |
| Build | `pnpm build` → `dist/server/index.js` + `dist/client/` |
| Typecheck | `npx tsc --noEmit` |
| Lint | `pnpm lint` |
| Tests | `pnpm test` (compila y prueba el HTML real del worker) |
| Deploy (solo humano, con `wrangler login`) | `pnpm deploy` |
| Paridad contra un deploy | `BASE_URL=<url> bash scripts/parity.sh` |

**Gate:** `npx tsc --noEmit && pnpm lint && pnpm test` debe pasar antes de dar por hecha una tarea.

Versión de Node en `package.json` (`engines`). Los pins viven en `pnpm-lock.yaml` — léelo, nunca
adivines una versión. `package-lock.json` es residuo: ignóralo, no lo borres.

## Stack

vinext (beta, NO upgradear) · React 19 · TypeScript · CSS plano con tokens en `app/globals.css` ·
Cloudflare Workers (`wrangler.jsonc`).

## Architecture

**Request path:** request → `worker/index.ts` (CONGELADO: `/_vinext/image` + delega a vinext) →
route group `app/(es)/` o `app/(en)/` → `layout.tsx` (html lang + metadata + JSON-LD) → `page.tsx`
→ `app/components/HomePage.tsx` (cliente; estado de moneda y deck) → componentes de presentación →
copy de `app/content/{es,en}.ts` + datos de `app/content/site.ts`.

| Capa | Puede importar de | Nunca |
|---|---|---|
| `app/(es|en)/**` | `components/`, `content/` | lógica propia — solo componen |
| `app/components/**` | `content/`, otros components | `fetch` (salvo `LocaleSuggestion` → `/api/locale`), `db/`, `chatgpt-auth` |
| `app/content/**` | nada interno | React, componentes |

**Congelado — no editar:** `worker/index.ts`, `app/api/locale/route.ts`, `vite.config.ts`,
`.openai/hosting.json`, `app/chatgpt-auth.ts`, `db/**`, precios y copy de venta.

## Code rules

1. Imports relativos dentro de `app/` — el alias `@/*` existe en tsconfig pero no se usa.
2. `"use client"` solo donde hay estado o efectos (hoy: `HomePage`, `LocaleSuggestion`).
3. Cero hex/px nuevos: todo color y espaciado sale de los tokens de `app/globals.css`.
4. ES y EN siempre en paralelo: cada string nuevo entra en `es.ts` **y** `en.ts` en el mismo commit.
5. Sin dependencias nuevas sin razón escrita en el commit.

## Environment

Sin variables de entorno en build ni runtime. `BASE_URL` solo parametriza `scripts/parity.sh`;
`CLOUDFLARE_API_TOKEN` solo lo usa un humano para deploy y jamás se escribe en el repo.

## Rules

| File | Applies to |
|---|---|
| `.claude/rules/content.md` | `app/content/**` |
| `.claude/rules/components.md` | `app/components/**` |

## Non-negotiable

1. Nunca cambiar precios ($300 / $5,900), links de WhatsApp/email, ni copy de venta.
2. Nunca editar los archivos congelados listados arriba.
3. Nunca redirigir por geolocalización: el idioma se sugiere (banner), no se impone.
4. Nunca marcar una tarea hecha con el gate fallando.
5. Nunca commitear tokens ni `.env*`.
```

### 19.2 `AGENTS.md` (ruta destino: `AGENTS.md`)

```markdown
# ETHROVS — agent instructions

Sitio bilingüe (ES `/`, EN `/en`) que vende "Website Express 24 h"; Cloudflare Worker via vinext.

## Commands

| Task | Command |
|---|---|
| Install | `pnpm install --frozen-lockfile` |
| Build | `pnpm build` |
| Typecheck / lint | `npx tsc --noEmit` · `pnpm lint` |
| Tests (gate) | `pnpm test` |

## Non-negotiable

1. Nunca cambiar precios ($300 / $5,900), links de contacto ni copy de venta.
2. Nunca editar `worker/index.ts`, `app/api/locale/route.ts`, `vite.config.ts`, `db/**`.
3. Nunca redirigir por geolocalización.
4. Nunca marcar una tarea hecha con `pnpm test` fallando.

Arquitectura completa, límites y tokens de diseño: ver `CLAUDE.md` en este directorio.
```

### 19.3 `.claude/settings.json` (ruta destino: `.claude/settings.json`)

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm install:*)",
      "Bash(pnpm add:*)",
      "Bash(pnpm build)",
      "Bash(pnpm test)",
      "Bash(pnpm lint)",
      "Bash(npx tsc:*)",
      "Bash(node --test:*)",
      "Bash(node --input-type=module -e:*)",
      "Bash(node -e:*)",
      "Bash(bash -n:*)",
      "Bash(dig:*)",
      "Bash(curl:*)",
      "Bash(git status:*)",
      "Bash(git diff:*)",
      "Bash(git log:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git reset:*)",
      "Bash(git tag:*)",
      "Bash(git check-ignore:*)",
      "Bash(git ls-files:*)",
      "Bash(mkdir:*)",
      "Bash(grep:*)",
      "Bash(test:*)"
    ],
    "deny": [
      "Read(./.env)",
      "Read(./.env.*)",
      "Bash(git push:*)",
      "Bash(npx wrangler deploy:*)",
      "Bash(npx wrangler delete:*)",
      "Bash(npx @vinext/cloudflare deploy:*)",
      "Bash(pnpm deploy)"
    ]
  }
}
```

(El deploy está en `deny` a propósito: requiere auth humana y pertenece al launch checklist, no al
build desatendido. Ningún `Verify` de §9 invoca un comando deny-listado: el paso 2 sondea el paquete
instalado con `node -e` sobre su `package.json` y `test -e` sobre el bin — ambos en el `allow` —
sin ejecutar `deploy` en ninguna forma.)

### 19.4 Project skills

Ninguna: la ronda no deja workflows repetibles que ameriten skill propia (el deploy es humano y
está documentado en el launch checklist; añadir contenido está regulado por `.claude/rules/`). Se
omite el directorio `skills/` — no se emiten skills vacías.

### 19.5 `.claude/rules/*.md`

Ruta destino: `.claude/rules/content.md`

```markdown
---
description: Convenciones del contenido bilingüe
paths:
  - "app/content/**"
---

- `es.ts` y `en.ts` son espejos: misma forma `Copy` (definida en `site.ts`), mismas claves, mismo
  orden. Un string nuevo entra en ambos en el mismo commit.
- Los precios ($300, $5,900, y los extras) y las URLs de WhatsApp/email de `site.ts` están
  CONGELADOS: no se editan sin instrucción explícita de Daniel.
- Los testimonios con `TODO(daniel)` son placeholders: solo Daniel los sustituye por frases reales.
- Nada de este directorio importa React ni componentes.
```

Ruta destino: `.claude/rules/components.md`

```markdown
---
description: Convenciones de componentes de presentación
paths:
  - "app/components/**"
---

- Presentacionales: reciben `c` (copy) y datos por props; sin fetch (excepción única:
  `LocaleSuggestion.tsx` → `/api/locale`).
- Solo clases existentes de `app/globals.css` (`.sec`, `.wrap`, `.label`, `.serif`, `.btn*`, `.svc`…)
  y tokens: cero hex, radius o sombras nuevos.
- `"use client"` solo si hay estado/efectos; empújalo a la hoja.
- Todo control interactivo: operable por teclado y con `aria-*` correcto (ver §15 del blueprint).
- `localStorage` siempre en `try/catch`.
```

### 19.6 Verify-critical config and local infrastructure

Ningún `Verify` de §9 necesita config que no exista ya o que un paso no autore: no hay runner con
config propia (`node --test` corre sin archivo de configuración), no hay servicios locales, no hay
base de datos, y no hay env vars. Cross-check mecánico hecho: cada archivo nombrado en un `Verify`
(`tests/site.test.mjs`, `wrangler.jsonc`, `app/content/*.ts`, `app/components/*.tsx`,
`public/sitemap.xml`, `scripts/parity.sh`, `docs/cutover/*`) es autorado por el paso indicado en §3.

| File | Path | Verify que lo necesita | Resolución/env que carga | Exclusión del bundle |
|---|---|---|---|---|
| Arnés de tests | `tests/site.test.mjs` | pasos 1–13 (`pnpm test`) | ninguna — importa `dist/server/index.js` por URL relativa; no lee env | n/a — `node --test` recibe el archivo explícito, no walkea |
| Config del worker | `wrangler.jsonc` | paso 2 | ninguna | n/a — solo lo lee wrangler |
| Arnés de paridad | `scripts/parity.sh` | paso 13 (`bash -n`), launch | `BASE_URL` con `:?` (falla con mensaje claro si falta) | n/a |

**El bundle (`blueprints/`) dentro del repo:** `pnpm lint` usa eslint sobre `.`, que solo procesa
`js/mjs/ts/tsx` — `blueprints/` contiene únicamente este `.md`, así que ningún tool del repo lo
walkea ni lo rompe (eslint ignora md; tsc usa `include` de tsconfig que matchea `**/*.ts` pero
`blueprints/` no contiene ts). Verificado razonando sobre `eslint.config.mjs` y `tsconfig.json`
reales; si algún día se añade código al bundle, añadir `blueprints/**` a los ignores.

#### Resolution convention matrix

**La convención, dicha una vez:** imports **relativos con especificador sin extensión** para módulos
TS dentro de `app/` (p. ej. `import { es } from "../content/es"`), como ya hace el código del repo;
el alias `@/*` de tsconfig existe pero **no se usa**; los tests importan **solo** el build
(`../dist/server/index.js`, con extensión, por URL) y jamás módulos TS del código fuente.

| Contexto | Comando que lo ejercita | Convención ahí | Config + setting que la hace funcionar |
|---|---|---|---|
| Código de la app | `pnpm build` / `pnpm dev` | relativos sin extensión | `tsconfig.json` — `moduleResolution: "bundler"` (existente); resuelve vite |
| Tests | `pnpm test` → `node --test tests/site.test.mjs` | URL relativa **con** extensión `.js` al artefacto compilado | ninguna config: Node ESM resuelve URLs literales; por eso los tests no importan TS |
| Scripts standalone | `bash scripts/parity.sh` | sin imports (bash + curl) | n/a |
| Build/bundle | `pnpm build` | la de la app; el output es autocontenido (`dist/server/index.js` + chunks relativos) | vinext/vite (existente) |

#### Cross-artifact value reconciliation

| Valor compartido | Fuente única | Valor literal | Demás apariciones | Comparado |
|---|---|---|---|---|
| Entry del worker compilado | build de vinext (verificado) | `dist/server/index.js` | `wrangler.jsonc` `main` · `tests/site.test.mjs` (URL de import) · §10 Bootstrap (`test -f`) · Verify pasos 2, 7, 11 | sí |
| Directorio de assets | build de vinext (verificado: genera `assets.directory: "../client"` relativo a dist/server) | `dist/client` | `wrangler.jsonc` `assets.directory` · Verify paso 2 (`test -d`) | sí |
| Compatibility date | `dist/server/wrangler.json` generado (verificado 2026-08-30) | `2026-05-15` | `wrangler.jsonc` | sí |
| Nombre del worker | `wrangler.jsonc` `name` | `ethrovs` | URL workers.dev del launch checklist (`ethrovs.<cuenta>.workers.dev`) | sí |
| Precio USD | `app/content/site.ts` (desde paso 3; antes `app/page.tsx`) | `$300` | tests · `parity.sh` · §1/§9.1 | sí |
| Precio MXN | `app/content/site.ts` | `$5,900` | test "precio MXN" · metadata descriptions (paso 10) · §1 | sí |
| WhatsApp | `app/content/site.ts` | `https://wa.me/19569511763` | tests · `parity.sh` · teléfono JSON-LD `+1-956-951-1763` (mismo número, formato E.164 con guiones — deliberado) | sí |
| Email | `app/content/site.ts` | `ethernaldevops@gmail.com` | tests · `parity.sh` · JSON-LD | sí |
| URL EN | metadata alternates (paso 10) | `https://ethrovs.com/en` | `public/sitemap.xml` · `parity.sh` "sitemap" · JSON-LD EN | sí |
| Clave de descarte del banner | `LocaleSuggestion.tsx` | `ethrovs-lang-hint-dismissed` | Verify paso 9 (grep) | sí |
| Archivo de test | `package.json` script `test` | `tests/site.test.mjs` | Verify paso 1 (grep) · §13 | sí |

#### Byte-exact artifact reconciliation

NOT APPLICABLE — este blueprint no autora salida esperada byte-exacta: todos los gates comparan por
**substring** (`includes`/`grep`) o por propiedad (`JSON.parse` no lanza, exit 0, HTTP 200), nunca
por `diff` de bytes completos. Los substrings esperados de los pasos 1–13 fueron leídos del HTML
real que el worker compilado del repo emitió el 2026-08-30 (runtime pinneado por el lockfile), no
escritos de memoria.

---

## 20. Acceptance Gate, Risks & Decision Log

### 20.1 Global acceptance gate

El proyecto está **terminado** cuando cada comando sale 0 en un checkout limpio, y no antes:

```bash
pnpm install --frozen-lockfile    # expect: exit 0
pnpm lint                         # expect: exit 0, cero errores y cero warnings
npx tsc --noEmit                  # expect: exit 0
pnpm test                         # expect: exit 0, 0 failed, 0 skipped — compila y ejercita el worker real (/, /en, /api/locale)
test -f dist/server/index.js && test -d dist/client   # expect: exit 0 — los paths que wrangler.jsonc declara existen tras el build de pnpm test
bash -n scripts/parity.sh         # expect: exit 0
```

(La línea de `pnpm test` cumple la regla "ejecuta el artefacto": importa y ejecuta el worker
compilado, el mismo entry que `wrangler.jsonc` despliega.)

Gates manuales, una vez antes del launch:

- [ ] Cada paso de §9 tiene su tag: `git tag -l 'step-*'` lista `step-01-arnes` …
      `step-13-cutover-prep` (una por paso; los nombres exactos están en cada Checkpoint).
- [ ] Cada archivo de la tabla *Files that must be committed* (§10) está trackeado:
      `git ls-files --error-unmatch <path>` sale 0 **por cada path, uno por invocación**; y no lo
      tapa el ignore: `git check-ignore -q <path>; test $? -eq 1` por cada uno (código 1 = no
      ignorado; 128 sería error de uso y falla el gate).
- [ ] `worker/index.ts`, `app/api/locale/route.ts` y `vite.config.ts` no cambiaron en la ronda:
      `git diff --name-only step-01-arnes~1..step-13-cutover-prep -- worker/index.ts app/api/locale/route.ts vite.config.ts | wc -l` imprime `0`
      (la base `step-01-arnes~1` es el commit previo al paso 1, para que el rango cubra también los
      cambios del propio paso 1).
- [ ] El Bootstrap de §10 se re-ejecutó una vez sobre el árbol ya instalado y salió 0 sin romper
      nada (`pnpm build` posterior sigue en 0).
- [ ] Cada fila de §19.6 *Cross-artifact value reconciliation* dice `Comparado: sí` y se releyó
      tras el último cambio.
- [ ] §9.1: paridad probada contra workers.dev (parity.sh exit 0 ×3), kill switch ensayado una vez
      a propósito (restaurar un registro DNS de prueba o verificar el procedimiento con el TTL ya
      bajado), y el hosting viejo sigue desplegado y restaurable.
- [ ] Cada non-goal de §1 sigue sin construir.
- [ ] Pase de teclado + un pase de screen reader sobre `/` y `/en` (§15).

**Ningún warning se tolera** — un warning tolerado esconde el siguiente real.

### 20.2 Risk register

| Riesgo | Prob. | Impacto | Señal temprana | Mitigación |
|---|---|---|---|---|
| `@vinext/cloudflare` (beta) falla contra la cuenta real | M | H | `pnpm deploy` sale ≠0 o el Worker no responde en workers.dev | Versión congelada 1.0.0-beta.6; **fallback documentado**: `pnpm build && npx wrangler deploy` con el `wrangler.jsonc` del paso 2 (por eso existe con valores completos). Owner: builder/Daniel |
| Binding IMAGES no habilitado en la cuenta | M | M | El deploy rechaza el binding o `/_vinext/image` da 5xx | Quitar el bloque `"images"` de `wrangler.jsonc` y redeploy: las imágenes se sirven directas de ASSETS (el cliente vinext salta el optimizador si el endpoint no está). Está como punto del launch checklist |
| vinext beta no soporta dos root layouts en route groups (paso 8) | M | H | `pnpm build` falla o `/en` renderiza el layout ES | Detenerse en el paso 8 y aplicar el fallback: conservar un solo `app/layout.tsx` con `lang="es"`, crear `app/en/page.tsx` que fija `document.documentElement.lang="en"` en un efecto + metadata EN por página, y relajar el assert de `/en` a h1 EN + hreflang (dejando el `lang` SSR como deuda registrada). Deviación reportada, no improvisada |
| El export `metadata.alternates` (hreflang) no lo emite vinext beta en el SSR (paso 10) | M | M | El test "metadata localizada y hreflang por ruta" falla: el HTML de `/` o `/en` no contiene `hreflang=` | Fallback: renderizar los `<link rel="alternate" hreflang="…" href="…" />` literales en el JSX del layout/página de cada idioma (React 19 eleva `<link>` al `<head>` automáticamente); mismo gate (`pnpm test` con los mismos asserts de hreflang). Deviación reportada, no improvisada |
| Reindexación de Google tras el cambio de metadata/hreflang | H | M | Impresiones caen la semana post-cutover | Enviar `sitemap.xml` en Search Console (launch checklist, humano); hreflang + canónicas correctas desde el día 1; no cambiar más las URLs |
| El push a GitHub redespliega el hosting viejo de OpenAI con el precio nuevo | H | L | ethrovs.com (viejo) muestra $300 antes del cutover | Ningún daño (precio correcto). Anotado en §9.1 Coexistence para que nadie lo confunda con el cutover ya hecho |
| Refactor rompe paridad de strings (acentos, entidades) | M | M | `pnpm test` falla en un paso 3–8 | El arnés corre en **cada** paso; regla de bloque: copiar strings byte-idénticos, jamás reescribirlos |
| `package-lock.json` residual confunde a un tool o humano hacia npm | L | M | Aparece un `npm install` en la historia | §2 declara pnpm como manager; DECOM-2 lo elimina tras el soak; CLAUDE.md lo dice explícito |

### 20.3 Decision log

| # | Decisión | Alternativa rechazada | Por qué | Se revierte si |
|---|---|---|---|---|
| 1 | Migrar hosting a Cloudflare Workers en la cuenta del usuario | Quedarse en el hosting de ChatGPT/OpenAI | La prod está desactualizada y fuera de control del usuario; el dominio ya vive en Cloudflare | Cloudflare exigiera plan pago para el caso de uso (no lo hace) |
| 2 | `@vinext/cloudflare` como vía de deploy, con `wrangler deploy` de fallback | Solo wrangler manual | Es el adaptador de la línea del repo; el fallback cubre su condición beta | El adaptador falla en el launch → el fallback pasa a ser la vía titular |
| 3 | Idioma por URL con route groups y dos root layouts | Estado de cliente (lo actual) / middleware de redirect | SEO local exige URLs indexables por idioma y `lang` SSR correcto; el redirect por IP es un antipatrón | vinext no soporta dos root layouts → fallback de §20.2 fila 3 |
| 4 | Geodetección degradada a **sugerencia** (banner) | Redirect automático según `/api/locale` | Google indexa desde IPs de EE. UU.: un redirect le escondería el ES; el usuario manda | Nunca (decisión de diseño) |
| 5 | `public/sitemap.xml` estático | `app/sitemap.ts` dinámico | Dos URLs fijas; cero dependencia de soporte beta no verificado | El sitio pasa de 2 a N URLs (blog) |
| 6 | Paridad por strings clave en HTML renderizado | Snapshot byte-exacto / screenshot diff | Los strings son el contrato de negocio (precio, contacto, h1); un snapshot byte-exacto se rompe con cada hash de chunk | Aparece regresión visual que los strings no detectan → añadir e2e visual (§20.4) |
| 7 | Test suite importa el worker compilado (patrón del starter) | Levantar `pnpm start` y curl | Sin puerto que adivinar, sin proceso que matar, determinista en CI futura; ya estaba probado en el repo | vinext cambia el shape del entry |
| 8 | Renombrar el test a `tests/site.test.mjs` (editando el script `test`) | Reutilizar el nombre `rendered-html.test.mjs` | El nombre viejo miente sobre el contenido; el cambio de script conserva el comando `pnpm test` intacto | — |
| 9 | JSON-LD inline en cada layout | Componente compartido `JsonLd.tsx` | Dos literales pequeños y distintos (url/description por idioma); un componente añadiría indirection sin reuso real | Se añade una tercera ruta |
| 10 | Deck del hero conserva `background-image`; solo el grid de portafolio pasa a `<img loading="lazy">` | Convertir todo a `<img>` | El deck está above the fold (lazy no aplica) y su animación 3D depende del estilo actual; el grid sí gana carga diferida real | Se detecta CLS o SEO de imágenes como problema |
| 11 | pnpm como único manager; `package-lock.json` a decomiso diferido | Borrarlo ya | Borrarlo en caliente cambiaría el hosting viejo aún activo durante la coexistencia; tras el soak es seguro | — |
| 12 | Testimonios como placeholders `TODO(daniel)` visibles | Esperar frases reales para construir la sección | La estructura desbloquea el launch; el marcador hace imposible confundir placeholder con cita real | Daniel entrega las frases (las sustituye él) |
| 13 | Autorizar en el paso 1 un fix mínimo y acotado del efecto de restauración de idioma de `app/page.tsx` (reestructura al patrón que `react-hooks/set-state-in-effect` acepta), con `pnpm test` probando paridad | Suprimir la regla con `eslint-disable` / tolerar `pnpm lint` en rojo hasta que el paso 7 elimine el efecto | `pnpm lint` falla HOY (verificado 2026-08-30, línea 130) y el gate exige lint 0 desde el paso 1; un arnés que nace sobre un gate roto no es gate. La supresión escondería un patrón real que la regla señala | El paso 7 elimina el efecto completo (el fix muere con él, como estaba previsto) |

### 20.4 What to build next

1. **Frases reales de testimonios** — trigger: Daniel las recolecta (sustituye los `TODO(daniel)`;
   no requiere builder).
2. **Analítica de eventos (clics de WhatsApp)** — trigger: primera semana post-cutover sin datos de
   conversión (§16 la mide a mano hoy).
3. **E2E de browser + axe automatizado** — trigger: primer bug de interacción de cliente que el
   arnés SSR no pudo ver (§13, §15).
4. **CI (gate §20.1 en GitHub Actions)** — trigger: hosting migrado y estable (Non-Goal de esta
   ronda por el bloqueo de cuentas).
5. **Blog/landing pages por nicho** — trigger: ≥3 pedidos reales de clientes; reabre la decisión 5
   (sitemap dinámico).

---

*Fin del blueprint. El orden de build es §9. Detente cuando §20.1 esté en verde. El cutover y el
decomiso viven en §9.1 + `docs/cutover/launch-checklist.md` y son acciones humanas post-build.*
