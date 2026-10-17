// Estado do currículo: formato, exemplo, validação do rascunho salvo e migrações.
// Cada idioma (pt, en, es) tem o seu próprio rascunho salvo, como páginas independentes.
// `normalize()` é puro: recebe qualquer coisa (até JSON corrompido) e devolve um estado válido.
import { ym, ymNow } from "./format.js";
import { DICTS, LANGS } from "./i18n/index.js";

export const SCHEMA = 3;
/** Chave do rascunho no localStorage. O português mantém a chave antiga, de antes dos idiomas. */
export const storageKey = (lang = "pt") => (lang === "pt" ? "cv-legivel-v1" : `cv-legivel-v1-${lang}`);
export const STORAGE_KEY = storageKey("pt");

export const UFS = [
  ["AC", "Acre"],
  ["AL", "Alagoas"],
  ["AP", "Amapá"],
  ["AM", "Amazonas"],
  ["BA", "Bahia"],
  ["CE", "Ceará"],
  ["DF", "Distrito Federal"],
  ["ES", "Espírito Santo"],
  ["GO", "Goiás"],
  ["MA", "Maranhão"],
  ["MT", "Mato Grosso"],
  ["MS", "Mato Grosso do Sul"],
  ["MG", "Minas Gerais"],
  ["PA", "Pará"],
  ["PB", "Paraíba"],
  ["PR", "Paraná"],
  ["PE", "Pernambuco"],
  ["PI", "Piauí"],
  ["RJ", "Rio de Janeiro"],
  ["RN", "Rio Grande do Norte"],
  ["RS", "Rio Grande do Sul"],
  ["RO", "Rondônia"],
  ["RR", "Roraima"],
  ["SC", "Santa Catarina"],
  ["SP", "São Paulo"],
  ["SE", "Sergipe"],
  ["TO", "Tocantins"]
];

export const EMPTY_EXP = {
  cargo: "",
  empresa: "",
  local: "",
  modalidade: "",
  inicio: "",
  fim: "",
  atual: false,
  bullets: ""
};
export const EMPTY_EDU = { curso: "", inst: "", status: "", inicio: "", fim: "" };

/**
 * `cvLang` é o idioma do rascunho (igual ao da página).
 * Português usa `uf` + `cidade` (lista do IBGE); inglês e espanhol usam `pais` (código ISO) + `cidade` livre.
 */
export const EMPTY = {
  schema: SCHEMA,
  cvLang: "pt",
  nome: "",
  cargo: "",
  email: "",
  telefone: "",
  pais: "",
  uf: "",
  cidade: "",
  linkedin: "",
  site: "",
  resumo: "",
  exp: [EMPTY_EXP],
  edu: [EMPTY_EDU],
  formacaoPrimeiro: false,
  habilidades: "",
  idiomas: "",
  certificacoes: "",
  vaga: ""
};

/** Rascunho vazio de um idioma. */
export const emptyFor = (lang = "pt") => ({ ...structuredClone(EMPTY), cvLang: lang });
/** Currículo de exemplo (Mariana Souza) no idioma pedido. */
export const sampleFor = (lang = "pt") => normalize(DICTS[lang].sample, lang);

const isObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v) => (typeof v === "string" ? v : v == null ? "" : String(v));
// sem acento e minúsculo, para reconhecer "Híbrido", "hibrido" e "HÍBRIDO"
const key = (v) => str(v).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

const MOD_ALIASES = { presencial: "presencial", hibrido: "hibrido", remoto: "remoto" };
const STATUS_ALIASES = {
  concluido: "concluido",
  "em andamento": "andamento",
  andamento: "andamento",
  trancado: "trancado"
};

// "03/2022", "2022-03" (versão antiga) ou "15/03/2022" (versão com dia) → "03/2022"
function migrateDate(v) {
  const s = str(v).trim();
  const iso = /^(\d{4})-(\d{2})$/.exec(s);
  if (iso) return `${iso[2]}/${iso[1]}`;
  const full = /^\d{2}\/(\d{2})\/(\d{4})$/.exec(s);
  if (full) return `${full[1]}/${full[2]}`;
  return s.slice(0, 7);
}

function normalizeExp(raw) {
  const x = { ...EMPTY_EXP };
  if (!isObj(raw)) return x;
  for (const f of ["cargo", "empresa", "local", "bullets"]) x[f] = str(raw[f]);
  x.inicio = migrateDate(raw.inicio);
  x.fim = migrateDate(raw.fim);
  x.atual = raw.atual === true;
  if (raw.modalidade === undefined) {
    // versão antiga: "Florianópolis, SC (híbrido)" ou "Remoto" num único campo
    const v = x.local.trim();
    const paren = /^(.*?)\s*\(([^)]+)\)$/.exec(v);
    if (MOD_ALIASES[key(v)]) {
      x.modalidade = MOD_ALIASES[key(v)];
      x.local = "";
    } else if (paren && MOD_ALIASES[key(paren[2])]) {
      x.modalidade = MOD_ALIASES[key(paren[2])];
      x.local = paren[1];
    }
  } else {
    x.modalidade = MOD_ALIASES[key(raw.modalidade)] || "";
  }
  return x;
}

