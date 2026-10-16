// UF e cidade: a lista de municípios vem da API pública do IBGE, carregada conforme a UF.
// O IBGE recebe só a sigla da UF escolhida; nenhum dado do currículo sai do navegador.
import { esc } from "../format.js";
import { UFS } from "../state.js";
import { $, status } from "./dom.js";
import { app, changed } from "./store.js";

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

export async function renderCities() {
  const sel = $("cidade");
  const uf = app.state.uf;
  sel.disabled = true;
  if (!uf) {
    sel.innerHTML = `<option value="">Escolha a UF primeiro</option>`;
    return;
  }
  sel.innerHTML = `<option value="">Carregando cidades…</option>`;
  try {
    const list = await loadCities(uf);
    if (app.state.uf !== uf) return; // a UF mudou enquanto carregava
    // mantém uma cidade salva que não esteja na lista (ex.: digitada sem acento numa versão antiga)
    const city = app.state.cidade;
    const opts = city && !list.includes(city) ? [city, ...list] : list;
    sel.innerHTML = `<option value="">Selecione a cidade</option>${opts.map((c) => `<option>${esc(c)}</option>`).join("")}`;
    sel.value = city;
    sel.disabled = false;
  } catch {
    if (app.state.uf !== uf) return;
    sel.innerHTML = `<option value="">Não foi possível carregar</option>`;
    status("Não foi possível carregar a lista de cidades. Verifique a conexão e recarregue a página.");
  }
}

export function fillLocation() {
  $("uf").value = app.state.uf;
  renderCities();
}

export function bindLocation() {
  $("uf").innerHTML =
    `<option value="">Selecione</option>${UFS.map(([s, n]) => `<option value="${s}">${s} — ${n}</option>`).join("")}`;
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
