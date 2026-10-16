// Ponto de entrada: liga os módulos da interface e faz a primeira renderização.
import { computeChecks } from "./checks.js";
import { CV_LANGS, CV_TEXT } from "./cv-i18n.js";
import { fileName } from "./format.js";
import { model } from "./model.js";
import { generatePdf } from "./pdf.js";
import { bindTabs, bindTheme } from "./ui/chrome.js";
import { bindDataIO } from "./ui/data-io.js";
import { $, autosizeAll, errorCount, status } from "./ui/dom.js";
import { bindLists, bindSimple, fillSimple, renderLists } from "./ui/form.js";
import { bindLocation, fillLocation } from "./ui/location.js";
import { renderChecks, renderPreview } from "./ui/preview.js";
import { app, changed, onChange } from "./ui/store.js";
import { bindAtsTest, bindJobMatch, renderJobMatch } from "./ui/tools.js";

function render() {
  const m = model(app.state);
  renderPreview(m);
  renderChecks(computeChecks(app.state, m, errorCount()), app.state.resumo);
  $("exampleBadge").hidden = !app.isExample;
}

/** Preenche todo o formulário a partir do estado (início, importação, limpeza). */
function refreshForm() {
  fillSimple();
  fillLocation();
  renderLists();
  $("cvLang").value = app.state.cvLang;
  $("vaga").value = app.state.vaga;
  renderJobMatch();
  render();
}

let warnedSave = false;
onChange(() => {
  render();
  if (app.saveFailed && !warnedSave) {
    warnedSave = true;
    status(
      "Atenção: este navegador não permite salvar o rascunho (aba anônima ou armazenamento cheio). Exporte os dados antes de fechar."
    );
  }
});

/* ---------- idioma do currículo ---------- */
$("cvLang").innerHTML = Object.entries(CV_LANGS)
  .map(([k, n]) => `<option value="${k}">${n}</option>`)
  .join("");
$("cvLang").addEventListener("change", (e) => {
  app.state.cvLang = e.target.value;
  changed();
});

/* ---------- gerar PDF ---------- */
$("pdfBtn").addEventListener("click", async () => {
  const btn = $("pdfBtn");
  btn.disabled = true;
  btn.setAttribute("aria-busy", "true");
  status("Gerando o PDF…");
  try {
    const m = model(app.state);
    const doc = await generatePdf(m, status);
    const name = fileName(app.state.nome, CV_TEXT[m.lang].arquivo);
    doc.save(name);
    const n = errorCount();
    status(n ? `PDF gerado: ${name}. Atenção: ${n} campo(s) com erro no formulário.` : `PDF gerado: ${name}`);
  } catch (e) {
    console.error(e);
    status("Não foi possível gerar o PDF. Verifique a conexão e recarregue a página.");
  } finally {
    btn.disabled = false;
    btn.removeAttribute("aria-busy");
  }
});

bindTheme();
bindTabs();
bindSimple();
bindLocation();
bindLists();
bindJobMatch();
bindAtsTest();
bindDataIO(refreshForm);
refreshForm();
if (app.loadError === "corrupt")
  status("O rascunho salvo estava corrompido e não pôde ser lido. O formulário começou vazio.");
document.fonts?.ready.then(autosizeAll); // a fonte muda a altura das linhas

// modo offline: o service worker guarda os arquivos do site no primeiro acesso
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").catch(() => {
    /* sem offline, o site continua funcionando normalmente */
  });
}
