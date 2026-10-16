const SAMPLE = {
  nome: "Mariana Souza",
  cargo: "Desenvolvedora Back-end Pleno",
  email: "mariana.souza@email.com",
  telefone: "(48) 99999-0000",
  cidade: "Florianópolis, SC",
  linkedin: "linkedin.com/in/marianasouza",
  site: "github.com/marianasouza",
  resumo: "Desenvolvedora back-end com 5 anos de experiência em Python e Django, focada em APIs REST, integrações e performance de banco de dados. Liderei a migração de um monólito para serviços em AWS e reduzi o tempo médio de resposta em 40%. Busco atuar em produtos SaaS com times ágeis.",
  exp: [
    { cargo: "Desenvolvedora Back-end", empresa: "Nuvem Tech", local: "Florianópolis, SC (híbrido)", inicio: "2022-03", fim: "", atual: true,
      bullets: "Desenvolvi APIs REST em Django REST Framework usadas por 120 mil usuários ativos\nReduzi em 40% o tempo médio de resposta otimizando consultas PostgreSQL e adicionando cache Redis\nImplantei pipeline de CI/CD com GitHub Actions e Docker, cortando o tempo de deploy de 30 para 8 minutos" },
    { cargo: "Desenvolvedora Júnior", empresa: "Agência Pixel", local: "Remoto", inicio: "2020-01", fim: "2022-02", atual: false,
      bullets: "Construí integrações com gateways de pagamento (Stripe, Pagar.me) em Python\nEscrevi testes automatizados com pytest, elevando a cobertura de 35% para 80%" }
  ],
  edu: [
    { curso: "Bacharelado em Ciência da Computação", inst: "Universidade Federal de Santa Catarina (UFSC)", inicio: "2015-02", fim: "2019-12" }
  ],
  habilidades: "Python, Django, Django REST Framework, PostgreSQL, Redis, Docker, AWS, Git, CI/CD, Testes automatizados, Scrum",
  idiomas: "Português - Nativo\nInglês - Avançado",
  certificacoes: "AWS Certified Cloud Practitioner (2023)"
};
const EMPTY = { nome:"", cargo:"", email:"", telefone:"", cidade:"", linkedin:"", site:"", resumo:"",
  exp:[{cargo:"",empresa:"",local:"",inicio:"",fim:"",atual:false,bullets:""}],
  edu:[{curso:"",inst:"",inicio:"",fim:""}], habilidades:"", idiomas:"", certificacoes:"" };

const KEY = "cv-legivel-v1";
let state, isExample = false;
try { const s = localStorage.getItem(KEY); if (s) state = JSON.parse(s); } catch (e) {}
if (!state) { state = structuredClone(SAMPLE); isExample = true; }

const $ = id => document.getElementById(id);
const esc = s => String(s || "").replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
const lines = s => String(s || "").split("\n").map(l => l.replace(/^[\s•\-–*]+/, "").trim()).filter(Boolean);
const fmtDate = v => { if (!v) return ""; const [y, m] = v.split("-"); return m ? `${m}/${y}` : y; };
const period = (a, b, atual) => { const i = fmtDate(a), f = atual ? "Atual" : fmtDate(b); return i && f ? `${i} – ${f}` : (i || f); };

function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }

