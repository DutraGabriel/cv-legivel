// Estado compartilhado da interface. Os módulos leem `app.state` e chamam `changed()`
// depois de alterá-lo; quem precisa reagir (prévia, checagem, salvamento) se inscreve em `onChange`.
import { load, save } from "../state.js";

const loaded = load();
export const app = {
  state: loaded.state,
  isExample: loaded.isExample,
  loadError: loaded.error,
  saveFailed: false
};

const listeners = [];
export const onChange = (fn) => listeners.push(fn);

/** Salva o rascunho e avisa todos os inscritos. */
export function changed() {
  app.isExample = false;
  app.saveFailed = !save(app.state);
  listeners.forEach((fn) => fn(app.state));
}

/** Troca o estado inteiro (importação de arquivo ou "Limpar tudo"). */
export function replaceState(next, { isExample = false } = {}) {
  app.state = next;
  changed();
  app.isExample = isExample;
}