function normalizeEdu(raw) {
  const x = { ...EMPTY_EDU };
  if (!isObj(raw)) return x;
  x.curso = str(raw.curso);
  x.inst = str(raw.inst);
  x.inicio = migrateDate(raw.inicio);
  x.fim = migrateDate(raw.fim);
  if (raw.status === undefined) {
    // versão sem situação: conclusão no futuro = em andamento
    x.status = !x.fim ? "" : ym(x.fim) > ymNow() ? "andamento" : "concluido";
  } else {
    x.status = STATUS_ALIASES[key(raw.status)] || "";
  }
  return x;
}

/** Converte qualquer valor salvo (inclusive de versões antigas ou corrompido) num estado válido. */
export function normalize(raw, lang = "pt") {
  const s = isObj(raw) ? raw : {};
  const out = emptyFor(LANGS.includes(lang) ? lang : "pt");
  const fields = ["nome", "cargo", "email", "telefone", "uf", "cidade", "linkedin", "site", "resumo"];
  for (const f of [...fields, "habilidades", "idiomas", "certificacoes", "vaga"]) out[f] = str(s[f]);
  out.pais = /^[A-Z]{2}$/.test(str(s.pais)) ? s.pais : "";
  out.formacaoPrimeiro = s.formacaoPrimeiro === true;
  out.exp = Array.isArray(s.exp) && s.exp.length ? s.exp.map(normalizeExp) : [{ ...EMPTY_EXP }];
  out.edu = Array.isArray(s.edu) && s.edu.length ? s.edu.map(normalizeEdu) : [{ ...EMPTY_EDU }];

  // versão antiga: "Cidade, UF" num único campo
  if (s.uf === undefined) {
    const m = /^(.*?),\s*([A-Za-z]{2})$/.exec(out.cidade.trim());
    const uf = m && m[2].toUpperCase();
    if (uf && UFS.some(([sigla]) => sigla === uf)) {
      out.uf = uf;
      out.cidade = m[1].trim();
    }
  }
  if (!UFS.some(([sigla]) => sigla === out.uf)) out.uf = "";
  return out;
}

/**
 * Copia um rascunho para outro idioma, adaptando local e telefone:
 * do português (UF + telefone brasileiro) para inglês/espanhol (país + telefone internacional) e vice-versa.
 */
export function copyToLang(state, lang) {
  const out = normalize(state, lang);
  const digits = state.telefone.replace(/\D/g, "");
  if (state.cvLang === "pt" && lang !== "pt") {
    out.pais = "BR";
    out.uf = "";
    if (digits.length >= 10) out.telefone = `+55 ${digits.slice(0, 2)} ${digits.slice(2, -4)}-${digits.slice(-4)}`;
  } else if (state.cvLang !== "pt" && lang === "pt") {
    out.uf = ""; // a cidade livre não corresponde a uma UF da lista do IBGE: a pessoa escolhe de novo
    out.cidade = state.pais === "BR" ? state.cidade : "";
    if (state.pais === "BR" && digits.startsWith("55")) out.telefone = digits.slice(2);
  }
  return out;
}

/**
 * Rascunho vindo de um arquivo exportado, para a página do idioma `lang`.
 * Um arquivo de outro idioma passa por copyToLang (telefone e local adaptados);
 * arquivos de antes dos idiomas, sem `cvLang`, eram em português.
 */
export function fromImport(data, lang) {
  const from = LANGS.includes(data?.cvLang) ? data.cvLang : "pt";
  return copyToLang(normalize(data, from), lang);
}

/** Lê o rascunho salvo de um idioma. Devolve { state, isExample, error }. */
export function load(storage = globalThis.localStorage, lang = "pt") {
  let raw;
  try {
    raw = storage?.getItem(storageKey(lang)) ?? null;
  } catch {
    return { state: sampleFor(lang), isExample: true, error: "storage" };
  }
  if (raw === null) return { state: sampleFor(lang), isExample: true, error: null };
  try {
    return { state: normalize(JSON.parse(raw), lang), isExample: false, error: null };
  } catch {
    // JSON corrompido: começa vazio em vez de travar o site
    return { state: emptyFor(lang), isExample: false, error: "corrupt" };
  }
}

/** true se existe rascunho salvo nesse idioma. */
export function hasDraft(storage = globalThis.localStorage, lang = "pt") {
  try {
    return storage?.getItem(storageKey(lang)) != null;
  } catch {
    return false;
  }
}

/** Salva o rascunho. Devolve false quando o navegador não permite (aba anônima, cota cheia). */
export function save(state, storage = globalThis.localStorage) {
  try {
    storage.setItem(storageKey(state.cvLang), JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clear(storage = globalThis.localStorage, lang = "pt") {
  try {
    storage.removeItem(storageKey(lang));
  } catch {
    /* nada a fazer: o armazenamento já está indisponível */
  }
}

/** Exemplo em português, usado nos testes. */
export const SAMPLE = sampleFor("pt");
