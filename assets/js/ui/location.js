// Local da pessoa.
// Português: UF + cidade, com a lista de municípios da API pública do IBGE (o IBGE recebe só a sigla da UF).
// Inglês/espanhol: país (lista gerada pelo navegador, com nomes no idioma da página) + cidade livre.
import { esc } from "../format.js";
import { countries, pageLang, t } from "../i18n/index.js";
import { UFS } from "../state.js";
import { $, status } from "./dom.js";
import { app, changed } from "./store.js";

const isPt = pageLang() === "pt";
const cache = {};

async function loadCities(uf) {
  if (!cache[uf]) {
    const r = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    if (!r.ok) throw new Error(`IBGE ${r.status}`);
    const data = await r.json();
    if (!Array.isArray(data)) throw new Error("Resposta inesperada do IBGE");
    cache[uf] = data.map((c) => String(c.nome)).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }
  return cache[uf];
}

async function renderCities() {
  const sel = $("cidade");
  const uf = app.state.uf;
  sel.disabled = true;
  if (!uf) {
    sel.innerHTML = `<option value="">${esc(t("ufFirst"))}</option>`;
    return;
  }
  sel.innerHTML = `<option value="">${esc(t("loadingCities"))}</option>`;
  try {
    const list = await loadCities(uf);
    if (app.state.uf !== uf) return; // a UF mudou enquanto carregava
    // mantém uma cidade salva que não esteja na lista (ex.: digitada sem acento numa versão antiga)
    const city = app.state.cidade;
    const opts = city && !list.includes(city) ? [city, ...list] : list;
    sel.innerHTML = `<option value="">${esc(t("selectCity"))}</option>${opts.map((c) => `<option>${esc(c)}</option>`).join("")}`;
    sel.value = city;
    sel.disabled = false;
  } catch {
    if (app.state.uf !== uf) return;
    sel.innerHTML = `<option value="">${esc(t("loadFail"))}</option>`;
    status(t("stCities"));
  }
}

/** Copia o local do estado para os campos (início, importação, "Limpar tudo"). */
export function fillLocation() {
  if (!isPt) return; // país e cidade das páginas internacionais são campos simples (data-k)
  $("uf").value = app.state.uf;
  renderCities();
}

export function bindLocation() {
  if (!isPt) {
    $("pais").innerHTML =
      `<option value="">${esc(t("selectCountry"))}</option>` +
      countries()
        .map(([code, name]) => `<option value="${code}">${esc(name)}</option>`)
        .join("");
    return;
  }
  $("uf").innerHTML =
    `<option value="">${esc(t("selectUf"))}</option>` +
    UFS.map(([s, n]) => `<option value="${s}">${s} — ${esc(n)}</option>`).join("");
  $("uf").addEventListener("change", (e) => {
    app.state.uf = e.target.value;
    app.state.cidade = "";
    changed();
    renderCities();
  });
  $("cidade").addEventListener("change", (e) => {
    app.state.cidade = e.target.value;
    changed();
  });
}
