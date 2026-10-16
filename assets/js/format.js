// Funções puras de formatação: não acessam o DOM, então podem ser testadas no Node.

/** Escapa texto para uso seguro dentro de HTML (conteúdo e atributos entre aspas duplas). */
export const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );

/** Quebra em linhas, tira marcadores digitados pela pessoa ("•", "-", "*") e descarta linhas vazias. */
export const lines = (s) =>
  String(s ?? "")
    .split("\n")
    .map((l) => l.replace(/^[\s•\-–*]+/, "").trim())
    .filter(Boolean);

const MARKER = /^\s*(?:[•▪◦●\-–*]|\d{1,2}[.)])\s+/;

/**
 * Conquistas: uma por linha, mas junta as linhas que são continuação da anterior.
 * Texto colado de um PDF chega com quebras no meio da frase; sem isso, cada pedaço
 * viraria uma "conquista" separada no currículo e na checagem.
 * É continuação a linha que começa com letra minúscula ou, quando o texto usa
 * marcadores ("•", "-", "1."), a linha que não começa com marcador.
 */
export const bulletLines = (s) => {
  const raw = String(s ?? "")
    .split("\n")
    .filter((l) => l.trim());
  const usesMarkers = raw.some((l) => MARKER.test(l));
  const out = [];
  for (const l of raw) {
    const text = l
      .replace(MARKER, "")
      .replace(/^[\s•\-–*]+/, "")
      .trim();
    const continuation = out.length && (/^\p{Ll}/u.test(text) || (usesMarkers && !MARKER.test(l)));
    if (continuation) out[out.length - 1] += ` ${text}`;
    else out.push(text);
  }
  return out.filter(Boolean);
};

/**
 * "Front-end: HTML, CSS" → { label: "Front-end", text: "HTML, CSS" }.
 * Com `dash`, também aceita "Inglês - Avançado" (formato antigo dos idiomas).
 */
export const labeled = (line, dash = false) => {
  const m = /^([^:]{1,40}):\s*(.+)$/.exec(line) || (dash && /^(.{1,30}?)\s+[-–]\s+(.+)$/.exec(line));
  return m ? { label: m[1].trim(), text: m[2].trim() } : { label: "", text: line };
};

/** Máscara MM/AAAA aplicada aos poucos enquanto a pessoa digita. */
export const fmtDate = (v) => {
  const d = String(v ?? "")
    .replace(/\D/g, "")
    .slice(0, 6);
  return [d.slice(0, 2), d.slice(2)].filter(Boolean).join("/");
};

/** true para uma data MM/AAAA completa e com mês de 01 a 12. */
export const isDate = (v) => {
  const m = /^(\d{2})\/\d{4}$/.exec(v ?? "");
  return !!m && +m[1] >= 1 && +m[1] <= 12;
};

/** "03/2022" → 202203, para comparar datas como números; 0 se a data estiver incompleta. */
export const ym = (v) => {
  const m = /^(\d{2})\/(\d{4})$/.exec(v ?? "");
  return m ? +m[2] * 100 + +m[1] : 0;
};

export const ymNow = (d = new Date()) => d.getFullYear() * 100 + d.getMonth() + 1;

/** Telefone brasileiro: (48) 3333-4444 ou (48) 99618-7500, formatando aos poucos. */
export const fmtPhone = (v) => {
  const d = String(v ?? "")
    .replace(/\D/g, "")
    .slice(0, 11);
  if (!d) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const r = d.slice(2);
  const cut = d.length === 11 ? 5 : 4;
  return r.length <= 4 ? `(${ddd}) ${r}` : `(${ddd}) ${r.slice(0, cut)}-${r.slice(cut)}`;
};

/** "https://www.linkedin.com/in/fulano/?trk=x" → "linkedin.com/in/fulano". */
export const cleanUrl = (v) =>
  String(v ?? "")
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/^www\./i, "")
    .replace(/[?#].*$/, "")
    .replace(/\/+$/, "");

export const wordCount = (s) =>
  String(s ?? "")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

/** Remove acentos: "Currículo" → "Curriculo". */
export const stripAccents = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "");

/** Nome do arquivo: "Ana Paula" → "Ana-Paula-Curriculo.pdf". */
export const fileName = (nome, suffix = "Curriculo") => {
  const n = stripAccents(nome)
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^A-Za-z0-9-]/g, "");
  return `${n || suffix}-${suffix}.pdf`;
};
