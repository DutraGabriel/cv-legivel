// Exportar e importar o rascunho em JSON, e "Limpar tudo".
// Permite levar o currículo para outro computador sem depender do localStorage.
import { clear, EMPTY, normalize, SCHEMA } from "../state.js";
import { $, download, status } from "./dom.js";
import { app, replaceState } from "./store.js";

const MAX_IMPORT_BYTES = 1024 * 1024; // um rascunho real tem poucos KB

export function bindDataIO(refreshForm) {
  $("exportBtn").addEventListener("click", () => {
    const payload = { app: "cv-legivel", schema: SCHEMA, exportedAt: new Date().toISOString(), data: app.state };
    download(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), "cv-legivel-dados.json");
    status("Dados exportados: cv-legivel-dados.json. Guarde o arquivo em local seguro, ele tem seus dados pessoais.");
  });

  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // permite importar o mesmo arquivo de novo
    if (!file) return;
    if (file.size > MAX_IMPORT_BYTES)
      return status("Arquivo grande demais para ser um rascunho do CV Legível (máximo 1 MB).");
    let parsed;
    try {
      parsed = JSON.parse(await file.text());
    } catch {
      return status("Não foi possível ler o arquivo: ele não é um JSON válido.");
    }
    const data = parsed && parsed.app === "cv-legivel" ? parsed.data : parsed;
    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return status("O arquivo não parece ser um rascunho exportado pelo CV Legível.");
    }
    if (!app.isExample && !confirm("Importar vai substituir o currículo que está no formulário. Continuar?")) return;
    replaceState(normalize(data));
    refreshForm();
    status(`Dados importados de ${file.name}.`);
  });

  // dois cliques para limpar: o primeiro só "arma" o botão por 3 segundos
  $("clearBtn").addEventListener("click", () => {
    const b = $("clearBtn");
    if (b.dataset.armed !== "1") {
      b.dataset.armed = "1";
      b.textContent = "Confirmar limpeza";
      status('Clique de novo em "Confirmar limpeza" para apagar todos os dados deste navegador.');
      setTimeout(() => {
        b.dataset.armed = "";
        b.textContent = "Limpar tudo";
      }, 3000);
      return;
    }
    b.dataset.armed = "";
    b.textContent = "Limpar tudo";
    replaceState(structuredClone(EMPTY));
    clear(); // apaga também a cópia salva, não só o formulário
    refreshForm();
    status("Todos os dados foram apagados deste navegador.");
  });
}
