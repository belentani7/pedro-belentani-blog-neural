import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.BLOG_BASE_URL ?? "http://localhost:3000";
const executablePath = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean).find(existsSync);

assert.ok(executablePath, "Google Chrome no está instalado en una ruta conocida.");

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox"],
});

async function verifiedPage(context, viewport) {
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.setViewportSize(viewport);
  await page.goto(`${baseUrl}/auditoria`, { waitUntil: "domcontentloaded" });
  await page.getByRole("status").filter({ hasText: /completada/i }).waitFor();
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(consoleErrors, []);
  return { page, pageErrors, consoleErrors };
}

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const { page, pageErrors, consoleErrors } = await verifiedPage(desktop, {
    width: 1440,
    height: 900,
  });

  assert.match(await page.title(), /FRONTEND PROOF · Autoauditoría local/i);
  assert.equal(await page.locator("h1").count(), 1);
  assert.equal(await page.locator("progress").count(), 4);
  assert.equal(await page.locator("li[data-status]").count(), 23);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    false,
  );

  await page.keyboard.press("Tab");
  assert.match(await page.evaluate(() => document.activeElement?.textContent ?? ""), /Saltar al espacio/i);
  const focusStyle = await page.evaluate(() => {
    const style = getComputedStyle(document.activeElement);
    return { width: style.outlineWidth, style: style.outlineStyle };
  });
  assert.notEqual(focusStyle.style, "none");
  assert.notEqual(focusStyle.width, "0px");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => location.hash), "#audit-workspace");

  const accessibilityFilter = page.getByRole("button", { name: "Accesibilidad", exact: true });
  await accessibilityFilter.click();
  assert.equal(await accessibilityFilter.getAttribute("aria-pressed"), "true");
  assert.equal(await page.locator("li[data-status]").count(), 8);
  assert.equal(await page.locator('[role="group"][aria-label="Filtrar hallazgos"] button[aria-pressed="true"]').count(), 1);
  await page.getByRole("button", { name: "Todo", exact: true }).click();

  const hostileRequests = [];
  const writes = [];
  page.on("request", (request) => {
    if (request.url().includes("frontend-proof.invalid")) hostileRequests.push(request.url());
    if (request.method() !== "GET") writes.push(`${request.method()} ${request.url()}`);
  });
  const storageBefore = await page.evaluate(() => ({
    local: localStorage.length,
    session: sessionStorage.length,
    cookie: document.cookie,
  }));
  const hostileHtml = `<!doctype html><html><head><title>Prueba hostil</title></head><body><script>window.__frontendProofExecuted = true</script><main><h1 id="repeat">Uno</h1><h3 id="repeat">Salto</h3><img src="https://frontend-proof.invalid/image.png"><iframe src="https://frontend-proof.invalid/frame"></iframe><input></main></body></html>`;
  await page.locator("#audit-source").fill(hostileHtml);
  await page.getByRole("button", { name: "Analizar HTML pegado" }).click();
  await page.getByRole("status").filter({ hasText: /Fuente pegada analizada/i }).waitFor();
  await page.waitForTimeout(400);

  assert.equal(await page.evaluate(() => window.__frontendProofExecuted), undefined);
  assert.deepEqual(hostileRequests, []);
  assert.deepEqual(writes, []);
  assert.deepEqual(
    await page.evaluate(() => ({
      local: localStorage.length,
      session: sessionStorage.length,
      cookie: document.cookie,
    })),
    storageBefore,
  );
  assert.match(await page.locator("body").innerText(), /HTML pegado en esta sesión/i);

  await page.getByRole("button", { name: "Copiar informe" }).click();
  await page.getByRole("status").filter({ hasText: /Informe copiado/i }).waitFor();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  assert.match(clipboard, /^FRONTEND PROOF — INFORME LOCAL/m);
  assert.match(clipboard, /JERARQUÍA —/);
  assert.match(clipboard, /MOVIMIENTO —/);
  assert.match(clipboard, /ACCESIBILIDAD —/);
  assert.match(clipboard, /RENDIMIENTO —/);
  assert.match(clipboard, /no sustituye Lighthouse/i);
  assert.doesNotMatch(clipboard, /__frontendProofExecuted|frontend-proof\.invalid/);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Descargar .txt" }).click();
  const download = await downloadPromise;
  assert.match(download.suggestedFilename(), /^frontend-proof-[a-z0-9-]+\.txt$/);
  const downloadPath = await download.path();
  assert.ok(downloadPath);
  const downloadedReport = await readFile(downloadPath, "utf8");
  assert.equal(downloadedReport.replace(/\r\n/g, "\n"), clipboard.replace(/\r\n/g, "\n"));

  await page.locator('input[type="file"]').setInputFiles({
    name: "demasiado-grande.html",
    mimeType: "text/html",
    buffer: Buffer.alloc(2 * 1024 * 1024 + 1, 60),
  });
  await page.getByRole("alert").filter({ hasText: /supera el límite local de 2 MB/i }).waitFor();
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(consoleErrors, []);

  await page.reload({ waitUntil: "domcontentloaded" });
  await page.getByRole("status").filter({ hasText: /completada/i }).waitFor();
  assert.equal(await page.locator("#audit-source").inputValue(), "");
  await desktop.close();

  for (const width of [390, 320]) {
    const mobile = await browser.newContext({
      viewport: { width, height: 844 },
      reducedMotion: "no-preference",
    });
    const { page: mobilePage } = await verifiedPage(mobile, { width, height: 844 });
    assert.equal(
      await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
      false,
    );
    const buttonSizes = await mobilePage.getByRole("button").evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return { width: rect.width, height: rect.height };
      }),
    );
    assert.ok(buttonSizes.every(({ width: targetWidth, height }) => targetWidth >= 44 && height >= 44));
    await mobile.close();
  }

  const reduced = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    reducedMotion: "reduce",
  });
  const { page: reducedPage } = await verifiedPage(reduced, { width: 1280, height: 800 });
  const introStyle = await reducedPage.locator("h1").evaluate((heading) => {
    const style = getComputedStyle(heading);
    return { opacity: style.opacity, transform: style.transform, visibility: style.visibility };
  });
  assert.equal(introStyle.opacity, "1");
  assert.equal(introStyle.transform, "none");
  assert.equal(introStyle.visibility, "visible");
  await reduced.close();

  console.log(JSON.stringify({
    route: "pass",
    findings: 23,
    keyboard: "pass",
    privacy: "pass",
    report: "pass",
    mobile: [390, 320],
    reducedMotion: "pass",
  }));
} finally {
  await browser.close();
}
