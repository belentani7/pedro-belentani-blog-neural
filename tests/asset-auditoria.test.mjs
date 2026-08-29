import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const projectRoot = new URL("../", import.meta.url);

async function source(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("asset-audit", `${process.pid}-${Date.now()}-${pathname}`);
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

test("server-renders FRONTEND PROOF as a complete Spanish route", async () => {
  const response = await render("/auditoria");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="es"/i);
  assert.match(html, /<title>FRONTEND PROOF · Autoauditoría local/i);
  assert.equal((html.match(/<h1\b/gi) ?? []).length, 1);
  assert.match(html, /Una interfaz puede[\s\S]{0,120}defender su calidad/i);
  assert.match(html, /Jerarquía/);
  assert.match(html, /Movimiento/);
  assert.match(html, /Accesibilidad/);
  assert.match(html, /Rendimiento/);
  assert.match(html, /Tu código no sale del navegador/i);
  assert.match(html, /type="file"[^>]*accept="\.html,text\/html"/i);
  assert.match(html, /<label[^>]*for="audit-source"/i);
  assert.match(html, /<textarea[^>]*id="audit-source"[^>]*aria-describedby="source-help"/i);
  assert.doesNotMatch(html, /\splaceholder=/i);
});

test("keeps imported source client-only, inert and session-scoped", async () => {
  const [client, engine] = await Promise.all([
    source("app/auditoria/AuditClient.tsx"),
    source("app/auditoria/auditEngine.ts"),
  ]);
  const implementation = `${client}\n${engine}`;

  assert.match(implementation, /new DOMParser\(\)\.parseFromString\(source, "text\/html"\)/);
  assert.match(client, /await file\.text\(\)/);
  assert.match(client, /MAX_FILE_BYTES = 2 \* 1024 \* 1024/);
  assert.match(client, /navigator\.clipboard\.writeText/);
  assert.match(client, /new Blob\(/);
  assert.match(client, /URL\.createObjectURL/);
  assert.match(client, /URL\.revokeObjectURL/);
  assert.doesNotMatch(implementation, /dangerouslySetInnerHTML|\beval\s*\(|new Function\s*\(/);
  assert.doesNotMatch(implementation, /\bfetch\s*\(|XMLHttpRequest|WebSocket|sendBeacon/);
  assert.doesNotMatch(implementation, /localStorage|sessionStorage|document\.cookie/);
});

test("documents four deterministic pillars and honest manual boundaries", async () => {
  const engine = await source("app/auditoria/auditEngine.ts");
  const pillarIds = [...engine.matchAll(/id: "(hierarchy|motion|accessibility|performance)",\n\s+label:/g)].map(
    (match) => match[1],
  );

  assert.deepEqual(pillarIds, ["hierarchy", "motion", "accessibility", "performance"]);
  assert.match(engine, /Índice heurístico/);
  assert.match(engine, /no sustituye Lighthouse, lector de pantalla, pruebas de red ni revisión humana/i);
  assert.match(engine, /touch-targets[\s\S]{0,700}measuredTargets === 0 \? "info"/);
  assert.match(engine, /text-contrast[\s\S]{0,500}contrast\.checked === 0 \? "info"/);
  assert.match(engine, /WCAG 1\.4\.3/);
  assert.match(engine, /WCAG 2\.4\.7/);
  assert.match(engine, /WCAG 4\.1\.2/);
});

test("ships route-scoped mobile, focus and reduced-motion safeguards", async () => {
  const css = await source("app/auditoria/auditoria.module.css");

  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*2\.75rem/);
  assert.match(css, /@media \(max-width:\s*640px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /animation-duration:\s*0\.001ms\s*!important/);
  assert.match(css, /@media \(forced-colors:\s*active\)/);
});

test("contains no unfinished markers, prices or unsupported certification claims", async () => {
  const files = await Promise.all([
    source("app/auditoria/page.tsx"),
    source("app/auditoria/AuditClient.tsx"),
    source("app/auditoria/auditEngine.ts"),
    source("app/auditoria/auditoria.module.css"),
  ]);
  const corpus = files.join("\n");

  assert.doesNotMatch(corpus, /\b(?:TODO|FIXME)\b/);
  assert.doesNotMatch(corpus, /\b(?:EUR|USD)\b|[$€]\s*\d|\d\s*€/);
  assert.doesNotMatch(corpus, /certificad[oa]|garantiza (?:WCAG|AA)|100% accesible/i);
});
