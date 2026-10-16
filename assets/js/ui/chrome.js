// Partes da interface que não são o currículo: tema claro/escuro e abas do celular.
import { $, autosizeAll } from "./dom.js";

/* ---------- tema ---------- */
const THEME_KEY = "cv-legivel-tema";
const darkMq = matchMedia("(prefers-color-scheme: dark)");
const currentTheme = () => document.documentElement.dataset.theme || (darkMq.matches ? "dark" : "light");

function renderThemeBtn() {
  const dark = currentTheme() === "dark";
  $("themeBtn").textContent = dark ? "☀ Tema claro" : "☾ Tema escuro";
  $("themeBtn").setAttribute("aria-label", dark ? "Mudar para o tema claro" : "Mudar para o tema escuro");
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
