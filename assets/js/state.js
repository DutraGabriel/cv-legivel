// Estado do currículo: formato, exemplo, validação do rascunho salvo e migrações.
// `normalize()` é puro: recebe qualquer coisa (até JSON corrompido) e devolve um estado válido.
import { ym, ymNow } from "./format.js";

export const SCHEMA = 2;
export const STORAGE_KEY = "cv-legivel-v1";

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

export const EMPTY = {
  schema: SCHEMA,
  cvLang: "pt",
  nome: "",
  cargo: "",
  email: "",
  telefone: "",
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

export const SAMPLE = {
  ...EMPTY,
  nome: "Mariana Souza",
  cargo: "Desenvolvedora Back-end Pleno",
  email: "mariana.souza@email.com",
  telefone: "(48) 99999-0000",
  uf: "SC",
  cidade: "Florianópolis",
  linkedin: "linkedin.com/in/marianasouza",
  site: "github.com/marianasouza",
  resumo:
    "Desenvolvedora back-end com 5 anos de experiência em Python e Django, focada em APIs REST, integrações e performance de banco de dados. Liderei a migração de um monólito para serviços em AWS e reduzi o tempo médio de resposta em 40%. Busco atuar em produtos SaaS com times ágeis.",
  exp: [
    {
      cargo: "Desenvolvedora Back-end",
      empresa: "Nuvem Tech",
      local: "Florianópolis, SC",
      modalidade: "hibrido",
      inicio: "03/2022",
      fim: "",
      atual: true,
      bullets:
        "Desenvolvi APIs REST em Django REST Framework usadas por 120 mil usuários ativos\nReduzi em 40% o tempo médio de resposta otimizando consultas PostgreSQL e adicionando cache Redis\nImplantei pipeline de CI/CD com GitHub Actions e Docker, cortando o tempo de deploy de 30 para 8 minutos"
    },
    {
      cargo: "Desenvolvedora Júnior",
      empresa: "Agência Pixel",
      local: "",
      modalidade: "remoto",
      inicio: "01/2020",
      fim: "02/2022",
      atual: false,
      bullets:
        "Construí integrações com gateways de pagamento (Stripe, Pagar.me) em Python\nEscrevi testes automatizados com pytest, elevando a cobertura de 35% para 80%"
    }
  ],
  edu: [
    {
      curso: "Bacharelado em Ciência da Computação",
      inst: "Universidade Federal de Santa Catarina (UFSC)",
      status: "concluido",
      inicio: "02/2015",
      fim: "12/2019"
    }
  ],
  habilidades:
    "Back-end: Python, Django, Django REST Framework\nBanco de dados: PostgreSQL, Redis\nInfraestrutura: Docker, AWS, CI/CD\nPráticas: Git, Testes automatizados, Scrum",
  idiomas: "Português: nativo\nInglês: avançado",
  certificacoes: "AWS Certified Cloud Practitioner (2023)"
};

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
export function normalize(raw) {
  const s = isObj(raw) ? raw : {};
  const out = structuredClone(EMPTY);
  for (const f of [
    "nome",
    "cargo",
    "email",
    "telefone",
    "uf",
    "cidade",
    "linkedin",
    "site",
    "resumo",
    "habilidades",
    "idiomas",
    "certificacoes",
    "vaga"
  ]) {
    out[f] = str(s[f]);
  }
  out.cvLang = ["pt", "en", "es"].includes(s.cvLang) ? s.cvLang : "pt";
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

/** Lê o rascunho salvo. Devolve { state, isExample, error }. */
export function load(storage = globalThis.localStorage) {
  let raw;
  try {
    raw = storage?.getItem(STORAGE_KEY) ?? null;
  } catch {
    return { state: structuredClone(SAMPLE), isExample: true, error: "storage" };
  }
  if (raw === null) return { state: structuredClone(SAMPLE), isExample: true, error: null };
  try {
    return { state: normalize(JSON.parse(raw)), isExample: false, error: null };
  } catch {
    // JSON corrompido: começa vazio em vez de travar o site
    return { state: structuredClone(EMPTY), isExample: false, error: "corrupt" };
  }
}

/** Salva o rascunho. Devolve false quando o navegador não permite (aba anônima, cota cheia). */
export function save(state, storage = globalThis.localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clear(storage = globalThis.localStorage) {
  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    /* nada a fazer: o armazenamento já está indisponível */
  }
}
