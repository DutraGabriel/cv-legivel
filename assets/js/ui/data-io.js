// Exportar e importar o rascunho em JSON, e "Limpar tudo".
// Permite levar o currículo para outro computador sem depender do localStorage.
import { pageLang, t } from "../i18n/index.js";
import { clear, emptyFor, fromImport, SCHEMA } from "../state.js";
import { $, download, status } from "./dom.js";
import { app, replaceState } from "./store.js";

const LANG = pageLang();
const MAX_IMPORT_BYTES = 1024 * 1024; // um rascunho real tem poucos KB

export function bindDataIO(refreshForm) {
  $("exportBtn").addEventListener("click", () => {
    const payload = { app: "cv-legivel", schema: SCHEMA, exportedAt: new Date().toISOString(), data: app.state };
    const name = `cv-legivel-${LANG}.json`;
    download(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), name);
    status(t("stExport", { name }));
  });

  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // permite importar o mesmo arquivo de novo
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES) return status(t("stImportBig"));
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      return status(t("stImportBad"));
    }
    const data = parsed && parsed.app === "cv-legivel" ? parsed.data : parsed;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return status(t("stImportNotCv"));
    }
    if (!app.isExample && !confirm(t("stImportConfirm"))) return;
    replaceState(fromImport(data, LANG));
    refreshForm();
    status(t("stImported", { name: file.name }));
  });

  // dois cliques para limpar: o primeiro só "arma" o botão por 3 segundos
  $("clearBtn").addEventListener("click", () => {
    const b = $("clearBtn");
    if (b.dataset.armed !== "1") {
      b.dataset.armed = "1";
      b.textContent = t("clearConfirm");
      status(t("stClearArmed"));
      setTimeout(() => {
        b.dataset.armed = "";
        b.textContent = t("clearBtn");
      }, 3000);
      return;
    }
    b.dataset.armed = "";
    b.textContent = t("clearBtn");
    replaceState(emptyFor(LANG));
    clear(undefined, LANG); // apaga também a cópia salva deste idioma, não só o formulário
    refreshForm();
    status(t("stCleared"));
  });
}
