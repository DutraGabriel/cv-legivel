const SAMPLE = {
  nome: "Mariana Souza",
  cargo: "Desenvolvedora Back-end Pleno",
  email: "mariana.souza@email.com",
  telefone: "(48) 99999-0000",
  uf: "SC",
  cidade: "Florianópolis",
  linkedin: "linkedin.com/in/marianasouza",
  site: "github.com/marianasouza",
  resumo: "Desenvolvedora back-end com 5 anos de experiência em Python e Django, focada em APIs REST, integrações e performance de banco de dados. Liderei a migração de um monólito para serviços em AWS e reduzi o tempo médio de resposta em 40%. Busco atuar em produtos SaaS com times ágeis.",
  exp: [
    { cargo: "Desenvolvedora Back-end", empresa: "Nuvem Tech", local: "Florianópolis, SC", modalidade: "Híbrido", inicio: "03/2022", fim: "", atual: true,
      bullets: "Desenvolvi APIs REST em Django REST Framework usadas por 120 mil usuários ativos\nReduzi em 40% o tempo médio de resposta otimizando consultas PostgreSQL e adicionando cache Redis\nImplantei pipeline de CI/CD com GitHub Actions e Docker, cortando o tempo de deploy de 30 para 8 minutos" },
    { cargo: "Desenvolvedora Júnior", empresa: "Agência Pixel", local: "", modalidade: "Remoto", inicio: "01/2020", fim: "02/2022", atual: false,
      bullets: "Construí integrações com gateways de pagamento (Stripe, Pagar.me) em Python\nEscrevi testes automatizados com pytest, elevando a cobertura de 35% para 80%" }
  ],
  edu: [
    { curso: "Bacharelado em Ciência da Computação", inst: "Universidade Federal de Santa Catarina (UFSC)", status: "Concluído", inicio: "02/2015", fim: "12/2019" }
  ],
  formacaoPrimeiro: false,
  habilidades: "Back-end: Python, Django, Django REST Framework\nBanco de dados: PostgreSQL, Redis\nInfraestrutura: Docker, AWS, CI/CD\nPráticas: Git, Testes automatizados, Scrum",
  idiomas: "Português: nativo\nInglês: avançado",
  certificacoes: "AWS Certified Cloud Practitioner (2023)"
};
const EMPTY = { nome:"", cargo:"", email:"", telefone:"", uf:"", cidade:"", linkedin:"", site:"", resumo:"",
  exp:[{cargo:"",empresa:"",local:"",modalidade:"",inicio:"",fim:"",atual:false,bullets:""}],
  edu:[{curso:"",inst:"",status:"",inicio:"",fim:""}], formacaoPrimeiro:false, habilidades:"", idiomas:"", certificacoes:"" };

const KEY = "cv-legivel-v1";
let state, isExample = false;
try { const s = localStorage.getItem(KEY); if (s) state = JSON.parse(s); } catch (e) {}
if (!state) { state = structuredClone(SAMPLE); isExample = true; }

const UFS = [["AC","Acre"],["AL","Alagoas"],["AP","Amapá"],["AM","Amazonas"],["BA","Bahia"],["CE","Ceará"],["DF","Distrito Federal"],
  ["ES","Espírito Santo"],["GO","Goiás"],["MA","Maranhão"],["MT","Mato Grosso"],["MS","Mato Grosso do Sul"],["MG","Minas Gerais"],
  ["PA","Pará"],["PB","Paraíba"],["PR","Paraná"],["PE","Pernambuco"],["PI","Piauí"],["RJ","Rio de Janeiro"],["RN","Rio Grande do Norte"],
  ["RS","Rio Grande do Sul"],["RO","Rondônia"],["RR","Roraima"],["SC","Santa Catarina"],["SP","São Paulo"],["SE","Sergipe"],["TO","Tocantins"]];
const MODALIDADES = ["Presencial", "Híbrido", "Remoto"];
const SITUACOES = ["Concluído", "Em andamento", "Trancado"];

