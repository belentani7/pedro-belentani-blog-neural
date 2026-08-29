import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const baseUrl = process.env.BLOG_BASE_URL ?? "http://localhost:3000";
const chromeCandidates = [
  process.env.CHROME_PATH,
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
].filter(Boolean);
const executablePath = chromeCandidates.find(existsSync);

assert.ok(executablePath, "Google Chrome no está instalado en una ruta conocida.");

const browser = await chromium.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

async function openVerifiedPage(context, path = "/") {
  const page = await context.newPage();
  const pageErrors = [];
  const consoleErrors = [];
  const responseErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") {
      const location = message.location();
      consoleErrors.push(`${message.text()} @ ${location.url || path}:${location.lineNumber ?? 0}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400) responseErrors.push(`${response.status()} ${response.url()}`);
  });
  await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
  await page.locator("h1").waitFor({ state: "visible" });
  await page.waitForTimeout(500);
  assert.deepEqual(pageErrors, []);
  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(responseErrors, []);
  assert.equal(
    await page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay").count(),
    0,
  );
  return page;
}

try {
  const desktop = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const page = await openVerifiedPage(desktop);

  assert.equal(await page.title(), "La mente que no se divide — Pedro Belentani");
  assert.match(await page.locator("h1").innerText(), /Pienso con\s+todo lo que soy/i);
  assert.equal(await page.locator(".neuralHero__theme").count(), 4);
  assert.equal(await page.locator(".essay-row").count(), 6);
  assert.equal(
    await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    false,
  );

  const desktopRenderMode = (await page.locator("canvas").count()) > 0 ? "webgl" : "fallback";
  if (desktopRenderMode === "fallback") {
    await page.locator(".neuralHero__fallback").waitFor({ state: "visible" });
  }

  await page.keyboard.press("Tab");
  assert.equal(await page.evaluate(() => document.activeElement?.className), "skip-link");
  await page.keyboard.press("Enter");
  assert.equal(await page.evaluate(() => location.hash), "#ensayos");

  const toggle = page.getByRole("button", { name: /Movimiento/ });
  const motionBefore = await toggle.getAttribute("aria-pressed");
  await toggle.click();
  assert.notEqual(await toggle.getAttribute("aria-pressed"), motionBefore);

  await page.locator(".essay-row").first().click();
  await page.waitForURL("**/articulos/tecnologia-que-sabe-tocar-sin-invadir");
  assert.match(await page.locator("h1").innerText(), /tecnología que sabe tocar sin invadir/i);

  const screenshotPath = join(tmpdir(), "pedro-belentani-blog-browser.png");
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.locator("h1").waitFor({ state: "visible" });
  await page.screenshot({ path: screenshotPath, fullPage: false });
  await desktop.close();

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "no-preference",
  });
  const mobilePage = await openVerifiedPage(mobile);
  assert.equal(await mobilePage.locator("canvas").count(), 0);
  await mobilePage.locator(".neuralHero__fallback").waitFor({ state: "visible" });
  assert.equal(
    await mobilePage.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth),
    false,
  );
  const themeHeights = await mobilePage.locator(".neuralHero__theme").evaluateAll((elements) =>
    elements.map((element) => element.getBoundingClientRect().height),
  );
  assert.ok(themeHeights.every((height) => height >= 48));
  await mobile.close();

  const noWebgl = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  const noWebglPage = await noWebgl.newPage();
  await noWebglPage.addInitScript(() => {
    Object.defineProperty(window, "WebGLRenderingContext", {
      configurable: true,
      value: undefined,
    });
    Object.defineProperty(window, "WebGL2RenderingContext", {
      configurable: true,
      value: undefined,
    });
  });
  await noWebglPage.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await noWebglPage.locator("h1").waitFor({ state: "visible" });
  assert.equal(await noWebglPage.locator("canvas").count(), 0);
  await noWebglPage.locator(".neuralHero__fallback").waitFor({ state: "visible" });
  await noWebgl.close();

  const reduced = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  const reducedPage = await openVerifiedPage(reduced);
  assert.equal(await reducedPage.locator("canvas").count(), 0);
  assert.equal(await reducedPage.getByRole("button", { name: /Movimiento/ }).getAttribute("aria-pressed"), "false");
  await reduced.close();

  console.log(
    JSON.stringify({
      desktop: "pass",
      desktopRenderMode,
      keyboard: "pass",
      navigation: "pass",
      mobile: "pass",
      noWebglFallback: "pass",
      reducedMotion: "pass",
      screenshotPath,
    }),
  );
} finally {
  await browser.close();
}
