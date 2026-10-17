// Partes da interface que não são o currículo: tema claro/escuro, abas do celular e idioma.
import { DICTS, LANGS, pageLang, t } from "../i18n/index.js";
import { $, autosizeAll } from "./dom.js";

const LANG_KEY = "cv-legivel-idioma";
const saveLang = (lang) => {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* sem armazenamento, a escolha vale só nesta visita */
  }
};

/* ---------- tema ---------- */
const THEME_KEY = "cv-legivel-tema";
const darkMq = matchMedia("(prefers-color-scheme: dark)");
const currentTheme = () => document.documentElement.dataset.theme || (darkMq.matches ? "dark" : "light");

function renderThemeBtn() {
  const dark = currentTheme() === "dark";
  $("themeBtn").textContent = t(dark ? "themeLight" : "themeDark");
  $("themeBtn").setAttribute("aria-label", t(dark ? "themeLightAria" : "themeDarkAria"));
}

export function bindTheme() {
  $("themeBtn").addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* sem armazenamento, o tema vale só nesta visita */
    }
    renderThemeBtn();
  });
  darkMq.addEventListener("change", renderThemeBtn);
  renderThemeBtn();
}

/* ---------- abas Editar / Prévia (só aparecem em telas estreitas) ---------- */
// Padrão ARIA de abas: setas esquerda/direita trocam de aba, Home/End vão para a primeira/última.
export function bindTabs() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  // no computador as abas ficam escondidas; lá, formulário e prévia não devem ser anunciados como "painel de aba"
  const narrow = matchMedia("(max-width: 979px)");
  const syncRoles = () =>
    ["form", "preview"].forEach((id) => {
      if (narrow.matches) $(id).setAttribute("role", "tabpanel");
      else $(id).removeAttribute("role");
    });
  narrow.addEventListener("change", syncRoles);
  syncRoles();
  const select = (tab, focus = false) => {
    $("grid").dataset.view = tab.dataset.view;
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
    });
    if (focus) tab.focus();
    autosizeAll();
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      select(tab);
      scrollTo({ top: 0 });
    });
    tab.addEventListener("keydown", (e) => {
      const next = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (next === undefined) return;
      e.preventDefault();
      select(tabs[(next + tabs.length) % tabs.length], true);
    });
  });
}

/* ---------- seletor de idioma ---------- */
// Os links levam às páginas /, /en/ e /es/; aqui só guardamos a escolha, para a raiz do site
// abrir direto no idioma escolhido nas próximas visitas (ver boot.js).
export function bindLangLinks() {
  document
    .querySelectorAll("[data-lang-link]")
    .forEach((a) => a.addEventListener("click", () => saveLang(a.dataset.langLink)));
}

/** Primeiro idioma do navegador que o site oferece ("en-US" → "en"), ou "" se nenhum. */
export function browserLang(languages = navigator.languages || [navigator.language]) {
  return languages.map((l) => String(l).slice(0, 2).toLowerCase()).find((l) => LANGS.includes(l)) || "";
}

/**
 * Quem ainda não escolheu um idioma e usa o navegador em outro idioma do site vê um aviso,
 * escrito NO IDIOMA DO NAVEGADOR, com o link para a página certa. Não redireciona sozinho:
 * a pessoa decide, e buscadores (que costumam usar navegador em inglês) indexam cada página.
 * "Agora não" guarda o idioma atual como escolha, para o aviso não voltar.
 */
export function suggestLang() {
  let saved;
  try {
    saved = localStorage.getItem(LANG_KEY);
  } catch {
    return; // sem armazenamento, não daria para lembrar a resposta: melhor não insistir
  }
  const page = pageLang();
  const target = browserLang();
  if (saved || !target || target === page) return;

  const box = $("langSuggest");
  box.lang = DICTS[target].meta.htmlLang;
  const text = Object.assign(document.createElement("p"), { textContent: t("suggest", {}, target) });
  const go = Object.assign(document.createElement("a"), {
    className: "btn-primary small",
    href: document.querySelector(`[data-lang-link="${target}"]`).getAttribute("href"),
    hreflang: DICTS[target].meta.htmlLang,
    textContent: t("suggestGo", {}, target)
  });
  go.addEventListener("click", () => saveLang(target));
  const close = Object.assign(document.createElement("button"), {
    type: "button",
    className: "btn small",
    textContent: t("suggestClose", {}, target)
  });
  close.addEventListener("click", () => {
    saveLang(page);
    box.hidden = true;
  });
  box.replaceChildren(text, go, close);
  box.hidden = false;
}