/* ---------- conversão de rascunhos salvos por versões anteriores ---------- */
// "Cidade, UF" num único campo
if (state.uf === undefined) {
  const m = /^(.*?),\s*([A-Za-z]{2})$/.exec((state.cidade || "").trim());
  const uf = m && m[2].toUpperCase();
  state.uf = uf && UFS.some(([s]) => s === uf) ? uf : "";
  if (state.uf) state.cidade = m[1].trim();
}
// "Florianópolis, SC (híbrido)" ou "Remoto" num único campo viram local + modalidade
for (const it of state.exp) {
  if (it.modalidade !== undefined) continue;
  const v = (it.local || "").trim(), find = s => MODALIDADES.find(m => m.toLowerCase() === s.toLowerCase().replace("hibrido", "híbrido"));
  const paren = /^(.*?)\s*\(([^)]+)\)$/.exec(v), alone = find(v), inParen = paren && find(paren[2]);
  it.modalidade = alone || inParen || "";
  if (alone) it.local = "";
  else if (inParen) it.local = paren[1];
}
// datas "2022-03" ou "15/03/2022" viram MM/AAAA
for (const it of [...state.exp, ...state.edu]) for (const f of ["inicio", "fim"]) {
  const v = it[f] || "", iso = /^(\d{4})-(\d{2})$/.exec(v), full = /^\d{2}\/(\d{2})\/(\d{4})$/.exec(v);
  if (iso) it[f] = `${iso[2]}/${iso[1]}`;
  else if (full) it[f] = `${full[1]}/${full[2]}`;
}
// formação sem situação: conclusão no futuro = em andamento
for (const it of state.edu) if (it.status === undefined) it.status = !it.fim ? "" : ym(it.fim) > ymNow() ? "Em andamento" : "Concluído";
if (state.formacaoPrimeiro === undefined) state.formacaoPrimeiro = false;

