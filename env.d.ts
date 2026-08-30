// Bindings del Worker para el chequeo de tipos (interface merging sobre la
// `Env` de @cloudflare/workers-types). La fuente de verdad en runtime es
// wrangler.jsonc / vite.config.ts.
declare namespace Cloudflare {
  interface Env {
    DB: D1Database;
    ASSETS: Fetcher;
  }
}
