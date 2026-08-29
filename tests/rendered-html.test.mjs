import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
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

test("server-renders the neural essay home", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es"/i);
  assert.match(html, /<title>La mente que no se divide — Pedro Belentani<\/title>/i);
  assert.match(html, /Pienso con[\s\S]{0,80}todo lo que soy/i);
  assert.match(html, /La mente que no se divide/i);
  assert.match(html, /href="\/articulos\/tecnologia-que-sabe-tocar-sin-invadir"/i);
  assert.match(html, /href="\/articulos\/crear-mundos-no-vitrinas"/i);
  assert.match(html, /prefers-reduced-motion:\s*reduce/i);
  assert.doesNotMatch(html, /SkeletonPreview|react-loading-skeleton|codex-preview/i);
});

test("renders every indexed article and a custom 404", async () => {
  const index = JSON.parse(
    await readFile(new URL("content/index.json", projectRoot), "utf8"),
  );
  assert.equal(index.articles.length, 6);

  for (const article of index.articles) {
    const response = await render(`/articulos/${article.slug}`);
    assert.equal(response.status, 200, article.slug);

    const html = await response.text();
    assert.match(html, new RegExp(article.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
    assert.match(html, /Todos los art.culos/i);
    assert.doesNotMatch(html, /^---$/m);
  }

  const missing = await render("/articulos/no-existe");
  assert.equal(missing.status, 404);
  assert.match(await missing.text(), /Esta conexi.n no existe/i);
});

test("keeps private names and unsafe rendering out of the public surface", async () => {
  const files = [
    "app/components/HomePage.tsx",
    "app/components/ArticleBody.tsx",
    "app/lib/articles.ts",
    "EDITORIAL-ROADMAP.md",
    "content/01-tecnologia-que-sabe-tocar.md",
    "content/02-razon-emocion-misma-mesa.md",
    "content/03-vulnerabilidad-necesita-estructura.md",
    "content/04-ia-espejo-no-oraculo.md",
    "content/05-archivar-es-cuidar.md",
    "content/06-crear-mundos-no-vitrinas.md",
  ];
  const corpus = (
    await Promise.all(files.map((file) => readFile(new URL(file, projectRoot), "utf8")))
  ).join("\n");

  assert.doesNotMatch(corpus, /\b(?:JUDAS|Thiago)\b/i);
  assert.doesNotMatch(corpus, /dangerouslySetInnerHTML/);
  assert.doesNotMatch(corpus, /\b(?:TODO|FIXME|PLACEHOLDER)\b/);
});

test("keeps a complete fallback when WebGL or its dynamic import fails", async () => {
  const hero = await readFile(
    new URL("app/components/NeuralHero.tsx", projectRoot),
    "utf8",
  );

  assert.match(hero, /function supportsWebGL\(\): boolean/);
  assert.match(hero, /class NeuralErrorBoundary/);
  assert.match(hero, /<Suspense fallback=\{<NeuralFallback \/>\}>/);
  assert.match(hero, /media\.webgl/);
});
