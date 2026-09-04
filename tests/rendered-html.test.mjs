import assert from "node:assert/strict";
import test from "node:test";

async function render(path) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("la portada en español sirve el sitio real con SEO local", async () => {
  const response = await render("/");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="es"/i);
  assert.match(html, /Diseño de páginas web en Laredo y Nuevo Laredo/);
  assert.match(html, /Páginas web que/);
  assert.match(html, /mueven negocios\./);
  assert.match(html, /\$5,900/);
  assert.match(html, /\$12,900/);
  assert.match(html, /\$23,900/);
  assert.match(html, /application\/ld\+json/);
  const jsonLd = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s);
  assert.ok(jsonLd, "JSON-LD presente");
  const data = JSON.parse(jsonLd[1]);
  assert.equal(data["@type"], "ProfessionalService");
  assert.equal(data.name, "ETHROVS");
  assert.match(html, /hreflang="es"/i);
  assert.match(html, /hreflang="en"/i);
  assert.match(html, /hreflang="x-default"/i);
  assert.match(html, /Precio sujeto a evaluación/);
  for (const tier of ["Express", "Completo", "Tienda"]) assert.ok(html.includes(tier), `paquete ${tier}`);
  assert.match(html, /Plan de cuidado/);
});

test("la ruta /en sirve la versión en inglés", async () => {
  const response = await render("/en");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /<html[^>]*lang="en"/i);
  assert.match(html, /Website Design in Laredo, TX/);
  assert.match(html, /Websites that/);
  assert.match(html, /move businesses\./);
  assert.match(html, /\$300/);
  assert.match(html, /\$650/);
  assert.match(html, /\$1,200/);
  assert.match(html, /Pricing is subject to evaluation/);
  for (const tier of ["Express", "Complete", "Store"]) assert.ok(html.includes(tier), `package ${tier}`);
});

test("el portafolio usa imágenes reales con carga diferida", async () => {
  const html = await (await render("/")).text();
  const lazy = html.match(/loading="lazy"/g) ?? [];
  assert.equal(lazy.length, 4, "cuatro proyectos con loading=lazy");
  for (const shot of ["costa-grill.jpg", "vsr444.jpg", "excessive.jpg", "ciao.jpg"]) {
    assert.ok(html.includes(`/assets/shots/${shot}`), `incluye ${shot}`);
  }
});

test("sitemap.xml lista ambas versiones con hreflang", async () => {
  const response = await render("/sitemap.xml");
  assert.equal(response.status, 200);
  const xml = await response.text();
  assert.match(xml, /https:\/\/ethrovs\.com\//);
  assert.match(xml, /https:\/\/ethrovs\.com\/en/);
  assert.match(xml, /hreflang="es"/);
  assert.match(xml, /hreflang="en"/);
});

test("robots.txt permite el rastreo y apunta al sitemap", async () => {
  const response = await render("/robots.txt");
  assert.equal(response.status, 200);
  const body = await response.text();
  assert.match(body, /Allow: \//);
  assert.match(body, /Sitemap: https:\/\/ethrovs\.com\/sitemap\.xml/);
});
