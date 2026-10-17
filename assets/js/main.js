// Ponto de entrada: liga os módulos da interface e faz a primeira renderização.
// Cada página (/, /en/, /es/) usa este mesmo arquivo; o idioma vem de <html data-lang>.
import { computeChecks } from "./checks.js";
import { fileName } from "./format.js";
import { cvText, DICTS, LANGS, pageLang, t } from "./i18n/index.js";
import { model } from "./model.js";
import { generatePdf } from "./pdf.js";
import { copyToLang, hasDraft, load } from "./state.js";
import { bindLangLinks, bindTabs, bindTheme, suggestLang } from "./ui/chrome.js";
import { bindDataIO } from "./ui/data-io.js";
import { $, announce, autosizeAll, errorCount, status } from "./ui/dom.js";
import { bindLists, bindSimple, fillSimple, renderLists } from "./ui/form.js";
import { bindLocation, fillLocation } from "./ui/location.js";
import { renderChecks, renderPreview } from "./ui/preview.js";
import { app, onChange, replaceState } from "./ui/store.js";
import { bindAtsTest, bindJobMatch, renderJobMatch } from "./ui/tools.js";

const LANG = pageLang();

function render() {
  const m = model(app.state);
  renderPreview(m);
  renderChecks(computeChecks(app.state, m, errorCount()), app.state.resumo);
  $("exampleBadge").hidden = !app.isExample;
}

/** Preenche todo o formulário a partir do estado (início, importação, limpeza, cópia). */
function refreshForm() {
  fillSimple();
  fillLocation();
  renderLists();
  $("vaga").value = app.state.vaga;
  renderJobMatch();
  render();
}

let warnedSave = false;
onChange(() => {
  render();
  if (app.saveFailed && !warnedSave) {
    warnedSave = true;
    status(t("stSaveFail"));
  }
});

/* ---------- copiar o currículo de outro idioma ---------- */
// Na primeira visita a um idioma (ainda com o exemplo), oferece trazer os dados de um idioma
// que já tem rascunho; a pessoa só traduz os textos.
function offerCopy() {
  const others = LANGS.filter((l) => l !== LANG && hasDraft(undefined, l));
  if (!app.isExample || !others.length) return;
  const box = $("copyOffer");
  // nome do outro idioma escrito no idioma desta página: "Portuguese" na página em inglês
  const names = new Intl.DisplayNames([DICTS[LANG].meta.htmlLang], { type: "language" });
  const name = (l) => names.of(l).replace(/^\p{Ll}/u, (c) => c.toUpperCase());
  $("copyTitle").textContent = t("copyTitle", { lang: others.map(name).join(" / ") });
  $("copyActions").innerHTML = "";
  for (const l of others) {
    const b = Object.assign(document.createElement("button"), { type: "button", className: "btn small" });
    b.textContent = t("copyBtn", { lang: name(l) });
    b.addEventListener("click", () => {
      replaceState(copyToLang(load(undefined, l).state, LANG));
      refreshForm();
      box.hidden = true;
      status(t("stCopied", { lang: name(l) }));
    });
    $("copyActions").append(b);
  }
  const dismiss = Object.assign(document.createElement("button"), { type: "button", className: "btn small" });
  dismiss.textContent = t("copyDismiss");
  dismiss.addEventListener("click", () => (box.hidden = true));
  $("copyActions").append(dismiss);
  box.hidden = false;
  announce($("copyTitle").textContent); // a caixa aparece sozinha: avisa quem usa leitor de tela
}

/* ---------- gerar PDF ---------- */
$("pdfBtn").addEventListener("click", async () => {
  const btn = $("pdfBtn");
  btn.disabled = true;
  btn.setAttribute("aria-busy", "true");
  status(t("stPdf"));
  try {
    const m = model(app.state);
    const doc = await generatePdf(m, status);
    const name = fileName(app.state.nome, cvText(m.lang).arquivo);
    doc.save(name);
    const n = errorCount();
    status(n ? t("stPdfOkErr", { name, n }) : t("stPdfOk", { name }));
  } catch (e) {
    console.error(e);
    status(t("stPdfFail"));
  } finally {
    btn.disabled = false;
    btn.removeAttribute("aria-busy");
  }
});

bindTheme();
bindTabs();
bindLangLinks();
suggestLang();
bindLocation();
bindSimple();
bindLists();
bindJobMatch();
bindAtsTest();
bindDataIO(refreshForm);
refreshForm();
offerCopy();
if (app.loadError === "corrupt") status(t("stCorrupt"));
document.fonts?.ready.then(autosizeAll); // a fonte muda a altura das linhas

// modo offline: o service worker guarda os arquivos do site no primeiro acesso
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register(new URL("../../sw.js", import.meta.url)).catch(() => {
    /* sem offline, o site continua funcionando normalmente */
  });
}