/* ---------- utilitários ---------- */
function $(id) { return document.getElementById(id); }
function ym(v) { const m = /^(\d{2})\/(\d{4})$/.exec(v || ""); return m ? +m[2] * 100 + +m[1] : 0; } // "03/2022" → 202203
function ymNow() { const d = new Date(); return d.getFullYear() * 100 + d.getMonth() + 1; }
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const lines = s => String(s || "").split("\n").map(l => l.replace(/^[\s•\-–*]+/, "").trim()).filter(Boolean);
// "Front-end: HTML, CSS" → rótulo em negrito + texto; em idiomas também aceita "Inglês - Avançado"
const labeled = (line, dash = false) => {
  const m = /^([^:]{1,40}):\s*(.+)$/.exec(line) || (dash && /^(.{1,30}?)\s+[-–]\s+(.+)$/.exec(line));
  return m ? { label: m[1].trim(), text: m[2].trim() } : { label: "", text: line };
};
// MM/AAAA, formatando aos poucos enquanto digita
const fmtDate = v => {
  const d = String(v || "").replace(/\D/g, "").slice(0, 6);
  return [d.slice(0, 2), d.slice(2)].filter(Boolean).join("/");
};
const isDate = v => { const m = /^(\d{2})\/\d{4}$/.exec(v || ""); return !!m && +m[1] >= 1 && +m[1] <= 12; };
// "Florianópolis, SC (Híbrido)", ou só um dos dois
const localModalidade = x => { const l = (x.local || "").trim(), m = x.modalidade || ""; return l && m ? `${l} (${m})` : l || m; };
const period = (a, b, atual) => { const i = fmtDate(a), f = atual ? "Atual" : fmtDate(b); return i && f ? `${i} – ${f}` : (i || f); };
// formação em andamento sai como "Início: 07/2025 – Previsão de conclusão: 07/2029"
const eduPeriod = x => {
  if (x.status === "Em andamento") return [x.inicio && `Início: ${x.inicio}`, x.fim && `Previsão de conclusão: ${x.fim}`].filter(Boolean).join(" – ");
  if (x.status === "Trancado") return x.inicio ? `Início: ${x.inicio}` : "";
  return period(x.inicio, x.fim, false);
};
const fimLabel = status => status === "Em andamento" ? "Previsão de conclusão" : "Conclusão";
// (48) 3333-4444 ou (48) 99618-7500, formatando aos poucos enquanto digita
const fmtPhone = v => {
  const d = String(v || "").replace(/\D/g, "").slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2), r = d.slice(2), cut = d.length === 11 ? 5 : 4;
  return r.length <= 4 ? `(${ddd}) ${r}` : `(${ddd}) ${r.slice(0, cut)}-${r.slice(cut)}`;
};
// "https://www.linkedin.com/in/fulano/?trk=x" → "linkedin.com/in/fulano"
const cleanUrl = v => String(v || "").trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/[?#].*$/, "").replace(/\/+$/, "");

function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

/* ---------- restrições de caracteres por campo ---------- */
// cada regra lista o que NÃO pode; o caractere é removido ao digitar e um aviso curto aparece abaixo do campo
const RULES = {
  nome:   { re: /[^\p{L}\s'’-]/gu,            msg: "Use apenas letras, espaço, hífen e apóstrofo." },
  cargo:  { re: /[^\p{L}\p{N}\s.+#\/()&-]/gu, msg: "Símbolo não permitido. Aceitos: . + # / - ( ) &" },
  local:  { re: /[^\p{L}\s,\/()'’.-]/gu,      msg: "Use apenas letras, vírgula, hífen e parênteses, sem números." },
  curso:  { re: /[^\p{L}\s(),.\/-]/gu,        msg: "Use apenas letras e - ( ) , . /" },
  livre:  { re: /[<>{}\[\]\p{Extended_Pictographic}]/gu, msg: "Caractere não permitido neste campo." },
  texto:  { re: /\p{Extended_Pictographic}/gu, msg: "Emojis não são lidos corretamente por sistemas de triagem." },
  link:   { re: /\s/g,                        msg: "Endereços não têm espaços." }
};
const FIELD_RULE = {
  nome: "nome", cargo: "cargo", email: "link", linkedin: "link", site: "link",
  resumo: "texto", habilidades: "texto", idiomas: "texto", certificacoes: "texto",
  "exp.cargo": "cargo", "exp.empresa": "livre", "exp.local": "local", "exp.bullets": "texto",
  "edu.curso": "curso", "edu.inst": "livre"
};
const ruleFor = el => RULES[FIELD_RULE[el.dataset.k || `${el.dataset.l}.${el.dataset.f}`]];
function applyRule(el) {
  const rule = ruleFor(el); if (!rule) return;
  const before = el.value, cleaned = before.replace(rule.re, "");
  if (cleaned === before) return;
  const pos = Math.max(0, (el.selectionStart ?? cleaned.length) - (before.length - cleaned.length));
  el.value = cleaned;
  try { el.setSelectionRange(pos, pos); } catch (e) {}
  flash(el, rule.msg);
}

/* ---------- mensagens abaixo do campo ---------- */
// erro: fica até ser corrigido; flash: aviso que some sozinho
function msgEl(el) {
  const label = el.closest("label");
  let m = label.querySelector(".field-msg");
  if (!m) { m = document.createElement("span"); m.className = "field-msg"; m.id = `${el.id}-msg`; m.setAttribute("aria-live", "polite"); el.after(m); el.setAttribute("aria-describedby", m.id); }
  return m;
}
function setError(el, msg) {
  el.toggleAttribute("aria-invalid", !!msg);
  el.dataset.error = msg || "";
  if (msg || el.closest("label").querySelector(".field-msg")) { const m = msgEl(el); m.textContent = msg || ""; m.classList.toggle("is-error", !!msg); }
}
function flash(el, msg) {
  const m = msgEl(el);
  m.textContent = msg; m.classList.remove("is-error");
  clearTimeout(el._flash);
  el._flash = setTimeout(() => { m.textContent = el.dataset.error || ""; m.classList.toggle("is-error", !!el.dataset.error); }, 3500);
}

/* ---------- validações ---------- */
const VALIDATE = {
  email: v => !v || /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v) ? "" : "E-mail incompleto. Ex.: nome.sobrenome@email.com",
  linkedin: v => !v || /^linkedin\.com\/in\/[^/\s]+$/i.test(v) ? "" : "Use o endereço do perfil: linkedin.com/in/seu-perfil",
  telefone: v => !v || v.replace(/\D/g, "").length >= 10 ? "" : "Telefone incompleto: informe DDD + número."
};
function validateSimple(el) {
  const fn = VALIDATE[el.dataset.k];
  if (fn) setError(el, fn(el.value.trim()));
}
// datas: mês válido, fim depois do início, nada no futuro que não deveria estar
function validateDates(list, i) {
  const x = state[list][i], ini = $(`${list}-${i}-inicio`), fim = $(`${list}-${i}-fim`);
  if (!ini || !fim) return;
  const bad = v => v.length === 7 && !isDate(v), now = ymNow();
  let eIni = bad(x.inicio) ? "Mês inválido: use de 01 a 12." : "";
  let eFim = !fim.disabled && bad(x.fim) ? "Mês inválido: use de 01 a 12." : "";
  if (!eIni && isDate(x.inicio) && ym(x.inicio) > now) eIni = "O início não pode estar no futuro.";
  if (!eFim && !fim.disabled && isDate(x.inicio) && isDate(x.fim) && ym(x.fim) < ym(x.inicio)) eFim = "O fim não pode ser antes do início.";
  if (!eFim && !fim.disabled && isDate(x.fim) && ym(x.fim) > now) {
    if (list === "exp") eFim = "Data no futuro. Se ainda trabalha aqui, marque \"Trabalho aqui atualmente\".";
    else if (x.status !== "Em andamento") eFim = "Conclusão no futuro? Mude a situação para \"Em andamento\".";
  }
  setError(ini, eIni); setError(fim, eFim);
}
const validateAllDates = () => ["exp", "edu"].forEach(l => state[l].forEach((_, i) => validateDates(l, i)));

/* ---------- formulário ---------- */
function bindSimple() {
  document.querySelectorAll("[data-k]").forEach(el => {
    el.addEventListener("input", () => {
      if (el.dataset.k === "telefone") maskInput(el, fmtPhone); else applyRule(el);
      if (el.dataset.error) validateSimple(el); // some o erro assim que for corrigido
      state[el.dataset.k] = el.value; changed();
    });
    el.addEventListener("change", () => {
      if (el.dataset.k === "linkedin" || el.dataset.k === "site") { el.value = cleanUrl(el.value); state[el.dataset.k] = el.value; changed(); }
      validateSimple(el);
    });
  });
  $("formacaoPrimeiro").addEventListener("change", e => { state.formacaoPrimeiro = e.target.checked; changed(); });
  bindValues();
}
function bindValues() {
  document.querySelectorAll("[data-k]").forEach(el => {
    el.value = el.dataset.k === "telefone" ? fmtPhone(state.telefone) : state[el.dataset.k] || "";
    validateSimple(el);
  });
  $("formacaoPrimeiro").checked = !!state.formacaoPrimeiro;
}
// reaplica a máscara mantendo o cursor depois do mesmo dígito
function maskInput(el, fmt) {
  const digitsBefore = el.value.slice(0, el.selectionStart).replace(/\D/g, "").length;
  el.value = fmt(el.value);
  let pos = 0, n = 0;
  while (pos < el.value.length && n < digitsBefore) { if (/\d/.test(el.value[pos])) n++; pos++; }
  el.setSelectionRange(pos, pos);
}
function renderLists() {
  $("expList").innerHTML = state.exp.map((x, i) => `
    <div class="item">
      <div class="item-head"><span>Experiência ${i + 1}${i === 0 ? " · a mais recente primeiro" : ""}</span>${state.exp.length > 1 ? `<button type="button" class="remove" data-rm="exp" data-i="${i}">Remover</button>` : ""}</div>
      <div class="row">
        <label>Cargo<input id="exp-${i}-cargo" data-l="exp" data-i="${i}" data-f="cargo" value="${esc(x.cargo)}" placeholder="Ex.: Analista de Dados Júnior"><span class="hint">título de mercado, sem siglas internas</span></label>
        <label>Empresa<input id="exp-${i}-empresa" data-l="exp" data-i="${i}" data-f="empresa" value="${esc(x.empresa)}" placeholder="Ex.: Supermercados Bom Preço"></label>
      </div>
      <div class="row">
        <label>Local<input id="exp-${i}-local" data-l="exp" data-i="${i}" data-f="local" value="${esc(x.local)}" placeholder="Ex.: Curitiba, PR"></label>
        <label>Modalidade<select id="exp-${i}-modalidade" data-l="exp" data-i="${i}" data-f="modalidade">
          <option value="">Não informar</option>${MODALIDADES.map(m => `<option${m === x.modalidade ? " selected" : ""}>${m}</option>`).join("")}
        </select></label>
      </div>
      <div class="row dates">
        <label>Início<input id="exp-${i}-inicio" inputmode="numeric" placeholder="MM/AAAA" data-l="exp" data-i="${i}" data-f="inicio" value="${esc(x.inicio)}"></label>
        <label>Fim<input id="exp-${i}-fim" inputmode="numeric" placeholder="MM/AAAA" data-l="exp" data-i="${i}" data-f="fim" value="${esc(x.fim)}" ${x.atual ? "disabled" : ""}></label>
        <label class="check"><input id="exp-${i}-atual" type="checkbox" data-l="exp" data-i="${i}" data-f="atual" ${x.atual ? "checked" : ""}> Trabalho aqui atualmente</label>
      </div>
      <label>Conquistas <span class="hint">uma por linha: verbo de ação + o que fez + resultado com número</span>
        <textarea id="exp-${i}-bullets" rows="4" data-l="exp" data-i="${i}" data-f="bullets" placeholder="Ex.:&#10;Automatizei 12 relatórios semanais com Python e SQL, economizando 20 horas por mês da equipe financeira&#10;Criei painéis no Power BI usados por 15 gerentes de loja para acompanhar vendas diárias&#10;Reduzi em 35% os erros de cadastro implantando validações no processo de ETL">${esc(x.bullets)}</textarea></label>
    </div>`).join("");
  $("eduList").innerHTML = state.edu.map((x, i) => `
    <div class="item">
      <div class="item-head"><span>Formação ${i + 1}</span>${state.edu.length > 1 ? `<button type="button" class="remove" data-rm="edu" data-i="${i}">Remover</button>` : ""}</div>
      <div class="row">
        <label>Curso / grau<input id="edu-${i}-curso" data-l="edu" data-i="${i}" data-f="curso" value="${esc(x.curso)}" placeholder="Ex.: Bacharelado em Administração"><span class="hint">tipo + nome do curso</span></label>
        <label>Instituição<input id="edu-${i}-inst" data-l="edu" data-i="${i}" data-f="inst" value="${esc(x.inst)}" placeholder="Ex.: Universidade Federal do Paraná (UFPR)"><span class="hint">nome completo e sigla</span></label>
      </div>
      <div class="row dates">
        <label>Situação<select id="edu-${i}-status" data-l="edu" data-i="${i}" data-f="status">
          <option value="">Não informar</option>${SITUACOES.map(s => `<option${s === x.status ? " selected" : ""}>${s}</option>`).join("")}
        </select></label>
        <label>Início<input id="edu-${i}-inicio" inputmode="numeric" placeholder="MM/AAAA" data-l="edu" data-i="${i}" data-f="inicio" value="${esc(x.inicio)}"></label>
        <label><span id="edu-${i}-fimlbl">${fimLabel(x.status)}</span><input id="edu-${i}-fim" inputmode="numeric" placeholder="MM/AAAA" data-l="edu" data-i="${i}" data-f="fim" value="${esc(x.status === "Trancado" ? "" : x.fim)}" ${x.status === "Trancado" ? "disabled" : ""}></label>
      </div>
    </div>`).join("");
  validateAllDates();
  autosizeAll();
}
// caixas de texto crescem junto com o conteúdo, sem barra de rolagem interna
function autosize(el) {
  if (!el.offsetParent) return; // escondida (aba de prévia no celular)
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
}
const autosizeAll = () => document.querySelectorAll("textarea").forEach(autosize);
document.addEventListener("input", e => { if (e.target.tagName === "TEXTAREA") autosize(e.target); });
addEventListener("resize", autosizeAll);

/* ---------- abas Editar / Prévia (só aparecem em telas estreitas) ---------- */
document.querySelectorAll(".tabs [data-view]").forEach(tab => tab.addEventListener("click", () => {
  $("grid").dataset.view = tab.dataset.view;
  document.querySelectorAll(".tabs [data-view]").forEach(t => t.setAttribute("aria-selected", t === tab));
  scrollTo({ top: 0 });
  autosizeAll();
}));
const isDateField = el => el.dataset.f === "inicio" || el.dataset.f === "fim";

/* ---------- UF e cidade (lista de municípios do IBGE) ---------- */
const cityCache = {};
async function loadCities(uf) {
  if (!cityCache[uf]) {
    const r = await fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
    if (!r.ok) throw new Error(`IBGE ${r.status}`);
    cityCache[uf] = (await r.json()).map(c => c.nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }
  return cityCache[uf];
}
async function renderCities() {
  const sel = $("cidade"), uf = state.uf;
  sel.disabled = true;
  if (!uf) { sel.innerHTML = `<option value="">Escolha a UF primeiro</option>`; return; }
  sel.innerHTML = `<option value="">Carregando cidades…</option>`;
  try {
    const list = await loadCities(uf);
    if (state.uf !== uf) return; // a UF mudou enquanto carregava
    // mantém uma cidade salva que não esteja na lista (ex.: digitada sem acento na versão antiga)
    const opts = state.cidade && !list.includes(state.cidade) ? [state.cidade, ...list] : list;
    sel.innerHTML = `<option value="">Selecione a cidade</option>` + opts.map(c => `<option>${esc(c)}</option>`).join("");
    sel.value = state.cidade || "";
    sel.disabled = false;
  } catch (e) {
    if (state.uf !== uf) return;
    sel.innerHTML = `<option value="">Não foi possível carregar</option>`;
    $("status").textContent = "Não foi possível carregar a lista de cidades. Verifique a conexão e recarregue a página.";
  }
}
function bindLocal() {
  $("uf").innerHTML = `<option value="">Selecione</option>` + UFS.map(([s, n]) => `<option value="${s}">${s} — ${n}</option>`).join("");
  $("uf").value = state.uf || "";
  renderCities();
}
$("uf").addEventListener("change", e => { state.uf = e.target.value; state.cidade = ""; changed(); renderCities(); });
$("cidade").addEventListener("change", e => { state.cidade = e.target.value; changed(); });

document.addEventListener("input", e => {
  const el = e.target; if (!el.dataset.l) return;
  const list = el.dataset.l, i = +el.dataset.i, it = state[list][i];
  if (isDateField(el)) maskInput(el, fmtDate); else if (el.type !== "checkbox") applyRule(el);
  it[el.dataset.f] = el.type === "checkbox" ? el.checked : el.value;
  if (el.dataset.f === "atual") $(`exp-${i}-fim`).disabled = el.checked;
  if (el.dataset.f === "status") {
    $(`edu-${i}-fimlbl`).textContent = fimLabel(el.value);
    const fim = $(`edu-${i}-fim`), trancado = el.value === "Trancado";
    fim.disabled = trancado;
    if (trancado) { fim.value = ""; it.fim = ""; }
  }
  if (isDateField(el) || ["atual", "status"].includes(el.dataset.f)) validateDates(list, i);
  changed();
});
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]"), rm = e.target.closest("[data-rm]");
  if (add) { state[add.dataset.add].push(add.dataset.add === "exp" ? structuredClone(EMPTY.exp[0]) : structuredClone(EMPTY.edu[0])); renderLists(); changed(); }
  if (rm) { state[rm.dataset.rm].splice(+rm.dataset.i, 1); renderLists(); changed(); }
});

/* ---------- modelo comum: a prévia e o PDF saem da mesma estrutura ---------- */
function model() {
  const s = state;
  const local = [s.cidade, s.uf].map(v => (v || "").trim()).filter(Boolean).join(", ");
  const contato = [local, fmtPhone(s.telefone), s.email, s.linkedin, s.site].map(v => (v || "").trim()).filter(Boolean);
  const sections = [];
  if (s.resumo.trim()) sections.push({ t: "Resumo profissional", paras: [s.resumo.trim()] });
  const exp = s.exp.filter(x => x.cargo || x.empresa).map(x => ({
    title: x.cargo.trim(),
    meta: [x.empresa, localModalidade(x), period(x.inicio, x.fim, x.atual)].map(v => (v || "").trim()).filter(Boolean).join(" | "),
    bullets: lines(x.bullets)
  }));
  const edu = s.edu.filter(x => x.curso || x.inst).map(x => ({
    title: x.curso.trim(),
    meta: [x.inst, x.status, eduPeriod(x)].map(v => (v || "").trim()).filter(Boolean).join(" | "),
    bullets: []
  }));
  const expSec = exp.length && { t: "Experiência profissional", jobs: exp };
  const eduSec = edu.length && { t: "Formação acadêmica", jobs: edu };
  sections.push(...(s.formacaoPrimeiro ? [eduSec, expSec] : [expSec, eduSec]).filter(Boolean));
  // habilidades: "Categoria: itens" em linhas viram lista; uma linha só, sem categoria, vira parágrafo
  const hab = lines(s.habilidades).map(l => labeled(l));
  const skills = hab.flatMap(h => h.text.split(/[,;]/)).map(v => v.trim()).filter(Boolean);
  if (hab.length === 1 && !hab[0].label) sections.push({ t: "Habilidades", paras: [skills.join(", ")] });
  else if (hab.length) sections.push({ t: "Habilidades", list: hab });
  const idi = lines(s.idiomas).map(l => labeled(l, true));
  if (idi.length) sections.push({ t: "Idiomas", list: idi });
  // certificações não usam rótulo: nomes como "Microsoft Certified: ..." têm dois-pontos
  const cert = lines(s.certificacoes).map(text => ({ label: "", text }));
  if (cert.length) sections.push({ t: "Certificações", list: cert });
  return { nome: s.nome.trim(), cargo: s.cargo.trim(), contato: contato.join(" | "), sections, skills };
}

function renderPreview() {
  const m = model();
  const li = it => `<li>${it.label ? `<b>${esc(it.label)}:</b> ` : ""}${esc(it.text)}</li>`;
  let h = `<p class="nm">${esc(m.nome || "Seu Nome")}</p>`;
  if (m.cargo) h += `<p class="rl">${esc(m.cargo)}</p>`;
  if (m.contato) h += `<p class="ct">${esc(m.contato)}</p>`;
  for (const sec of m.sections) {
    h += `<h3>${esc(sec.t)}</h3>`;
    (sec.paras || []).forEach(p => h += `<p>${esc(p)}</p>`);
    (sec.jobs || []).forEach(j => {
      h += `<p class="jt">${esc(j.title)}</p>`;
      if (j.meta) h += `<p class="jm">${esc(j.meta)}</p>`;
      if (j.bullets.length) h += `<ul>${j.bullets.map(b => li({ text: b })).join("")}</ul>`;
    });
    if (sec.list) h += `<ul>${sec.list.map(li).join("")}</ul>`;
  }
  $("sheet").innerHTML = h;
}

/* ---------- checagem ATS ---------- */
const VERBS = /^(desenvolvi|criei|liderei|implantei|implementei|reduzi|aumentei|construí|construi|escrevi|gerenciei|coordenei|projetei|automatizei|otimizei|migrei|entreguei|conduzi|melhorei|elevei|lancei|mantive|integrei|analisei|treinei|negociei|organizei|planejei|estruturei|atuei|participei|apoiei|responsável|desenhei|defini|resolvi|monitorei|documentei|atendi|vendi|prospectei|contribuí|contribui|corrigi|apresentei|acompanhei|capacitei|administrei|executei|realizei|elaborei)/i;
function renderChecks() {
  const s = state, m = model();
  const bullets = s.exp.flatMap(x => lines(x.bullets));
  const words = s.resumo.trim().split(/\s+/).filter(Boolean).length;
  const errors = document.querySelectorAll("form [aria-invalid]").length;
  const checks = [
    [!!(s.nome && s.email && s.telefone), "Nome, e-mail e telefone no corpo do documento"],
    [!!s.cargo, "Cargo pretendido abaixo do nome"],
    [words >= 30 && words <= 90, `Resumo entre 30 e 90 palavras (agora: ${words})`],
    [m.skills.length >= 6, `Pelo menos 6 habilidades (agora: ${m.skills.length})`],
    [s.exp.filter(x => x.cargo || x.empresa).every(x => isDate(x.inicio) && (x.atual || isDate(x.fim))), "Toda experiência tem início e fim (MM/AAAA)"],
    [bullets.length > 0 && bullets.filter(b => /\d/.test(b)).length >= Math.ceil(bullets.length / 2), "Metade ou mais das conquistas com números"],
    [bullets.length > 0 && bullets.every(b => VERBS.test(b)), "Conquistas começam com verbo de ação"],
    [bullets.every(b => b.length <= 220), "Conquistas com até 2 linhas cada"],
    [!!s.linkedin, "Link do LinkedIn"],
    [errors === 0, errors ? `Campos com erro no formulário (${errors})` : "Nenhum campo com erro"]
  ];
  const ok = checks.filter(c => c[0]).length;
  $("score").textContent = $("tabScore").textContent = `${ok}/${checks.length}`;
  $("checkList").innerHTML = checks.map(([v, t]) => `<li class="${v ? "ok" : "no"}">${esc(t)}</li>`).join("");
  $("resumoCount").textContent = `${words} palavras`;
}

function changed() {
  if (isExample) { isExample = false; }
  $("exampleBadge").hidden = !isExample;
  save(); renderPreview(); renderChecks();
}

/* ---------- PDF ---------- */
function buildPdf() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const m = model();
  const L = 18, R = 18, T = 18, B = 18, W = 210 - L - R, H = 297;
  let y = T;
  const LH = pt => pt * 0.3528 * 1.25;
  const ensure = need => { if (y + need > H - B) { doc.addPage(); y = T; } };
  const para = (txt, size, style = "normal", color = 25, indent = 0, bullet = false) => {
    doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(color);
    const parts = doc.splitTextToSize(txt, W - indent - (bullet ? 4 : 0));
    parts.forEach((ln, i) => {
      ensure(LH(size));
      if (bullet && i === 0) doc.text("•", L + indent, y + LH(size) * 0.75);
      doc.text(ln, L + indent + (bullet ? 4 : 0), y + LH(size) * 0.75);
      y += LH(size);
    });
  };
  // item de lista com rótulo em negrito ("Front-end: HTML, CSS"), quebrando as linhas à mão
  const rich = (label, txt, size = 10, indent = 1) => {
    doc.setFontSize(size); doc.setTextColor(25);
    const width = (s, b) => { doc.setFont("helvetica", b ? "bold" : "normal"); return doc.getTextWidth(s); };
    const words = [...`${label}:`.split(" ").map(w => ({ w, b: true })), ...txt.split(/\s+/).filter(Boolean).map(w => ({ w, b: false }))];
    const maxW = W - indent - 4, rows = [[]];
    let lineW = 0;
    for (const t of words) {
      const add = width((rows.at(-1).length ? " " : "") + t.w, t.b);
      if (rows.at(-1).length && lineW + add > maxW) { rows.push([]); lineW = width(t.w, t.b); } else lineW += add;
      rows.at(-1).push(t);
    }
    rows.forEach((row, i) => {
      ensure(LH(size));
      const base = y + LH(size) * 0.75;
      let x = L + indent + 4;
      if (i === 0) { doc.setFont("helvetica", "normal"); doc.text("•", L + indent, base); }
      // palavras seguidas do mesmo estilo saem num único trecho, para a extração de texto ficar limpa
      const runs = [];
      row.forEach((t, j) => { const s = (j ? " " : "") + t.w, last = runs.at(-1); if (last && last.b === t.b) last.s += s; else runs.push({ s, b: t.b }); });
      runs.forEach(r => { doc.setFont("helvetica", r.b ? "bold" : "normal"); doc.text(r.s, x, base); x += doc.getTextWidth(r.s); });
      y += LH(size);
    });
  };
  const item = it => { if (it.label) rich(it.label, it.text); else para(it.text, 10, "normal", 25, 1, true); y += 0.5; };

  para(m.nome || "Seu Nome", 24, "bold", 15);
  if (m.cargo) { y += 0.4; para(m.cargo, 12.5, "normal", 60); }
  if (m.contato) { y += 0.6; para(m.contato, 9.5, "normal", 100); }

  for (const sec of m.sections) {
    y += 5; ensure(14);
    para(sec.t.toUpperCase(), 11.5, "bold", 15);
    doc.setDrawColor(170); doc.setLineWidth(0.25); doc.line(L, y + 0.5, L + W, y + 0.5); y += 2.6;
    (sec.paras || []).forEach(p => para(p, 10));
    (sec.jobs || []).forEach((j, idx) => {
      if (idx) y += 2.4;
      ensure(12);
      if (j.title) para(j.title, 10.5, "bold", 15);
      if (j.meta) para(j.meta, 9.5, "normal", 110);
      if (j.bullets.length) y += 0.6;
      j.bullets.forEach(b => item({ text: b }));
    });
    (sec.list || []).forEach(item);
  }

  doc.setProperties({
    title: `Currículo - ${m.nome || "Sem nome"}`,
    subject: m.cargo || "Currículo",
    author: m.nome || "",
    keywords: m.skills.join(", "),
    creator: "CV Legível"
  });
  return doc;
}
function fileName() {
  const n = (state.nome || "Curriculo").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().replace(/\s+/g, "-").replace(/[^A-Za-z0-9-]/g, "");
  return `${n || "Curriculo"}-Curriculo.pdf`;
}

$("pdfBtn").addEventListener("click", () => {
  const st = $("status");
  if (!window.jspdf) { st.textContent = "A biblioteca de PDF não carregou. Verifique a conexão e recarregue a página."; return; }
  const name = fileName();
  buildPdf().save(name);
  const errors = document.querySelectorAll("form [aria-invalid]").length;
  st.textContent = errors ? `PDF gerado: ${name}. Atenção: ${errors} campo(s) com erro no formulário.` : `PDF gerado: ${name}`;
});

$("clearBtn").addEventListener("click", () => {
  const b = $("clearBtn");
  if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "Confirmar limpeza"; setTimeout(() => { b.dataset.armed = ""; b.textContent = "Limpar tudo"; }, 3000); return; }
  b.dataset.armed = ""; b.textContent = "Limpar tudo";
  state = structuredClone(EMPTY); isExample = false;
  bindValues(); bindLocal(); renderLists(); changed();
});

/* ---------- tema claro/escuro ---------- */
const THEME_KEY = "cv-legivel-tema";
const darkMq = matchMedia("(prefers-color-scheme: dark)");
const currentTheme = () => document.documentElement.dataset.theme || (darkMq.matches ? "dark" : "light");
function renderThemeBtn() {
  const dark = currentTheme() === "dark";
  $("themeBtn").textContent = dark ? "☀ Tema claro" : "☾ Tema escuro";
  $("themeBtn").setAttribute("aria-label", dark ? "Mudar para o tema claro" : "Mudar para o tema escuro");
}
$("themeBtn").addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  renderThemeBtn();
});
darkMq.addEventListener("change", renderThemeBtn);
renderThemeBtn();

bindSimple(); bindLocal(); renderLists(); renderPreview(); renderChecks();
$("exampleBadge").hidden = !isExample;
document.fonts?.ready.then(autosizeAll); // a fonte web muda a altura das linhas