/* ---------- formulário ---------- */
function bindSimple() {
  document.querySelectorAll("[data-k]").forEach(el => {
    el.value = state[el.dataset.k] || "";
    el.addEventListener("input", () => { state[el.dataset.k] = el.value; changed(); });
  });
}
function renderLists() {
  $("expList").innerHTML = state.exp.map((x, i) => `
    <div class="item">
      <div class="item-head"><span>Experiência ${i + 1}</span>${state.exp.length > 1 ? `<button type="button" class="remove" data-rm="exp" data-i="${i}">Remover</button>` : ""}</div>
      <div class="row">
        <label>Cargo<input id="exp-${i}-cargo" data-l="exp" data-i="${i}" data-f="cargo" value="${esc(x.cargo)}"></label>
        <label>Empresa<input id="exp-${i}-empresa" data-l="exp" data-i="${i}" data-f="empresa" value="${esc(x.empresa)}"></label>
      </div>
      <div class="row">
        <label>Local / modalidade<input id="exp-${i}-local" data-l="exp" data-i="${i}" data-f="local" value="${esc(x.local)}"></label>
        <label>Início<input id="exp-${i}-inicio" type="month" data-l="exp" data-i="${i}" data-f="inicio" value="${esc(x.inicio)}"></label>
        <label>Fim<input id="exp-${i}-fim" type="month" data-l="exp" data-i="${i}" data-f="fim" value="${esc(x.fim)}" ${x.atual ? "disabled" : ""}></label>
      </div>
      <label class="check"><input id="exp-${i}-atual" type="checkbox" data-l="exp" data-i="${i}" data-f="atual" ${x.atual ? "checked" : ""}> Trabalho aqui atualmente</label>
      <label>Conquistas <span class="hint">uma por linha; comece com verbo de ação e inclua números</span>
        <textarea id="exp-${i}-bullets" rows="4" data-l="exp" data-i="${i}" data-f="bullets">${esc(x.bullets)}</textarea></label>
    </div>`).join("");
  $("eduList").innerHTML = state.edu.map((x, i) => `
    <div class="item">
      <div class="item-head"><span>Formação ${i + 1}</span>${state.edu.length > 1 ? `<button type="button" class="remove" data-rm="edu" data-i="${i}">Remover</button>` : ""}</div>
      <div class="row">
        <label>Curso / grau<input id="edu-${i}-curso" data-l="edu" data-i="${i}" data-f="curso" value="${esc(x.curso)}"></label>
        <label>Instituição<input id="edu-${i}-inst" data-l="edu" data-i="${i}" data-f="inst" value="${esc(x.inst)}"></label>
      </div>
      <div class="row">
        <label>Início<input id="edu-${i}-inicio" type="month" data-l="edu" data-i="${i}" data-f="inicio" value="${esc(x.inicio)}"></label>
        <label>Conclusão (ou previsão)<input id="edu-${i}-fim" type="month" data-l="edu" data-i="${i}" data-f="fim" value="${esc(x.fim)}"></label>
      </div>
    </div>`).join("");
}
document.addEventListener("input", e => {
  const el = e.target; if (!el.dataset.l) return;
  const it = state[el.dataset.l][+el.dataset.i];
  it[el.dataset.f] = el.type === "checkbox" ? el.checked : el.value;
  if (el.dataset.f === "atual") { const fim = $(`exp-${el.dataset.i}-fim`); fim.disabled = el.checked; }
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
  const contato = [s.cidade, s.telefone, s.email, s.linkedin, s.site].map(v => (v || "").trim()).filter(Boolean);
  const sections = [];
  if (s.resumo.trim()) sections.push({ t: "Resumo profissional", paras: [s.resumo.trim()] });
  const exp = s.exp.filter(x => x.cargo || x.empresa).map(x => ({
    title: x.cargo.trim(),
    meta: [x.empresa, x.local, period(x.inicio, x.fim, x.atual)].map(v => (v || "").trim()).filter(Boolean).join(" | "),
    bullets: lines(x.bullets)
  }));
  if (exp.length) sections.push({ t: "Experiência profissional", jobs: exp });
  const edu = s.edu.filter(x => x.curso || x.inst).map(x => ({
    title: x.curso.trim(),
    meta: [x.inst, period(x.inicio, x.fim, false)].map(v => (v || "").trim()).filter(Boolean).join(" | "),
    bullets: []
  }));
  if (edu.length) sections.push({ t: "Formação acadêmica", jobs: edu });
  const skills = s.habilidades.split(/[,;\n]/).map(v => v.trim()).filter(Boolean);
  if (skills.length) sections.push({ t: "Habilidades", paras: [skills.join(", ")] });
  if (lines(s.idiomas).length) sections.push({ t: "Idiomas", list: lines(s.idiomas) });
  if (lines(s.certificacoes).length) sections.push({ t: "Certificações", list: lines(s.certificacoes) });
  return { nome: s.nome.trim(), cargo: s.cargo.trim(), contato: contato.join(" | "), sections, skills };
}

function renderPreview() {
  const m = model();
  let h = `<p class="nm">${esc(m.nome || "Seu Nome")}</p>`;
  if (m.cargo) h += `<p class="rl">${esc(m.cargo)}</p>`;
  if (m.contato) h += `<p class="ct">${esc(m.contato)}</p>`;
  for (const sec of m.sections) {
    h += `<h3>${esc(sec.t)}</h3>`;
    (sec.paras || []).forEach(p => h += `<p>${esc(p)}</p>`);
    (sec.jobs || []).forEach(j => {
      h += `<p class="jt">${esc(j.title)}</p>`;
      if (j.meta) h += `<p class="jm">${esc(j.meta)}</p>`;
      if (j.bullets.length) h += `<ul>${j.bullets.map(b => `<li>${esc(b)}</li>`).join("")}</ul>`;
    });
    if (sec.list) h += `<ul>${sec.list.map(b => `<li>${esc(b)}</li>`).join("")}</ul>`;
  }
  $("sheet").innerHTML = h;
}

/* ---------- checagem ATS ---------- */
const VERBS = /^(desenvolvi|criei|liderei|implantei|implementei|reduzi|aumentei|construí|construi|escrevi|gerenciei|coordenei|projetei|automatizei|otimizei|migrei|entreguei|conduzi|melhorei|elevei|lancei|mantive|integrei|analisei|treinei|negociei|organizei|planejei|estruturei|atuei|participei|apoiei|responsável|desenhei|defini|resolvi|monitorei|documentei)/i;
function renderChecks() {
  const s = state, m = model();
  const bullets = s.exp.flatMap(x => lines(x.bullets));
  const words = s.resumo.trim().split(/\s+/).filter(Boolean).length;
  const checks = [
    [!!(s.nome && s.email && s.telefone), "Nome, e-mail e telefone no corpo do documento"],
    [!!s.cargo, "Cargo pretendido abaixo do nome"],
    [words >= 30 && words <= 90, `Resumo entre 30 e 90 palavras (agora: ${words})`],
    [m.skills.length >= 6, `Pelo menos 6 habilidades (agora: ${m.skills.length})`],
    [s.exp.filter(x => x.cargo || x.empresa).every(x => x.inicio && (x.fim || x.atual)), "Toda experiência tem início e fim (MM/AAAA)"],
    [bullets.length > 0 && bullets.filter(b => /\d/.test(b)).length >= Math.ceil(bullets.length / 2), "Metade ou mais das conquistas com números"],
    [bullets.length > 0 && bullets.every(b => VERBS.test(b)), "Conquistas começam com verbo de ação"],
    [bullets.every(b => b.length <= 220), "Conquistas com até 2 linhas cada"],
    [!!s.linkedin, "Link do LinkedIn"]
  ];
  const ok = checks.filter(c => c[0]).length;
  $("score").textContent = `${ok}/${checks.length}`;
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
  const LH = pt => pt * 0.3528 * 1.32;
  const ensure = need => { if (y + need > H - B) { doc.addPage(); y = T; } };
  const para = (txt, size, style = "normal", color = 20, indent = 0, bullet = false) => {
    doc.setFont("helvetica", style); doc.setFontSize(size); doc.setTextColor(color);
    const parts = doc.splitTextToSize(txt, W - indent - (bullet ? 4 : 0));
    parts.forEach((ln, i) => {
      ensure(LH(size));
      if (bullet && i === 0) doc.text("•", L + indent, y + LH(size) * 0.75);
      doc.text(ln, L + indent + (bullet ? 4 : 0), y + LH(size) * 0.75);
      y += LH(size);
    });
  };

  para(m.nome || "Seu Nome", 20, "bold", 10);
  if (m.cargo) { y += 0.5; para(m.cargo, 12, "normal", 30); }
  if (m.contato) { y += 0.8; para(m.contato, 9.5, "normal", 60); }

  for (const sec of m.sections) {
    y += 4.5; ensure(14);
    para(sec.t.toUpperCase(), 11, "bold", 10);
    doc.setDrawColor(150); doc.setLineWidth(0.2); doc.line(L, y + 0.6, L + W, y + 0.6); y += 2.6;
    (sec.paras || []).forEach(p => para(p, 10));
    (sec.jobs || []).forEach((j, idx) => {
      if (idx) y += 2.2;
      ensure(12);
      if (j.title) para(j.title, 10.5, "bold", 10);
      if (j.meta) para(j.meta, 9.5, "normal", 70);
      if (j.bullets.length) y += 0.8;
      j.bullets.forEach(b => { para(b, 10, "normal", 20, 1, true); y += 0.4; });
    });
    (sec.list || []).forEach(b => { para(b, 10, "normal", 20, 1, true); y += 0.4; });
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
  st.textContent = `PDF gerado: ${name}`;
});

$("clearBtn").addEventListener("click", () => {
  const b = $("clearBtn");
  if (b.dataset.armed !== "1") { b.dataset.armed = "1"; b.textContent = "Confirmar limpeza"; setTimeout(() => { b.dataset.armed = ""; b.textContent = "Limpar tudo"; }, 3000); return; }
  b.dataset.armed = ""; b.textContent = "Limpar tudo";
  state = structuredClone(EMPTY); isExample = false;
  bindValues(); renderLists(); changed();
});
function bindValues() { document.querySelectorAll("[data-k]").forEach(el => el.value = state[el.dataset.k] || ""); }

bindSimple(); renderLists(); renderPreview(); renderChecks();
$("exampleBadge").hidden = !isExample;
