// Restrições de caracteres e validações. Funções puras: recebem valores e devolvem a CHAVE
// da mensagem ("rNome", "vEmail"...), traduzida pela interface com t() no idioma da página.
import { isDate, ym, ymNow } from "./format.js";

// Cada regra lista o que NÃO pode. O caractere é removido ao digitar e um aviso aparece.
// \p{M} (acentos combinados) fica liberado para escritas que não têm a letra acentuada pronta.
export const RULES = {
  nome: { re: /[^\p{L}\p{M}\s.'’-]/gu, msg: "rNome" }, // "John A. Smith Jr.", "D'Ávila"
  cargo: { re: /[^\p{L}\p{M}\p{N}\s.,:'’+#/()&-]/gu, msg: "rCargo" }, // "Head of Data, LATAM"
  local: { re: /[^\p{L}\p{M}\s,/()'’.-]/gu, msg: "rLocal" },
  curso: { re: /[^\p{L}\p{M}\p{N}\s(),.:'’&/-]/gu, msg: "rCurso" }, // "Bachelor's in Computer Science"
  livre: { re: /[<>{}[\]\p{Extended_Pictographic}]/gu, msg: "rLivre" },
  texto: { re: /\p{Extended_Pictographic}/gu, msg: "rTexto" },
  link: { re: /\s/g, msg: "rLink" },
  tel: { re: /[^\d\s+().-]/g, msg: "rTel" }
};

/** Campo → regra. Campos simples usam o nome; campos de listas usam "lista.campo". */
export const FIELD_RULE = {
  nome: "nome",
  cargo: "cargo",
  email: "link",
  linkedin: "link",
  site: "link",
  cidade: "local",
  resumo: "texto",
  habilidades: "texto",
  idiomas: "texto",
  certificacoes: "texto",
  vaga: "texto",
  "exp.cargo": "cargo",
  "exp.empresa": "livre",
  "exp.local": "local",
  "exp.bullets": "texto",
  "edu.curso": "curso",
  "edu.inst": "livre"
};

/** Limites generosos que evitam PDFs gigantes por um texto colado por engano. */
export const MAX_LENGTH = {
  resumo: 1500,
  bullets: 3000,
  habilidades: 1500,
  idiomas: 600,
  certificacoes: 1500,
  vaga: 15000,
  default: 160
};

/**
 * Remove os caracteres proibidos. Devolve o valor limpo, se algo foi removido e a chave da mensagem.
 * Antes, junta letra + acento num caractere só (NFC): texto colado de PDF ou digitado no Mac pode vir
 * com "e" + "´" separados, e a regra apagaria o acento ("José" virando "Jose").
 */
export function sanitize(value, field) {
  const nfc = value.normalize("NFC");
  const rule = RULES[FIELD_RULE[field]];
  if (!rule) return { value: nfc, removed: false, msg: "" };
  const cleaned = nfc.replace(rule.re, "");
  return { value: cleaned, removed: cleaned !== nfc, msg: rule.msg };
}

/** Validações: devolvem "" quando está tudo certo ou a chave da mensagem de erro. */
export const VALIDATE = {
  email: (v) => (!v || /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v) ? "" : "vEmail"),
  // aceita o prefixo de país do LinkedIn: es.linkedin.com, br.linkedin.com...
  linkedin: (v) => (!v || /^(?:[a-z]{2}\.)?linkedin\.com\/in\/[^/\s]+$/i.test(v) ? "" : "vLinkedin"),
  // Brasil: DDD + número (10 ou 11 dígitos). Internacional: código do país com "+" e ao menos 8 dígitos.
  telefone: (v, lang = "pt") => {
    if (!v) return "";
    if (lang === "pt") return v.replace(/\D/g, "").length >= 10 ? "" : "vTel";
    return /^\+/.test(v.trim()) && v.replace(/\D/g, "").length >= 8 ? "" : "vTelIntl";
  }
};

/**
 * Valida as datas de uma experiência ou formação.
 * Devolve { inicio, fim } com a chave da mensagem de erro de cada campo ("" quando está ok).
 */
export function dateErrors(item, kind, now = ymNow()) {
  const bad = (v) => v.length === 7 && !isDate(v);
  const fimAtivo = kind === "exp" ? !item.atual : item.status !== "trancado";
  let inicio = bad(item.inicio) ? "dMonth" : "";
  let fim = fimAtivo && bad(item.fim) ? "dMonth" : "";
  if (!inicio && isDate(item.inicio) && ym(item.inicio) > now) inicio = "dStartFuture";
  if (!fim && fimAtivo && isDate(item.inicio) && isDate(item.fim) && ym(item.fim) < ym(item.inicio)) {
    fim = "dEndBefore";
  }
  if (!fim && fimAtivo && isDate(item.fim) && ym(item.fim) > now) {
    if (kind === "exp") fim = "dEndFutureExp";
    else if (item.status !== "andamento") fim = "dEndFutureEdu";
  }
  return { inicio, fim };
}
