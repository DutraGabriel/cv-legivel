// Utilitários de DOM compartilhados pelos módulos da interface.

export const $ = (id) => document.getElementById(id);

/** Mensagem de status geral (área com role="status", lida por leitores de tela). */
export const status = (msg) => {
  $("status").textContent = msg;
};

/** Anuncia uma mensagem para leitores de tela sem mostrá-la na tela. */
export const announce = (msg) => {
  const live = $("live");
  live.textContent = "";
  requestAnimationFrame(() => (live.textContent = msg));
};

// Mensagem abaixo do campo, dentro do <label> para manter o layout.
// aria-hidden tira o texto do NOME do campo (senão o leitor de tela leria o erro duas vezes);
// aria-describedby continua apontando para ele, então o erro é lido como descrição.
function msgEl(el) {
  let m = document.getElementById(`${el.id}-msg`);
  if (!m) {
    m = document.createElement("span");
    m.className = "field-msg";
    m.id = `${el.id}-msg`;
    m.setAttribute("aria-hidden", "true");
    el.closest("label").append(m);
    el.setAttribute("aria-describedby", m.id);
  }
  return m;
}

/** Erro persistente: fica até o campo ser corrigido. */
export function setError(el, msg) {
  el.toggleAttribute("aria-invalid", !!msg);
  el.dataset.error = msg || "";
  if (!msg && !document.getElementById(`${el.id}-msg`)) return;
  const m = msgEl(el);
  m.textContent = msg || "";
  m.classList.toggle("is-error", !!msg);
}

/** Aviso temporário (ex.: caractere removido). Some sozinho e volta a mostrar o erro, se houver. */
export function flash(el, msg) {
  const m = msgEl(el);
  m.textContent = msg;
  m.classList.remove("is-error");
  announce(msg);
  clearTimeout(el._flash);
  el._flash = setTimeout(() => {
    m.textContent = el.dataset.error || "";
    m.classList.toggle("is-error", !!el.dataset.error);
  }, 3500);
}

export const errorCount = () => document.querySelectorAll("form [aria-invalid]").length;

/** Caixas de texto crescem junto com o conteúdo, sem barra de rolagem interna. */
export function autosize(el) {
  if (!el.offsetParent) return; // escondida (aba de prévia no celular)
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`;
}
export const autosizeAll = () => document.querySelectorAll("textarea").forEach(autosize);

/** Reaplica uma máscara mantendo o cursor depois do mesmo dígito. */
export function maskInput(el, fmt) {
  const digitsBefore = el.value.slice(0, el.selectionStart).replace(/\D/g, "").length;
  el.value = fmt(el.value);
  let pos = 0;
  let n = 0;
  while (pos < el.value.length && n < digitsBefore) {
    if (/\d/.test(el.value[pos])) n++;
    pos++;
  }
  el.setSelectionRange(pos, pos);
}

/** Baixa um Blob como arquivo. */
export function download(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: name });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
