// Formulário: liga os campos ao estado, desenha as listas de experiência/formação e valida.
import { FORM_LABEL, MODALIDADES, SITUACOES } from "../cv-i18n.js";
import { cleanUrl, esc, fmtDate, fmtPhone } from "../format.js";
import { dateErrors, MAX_LENGTH, sanitize, VALIDATE } from "../rules.js";
import { EMPTY_EDU, EMPTY_EXP } from "../state.js";
import { $, autosize, autosizeAll, flash, maskInput, setError } from "./dom.js";
import { app, changed } from "./store.js";

const maxFor = (f) => MAX_LENGTH[f] || MAX_LENGTH.default;
const isDateField = (f) => f === "inicio" || f === "fim";
const fimLabel = (status) => (status === "andamento" ? "Previsão de conclusão" : "Conclusão");

/** Remove caracteres proibidos do campo e avisa a pessoa. `field` é "nome" ou "exp.cargo". */
function applyRule(el, field) {
  const { value, removed, msg } = sanitize(el.value, field);
  if (!removed) return;
  const pos = Math.max(0, (el.selectionStart ?? value.length) - (el.value.length - value.length));
  el.value = value;
  try {
    el.setSelectionRange(pos, pos);
  } catch {
    /* campos type=email não aceitam seleção */
  }
  flash(el, msg);
}

function validateSimple(el) {
  const fn = VALIDATE[el.dataset.k];
  if (fn) setError(el, fn(el.value.trim()));
}

/* ---------- campos simples (data-k) ---------- */
export function bindSimple() {
  document.querySelectorAll("[data-k]").forEach((el) => {
    el.maxLength = maxFor(el.dataset.k);
    el.addEventListener("input", () => {
      if (el.dataset.k === "telefone") maskInput(el, fmtPhone);
      else applyRule(el, el.dataset.k);
      if (el.dataset.error) validateSimple(el); // o erro some assim que for corrigido
      app.state[el.dataset.k] = el.value;
      changed();
    });
    el.addEventListener("change", () => {
      if (el.dataset.k === "linkedin" || el.dataset.k === "site") {
        el.value = cleanUrl(el.value);
        app.state[el.dataset.k] = el.value;
        changed();
      }
      validateSimple(el);
    });
  });
  $("formacaoPrimeiro").addEventListener("change", (e) => {
    app.state.formacaoPrimeiro = e.target.checked;
    changed();
  });
}

/** Copia o estado para os campos simples (início, importação, "Limpar tudo"). */
export function fillSimple() {
  document.querySelectorAll("[data-k]").forEach((el) => {
    const v = app.state[el.dataset.k] || "";
    el.value = el.dataset.k === "telefone" ? fmtPhone(v) : v;
    validateSimple(el);
  });
  $("formacaoPrimeiro").checked = app.state.formacaoPrimeiro;
}

/* ---------- listas de experiência e formação ---------- */
const input = (list, i, f, value, extra = "") =>
  `<input id="${list}-${i}-${f}" data-l="${list}" data-i="${i}" data-f="${f}" value="${esc(value)}" maxlength="${maxFor(f)}" ${extra}>`;
const options = (keys, labels, current) =>
  `<option value="">Não informar</option>${keys.map((k) => `<option value="${k}"${k === current ? " selected" : ""}>${labels[k]}</option>`).join("")}`;
const removeBtn = (list, i, total) =>
  total > 1 ? `<button type="button" class="remove" data-rm="${list}" data-i="${i}">Remover</button>` : "";

function expItem(x, i, total) {
  return `
    <div class="item">
      <div class="item-head"><span>Experiência ${i + 1}${i === 0 ? " · a mais recente primeiro" : ""}</span>${removeBtn("exp", i, total)}</div>
      <div class="row">
        <label>Cargo${input("exp", i, "cargo", x.cargo, 'placeholder="Ex.: Analista de Dados Júnior"')}<span class="hint">título de mercado, sem siglas internas</span></label>
        <label>Empresa${input("exp", i, "empresa", x.empresa, 'placeholder="Ex.: Supermercados Bom Preço"')}</label>
      </div>
      <div class="row">
        <label>Local${input("exp", i, "local", x.local, 'placeholder="Ex.: Curitiba, PR"')}</label>
        <label>Modalidade<select id="exp-${i}-modalidade" data-l="exp" data-i="${i}" data-f="modalidade">${options(MODALIDADES, FORM_LABEL.mod, x.modalidade)}</select></label>
      </div>
      <div class="row dates">
        <label>Início${input("exp", i, "inicio", x.inicio, 'inputmode="numeric" placeholder="MM/AAAA"')}</label>
        <label>Fim${input("exp", i, "fim", x.fim, `inputmode="numeric" placeholder="MM/AAAA"${x.atual ? " disabled" : ""}`)}</label>
        <label class="check"><input id="exp-${i}-atual" type="checkbox" data-l="exp" data-i="${i}" data-f="atual"${x.atual ? " checked" : ""}> Trabalho aqui atualmente</label>
      </div>
      <label>Conquistas <span class="hint">uma por linha: verbo de ação + o que fez + resultado com número</span>
        <textarea id="exp-${i}-bullets" rows="4" data-l="exp" data-i="${i}" data-f="bullets" maxlength="${maxFor("bullets")}" placeholder="Ex.:&#10;Automatizei 12 relatórios semanais com Python e SQL, economizando 20 horas por mês da equipe financeira&#10;Criei painéis no Power BI usados por 15 gerentes de loja para acompanhar vendas diárias&#10;Reduzi em 35% os erros de cadastro implantando validações no processo de ETL">${esc(x.bullets)}</textarea></label>
    </div>`;
}

