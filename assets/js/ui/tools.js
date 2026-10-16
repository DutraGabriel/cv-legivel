// Ferramentas da coluna da prévia: comparação com a vaga e teste de leitura ATS.
import { esc } from "../format.js";
import { matchJob } from "../jobmatch.js";
import { model, plainText } from "../model.js";
import { generatePdf } from "../pdf.js";
import { sanitize } from "../rules.js";
import { $, autosize, status } from "./dom.js";
import { app, changed } from "./store.js";

/* ---------- comparar com a vaga ---------- */
export function renderJobMatch() {
  const out = $("jobResult");
  const vaga = app.state.vaga.trim();
  if (!vaga) {
    out.innerHTML = "";
    return;
  }
  const r = matchJob(vaga, plainText(model(app.state)));
  if (!r.keywords.length) {
    out.innerHTML = `<p class="hint">Não encontrei termos técnicos nessa descrição. Cole o texto completo da vaga.</p>`;
    return;
  }
  const chips = (list, cls) => list.map((k) => `<li class="chip ${cls}">${esc(k)}</li>`).join("");
  out.innerHTML = `
    <p class="match-score"><strong>${r.score}%</strong> dos termos da vaga aparecem no seu currículo (${r.found.length} de ${r.keywords.length}).</p>
    ${r.missing.length ? `<p class="match-label">Ausentes no currículo: inclua os que você realmente domina.</p><ul class="chips">${chips(r.missing, "missing")}</ul>` : ""}
    ${r.found.length ? `<p class="match-label">Já presentes:</p><ul class="chips">${chips(r.found, "found")}</ul>` : ""}`;
}

export function bindJobMatch() {
  const el = $("vaga");
  el.value = app.state.vaga;
  let timer;
  el.addEventListener("input", () => {
    const { value, removed } = sanitize(el.value, "vaga");
    if (removed) el.value = value;
    autosize(el);
    app.state.vaga = el.value;
    changed();
    clearTimeout(timer);
    timer = setTimeout(renderJobMatch, 250); // espera a pessoa parar de colar/digitar
  });
}

/* ---------- ver como o ATS lê ---------- */
let pdfjsPromise = null;
const loadPdfjs = () => {
  pdfjsPromise ??= import("../../vendor/pdfjs/pdf.min.mjs").then((lib) => {
    lib.GlobalWorkerOptions.workerSrc = new URL("../../vendor/pdfjs/pdf.worker.min.mjs", import.meta.url).href;
    return lib;
  });
  return pdfjsPromise;
};

/** Extrai o texto do PDF na ordem em que um leitor de PDF (e um ATS) o encontra. */
export async function extractPdfText(bytes) {
  const pdfjs = await loadPdfjs();
  // isEvalSupported: false fecha a classe de falhas de execução de código via fontes do PDF
  const pdf = await pdfjs.getDocument({ data: bytes, isEvalSupported: false }).promise;
  const pages = [];
  for (let p = 1; p <= pdf.numPages; p++) {
    const content = await (await pdf.getPage(p)).getTextContent();
    let text = "";
    for (const it of content.items) text += it.str + (it.hasEOL ? "\n" : "");
    pages.push(text.trim());
  }
  return pages.join("\n\n— nova página —\n\n");
}

export function bindAtsTest() {
  const dialog = $("atsDialog");
  $("atsBtn").addEventListener("click", async () => {
    const btn = $("atsBtn");
    btn.disabled = true;
    status("Gerando o PDF e extraindo o texto…");
    try {
      const doc = await generatePdf(model(app.state), status);
      $("atsText").textContent = await extractPdfText(doc.output("arraybuffer"));
      dialog.showModal();
      status("");
    } catch (e) {
      console.error(e);
      status("Não foi possível testar a leitura do PDF. Recarregue a página e tente de novo.");
    } finally {
      btn.disabled = false;
    }
  });
  $("atsClose").addEventListener("click", () => dialog.close());
}
