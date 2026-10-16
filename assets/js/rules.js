// Restrições de caracteres e validações. Funções puras: recebem valores, devolvem mensagens.
import { isDate, ym, ymNow } from "./format.js";

// Cada regra lista o que NÃO pode. O caractere é removido ao digitar e um aviso aparece.
export const RULES = {
  nome: { re: /[^\p{L}\s'’-]/gu, msg: "Use apenas letras, espaço, hífen e apóstrofo." },
  cargo: { re: /[^\p{L}\p{N}\s.+#/()&-]/gu, msg: "Símbolo não permitido. Aceitos: . + # / - ( ) &" },
  local: { re: /[^\p{L}\s,/()'’.-]/gu, msg: "Use apenas letras, vírgula, hífen e parênteses, sem números." },
  curso: { re: /[^\p{L}\s(),./-]/gu, msg: "Use apenas letras e - ( ) , . /" },
  livre: { re: /[<>{}[\]\p{Extended_Pictographic}]/gu, msg: "Caractere não permitido neste campo." },
  texto: { re: /\p{Extended_Pictographic}/gu, msg: "Emojis não são lidos corretamente por sistemas de triagem." },
  link: { re: /\s/g, msg: "Endereços não têm espaços." }
};

/** Campo → regra. Campos simples usam o nome; campos de listas usam "lista.campo". */
export const FIELD_RULE = {
  nome: "nome",
  cargo: "cargo",
  email: "link",
  linkedin: "link",
  site: "link",
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

/** Remove os caracteres proibidos. Devolve o valor limpo e se algo foi removido. */
export function sanitize(value, field) {
  const rule = RULES[FIELD_RULE[field]];
  if (!rule) return { value, removed: false, msg: "" };
  const cleaned = value.replace(rule.re, "");
  return { value: cleaned, removed: cleaned !== value, msg: rule.msg };
}

export const VALIDATE = {
  email: (v) =>
    !v || /^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(v) ? "" : "E-mail incompleto. Ex.: nome.sobrenome@email.com",
  linkedin: (v) =>
    !v || /^linkedin\.com\/in\/[^/\s]+$/i.test(v) ? "" : "Use o endereço do perfil: linkedin.com/in/seu-perfil",
  telefone: (v) => (!v || v.replace(/\D/g, "").length >= 10 ? "" : "Telefone incompleto: informe DDD + número.")
};

/**
 * Valida as datas de uma experiência ou formação.
 * Devolve { inicio, fim } com a mensagem de erro de cada campo ("" quando está ok).
 */
export function dateErrors(item, kind, now = ymNow()) {
  const bad = (v) => v.length === 7 && !isDate(v);
  const fimAtivo = kind === "exp" ? !item.atual : item.status !== "trancado";
  let inicio = bad(item.inicio) ? "Mês inválido: use de 01 a 12." : "";
  let fim = fimAtivo && bad(item.fim) ? "Mês inválido: use de 01 a 12." : "";
  if (!inicio && isDate(item.inicio) && ym(item.inicio) > now) inicio = "O início não pode estar no futuro.";
  if (!fim && fimAtivo && isDate(item.inicio) && isDate(item.fim) && ym(item.fim) < ym(item.inicio)) {
    fim = "O fim não pode ser antes do início.";
  }
  if (!fim && fimAtivo && isDate(item.fim) && ym(item.fim) > now) {
    if (kind === "exp") fim = 'Data no futuro. Se ainda trabalha aqui, marque "Trabalho aqui atualmente".';
    else if (item.status !== "andamento") fim = 'Conclusão no futuro? Mude a situação para "Em andamento".';
  }
  return { inicio, fim };
}