function eduItem(x, i, total) {
  const trancado = x.status === "trancado";
  return `
    <div class="item">
      <div class="item-head"><span>Formação ${i + 1}</span>${removeBtn("edu", i, total)}</div>
      <div class="row">
        <label>Curso / grau${input("edu", i, "curso", x.curso, 'placeholder="Ex.: Bacharelado em Administração"')}<span class="hint">tipo + nome do curso</span></label>
        <label>Instituição${input("edu", i, "inst", x.inst, 'placeholder="Ex.: Universidade Federal do Paraná (UFPR)"')}<span class="hint">nome completo e sigla</span></label>
      </div>
      <div class="row dates">
        <label>Situação<select id="edu-${i}-status" data-l="edu" data-i="${i}" data-f="status">${options(SITUACOES, FORM_LABEL.status, x.status)}</select></label>
        <label>Início${input("edu", i, "inicio", x.inicio, 'inputmode="numeric" placeholder="MM/AAAA"')}</label>
        <label><span id="edu-${i}-fimlbl">${fimLabel(x.status)}</span>${input("edu", i, "fim", trancado ? "" : x.fim, `inputmode="numeric" placeholder="MM/AAAA"${trancado ? " disabled" : ""}`)}</label>
      </div>
    </div>`;
}

function validateDates(list, i) {
  const ini = $(`${list}-${i}-inicio`);
  const fim = $(`${list}-${i}-fim`);
  if (!ini || !fim) return;
  const e = dateErrors(app.state[list][i], list);
  setError(ini, e.inicio);
  setError(fim, e.fim);
}

export function renderLists() {
  const { exp, edu } = app.state;
  $("expList").innerHTML = exp.map((x, i) => expItem(x, i, exp.length)).join("");
  $("eduList").innerHTML = edu.map((x, i) => eduItem(x, i, edu.length)).join("");
  ["exp", "edu"].forEach((l) => app.state[l].forEach((_, i) => validateDates(l, i)));
  autosizeAll();
}

export function bindLists() {
  document.addEventListener("input", (e) => {
    const el = e.target;
    if (el.tagName === "TEXTAREA") autosize(el);
    if (!el.dataset.l) return;
    const { l: list, f } = el.dataset;
    const i = +el.dataset.i;
    const it = app.state[list][i];
    if (isDateField(f)) maskInput(el, fmtDate);
    else if (el.type !== "checkbox") applyRule(el, `${list}.${f}`);
    it[f] = el.type === "checkbox" ? el.checked : el.value;
    if (f === "atual") $(`exp-${i}-fim`).disabled = el.checked;
    if (f === "status") {
      $(`edu-${i}-fimlbl`).textContent = fimLabel(el.value);
      const fim = $(`edu-${i}-fim`);
      fim.disabled = el.value === "trancado";
      if (fim.disabled) fim.value = it.fim = "";
    }
    if (isDateField(f) || f === "atual" || f === "status") validateDates(list, i);
    changed();
  });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]");
    const rm = e.target.closest("[data-rm]");
    if (add) {
      const list = add.dataset.add;
      app.state[list].push(structuredClone(list === "exp" ? EMPTY_EXP : EMPTY_EDU));
      renderLists();
      changed();
      // leva o foco ao primeiro campo do item novo, para quem navega pelo teclado
      $(`${list}-${app.state[list].length - 1}-${list === "exp" ? "cargo" : "curso"}`).focus();
    }
    if (rm) {
      app.state[rm.dataset.rm].splice(+rm.dataset.i, 1);
      renderLists();
      changed();
    }
  });
}
