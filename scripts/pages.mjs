// Gera, para cada idioma, a página e o manifesto do app instalável a partir de
// templates/index.html e dos arquivos de idioma:
//   index.html e manifest.webmanifest (português), en/... (inglês) e es/... (espanhol).
// Os arquivos gerados são versionados: o GitHub Pages os serve direto, sem etapa de build.
// Rode `npm run pages` depois de mudar o modelo ou algum texto em assets/js/i18n/.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { esc } from "../assets/js/format.js";
import { DICTS, LANG_PATH, LANGS, lookup } from "../assets/js/i18n/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SITE = "https://dutragabriel.github.io/cv-legivel/";
/** Página de cada idioma: index.html, en/index.html, es/index.html. */
export const OUTPUT = Object.fromEntries(LANGS.map((l) => [l, `${LANG_PATH[l]}index.html`]));
/** Manifesto de cada idioma, ao lado da página. */
export const MANIFEST = Object.fromEntries(LANGS.map((l) => [l, `${LANG_PATH[l]}manifest.webmanifest`]));

/** Manifesto do app instalável: nome, descrição e idioma da página; abre na pasta do idioma. */
export function renderManifest(lang) {
  const { htmlLang, appDescription } = DICTS[lang].meta;
  const up = lang === "pt" ? "" : "../";
  const icon = (file, sizes, type) => ({ src: `${up}assets/icons/${file}`, sizes, type });
  const manifest = {
    name: "CV Legível",
    short_name: "CV Legível",
    description: appDescription,
    lang: htmlLang,
    start_url: "./",
    // o site inteiro, para a troca de idioma continuar dentro do app
    scope: up || "./",
    display: "standalone",
    background_color: "#e9ecf2",
    theme_color: "#2d47a8",
    icons: [
      icon("icon-192.png", "192x192", "image/png"),
      icon("icon-512.png", "512x512", "image/png"),
      icon("icon.svg", "any", "image/svg+xml")
    ]
  };
  return `${JSON.stringify(manifest, null, 2)}\n`;
}

const hreflang = () =>
  [
    ...LANGS.map((l) => `  <link rel="alternate" hreflang="${DICTS[l].meta.htmlLang}" href="${SITE}${LANG_PATH[l]}">`),
    `  <link rel="alternate" hreflang="x-default" href="${SITE}">`
  ].join("\n");

// seletor de idioma: links reais entre as três páginas (funcionam sem JavaScript)
const langNav = (lang, rootPath) => {
  const links = LANGS.map((l) => {
    const { name, htmlLang } = DICTS[l].meta;
    const current = l === lang ? ' aria-current="page"' : "";
    return `<a href="${rootPath}${LANG_PATH[l]}" hreflang="${htmlLang}" lang="${htmlLang}" data-lang-link="${l}" title="${esc(name)}"${current}><span aria-hidden="true">${l.toUpperCase()}</span><span class="sr-only">${esc(name)}</span></a>`;
  });
  return `      <nav class="langs" aria-label="${esc(DICTS[lang].ui.langNav)}">${links.join("")}</nav>`;
};

export function renderPage(lang, template = readFileSync(join(root, "templates/index.html"), "utf8")) {
  const d = DICTS[lang];
  const rootPath = lang === "pt" ? "" : "../";
  const vars = { lang, langs: LANGS.join(" "), root: rootPath, url: SITE + LANG_PATH[lang], site: SITE };
  const keep = lang === "pt" ? "pt" : "intl";
  const drop = lang === "pt" ? "intl" : "pt";
  const html = template
    .replace(
      /<!-- MODELO:[\s\S]*?-->/,
      "<!-- Gerado por scripts/pages.mjs a partir de templates/index.html. Não edite este arquivo. -->"
    )
    .replace(new RegExp(`<!--#${drop}-->[\\s\\S]*?<!--/${drop}-->\\n?`, "g"), "")
    .replace(new RegExp(`<!--[#/]${keep}-->\\n?`, "g"), "")
    .replace("{{hreflang}}", hreflang())
    .replace("{{langNav}}", langNav(lang, rootPath))
    .replace(/\{\{\{\s*([\w.]+)\s*\}\}\}/g, (m, k) => {
      const v = lookup(d, k);
      if (typeof v !== "string") throw new Error(`[${lang}] chave HTML ausente: ${k}`);
      return v;
    })
    .replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, k) => {
      const v = k in vars ? vars[k] : lookup(d, k);
      if (typeof v !== "string") throw new Error(`[${lang}] chave ausente: ${k}`);
      return esc(v);
    });
  if (/\{\{/.test(html)) throw new Error(`[${lang}] sobrou marcação {{ }} sem substituir`);
  return html;
}

// executado direto (npm run pages): grava as páginas e os manifestos
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const lang of LANGS) {
    for (const [out, content] of [
      [OUTPUT[lang], renderPage(lang)],
      [MANIFEST[lang], renderManifest(lang)]
    ]) {
      const file = join(root, out);
      mkdirSync(dirname(file), { recursive: true });
      writeFileSync(file, content);
      console.log(`gerado ${out}`);
    }
  }
}
