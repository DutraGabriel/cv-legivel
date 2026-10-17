// Gera as imagens do projeto a partir do site rodando localmente, com o currículo de exemplo:
//   docs/og-image.png, docs/og-image-en.png, docs/og-image-es.png (prévia em redes sociais, 1200×630)
//   docs/screenshot.png (print do README, 1440×900)
// Rode `npm run screenshots` depois de mudanças visíveis na interface. Usa o Chrome instalado.
import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { DICTS, LANG_PATH, LANGS } from "../assets/js/i18n/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

// servidor estático mínimo, no mesmo processo (nada fica rodando depois)
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const file = join(root, normalize(path.endsWith("/") ? `${path}index.html` : path));
  try {
    if (!file.startsWith(root)) throw new Error("fora do projeto");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}/`;

async function shot(browser, lang, file, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, locale: DICTS[lang].meta.htmlLang });
  // tema claro e idioma já escolhido: sem aviso de idioma na imagem
  await context.addInitScript((l) => {
    localStorage.setItem("cv-legivel-tema", "light");
    localStorage.setItem("cv-legivel-idioma", l);
  }, lang);
  const page = await context.newPage();
  await page.goto(base + LANG_PATH[lang]);
  await page.waitForSelector("#sheet .nm", { state: "attached" });
  await page.evaluate(() => document.fonts.ready);
  // na página em português, espera a lista de cidades do IBGE (senão aparece "Carregando cidades…")
  if (lang === "pt") await page.waitForSelector("#cidade:not([disabled])", { timeout: 15_000 });
  await page.screenshot({ path: join(root, file) });
  await context.close();
  console.log(`gerado ${file}`);
}

try {
  const browser = await chromium.launch({ channel: "chrome" });
  for (const lang of LANGS) await shot(browser, lang, DICTS[lang].meta.ogImage, 1200, 630);
  await shot(browser, "pt", "docs/screenshot.png", 1440, 900);
  await browser.close();
} finally {
  server.close();
}
