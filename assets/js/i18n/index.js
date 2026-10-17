// Idiomas do site. Cada página (/, /en/, /es/) declara o seu em <html data-lang="...">.
// Funções puras quando recebem `lang`; sem ele, usam o idioma da página atual.
import en from "./en.js";
import es from "./es.js";
import pt from "./pt.js";

export const DICTS = { pt, en, es };
export const LANGS = ["pt", "en", "es"];
/** Pasta de cada idioma em relação à raiz do site. */
export const LANG_PATH = { pt: "", en: "en/", es: "es/" };

export const pageLang = () => {
  const l = globalThis.document?.documentElement.dataset.lang;
  return DICTS[l] ? l : "pt";
};

/** Valor de uma chave com pontos: lookup(obj, "mod.hibrido"). */
export const lookup = (obj, key) => key.split(".").reduce((o, k) => (o == null ? o : o[k]), obj);

const pluralRules = {};
/**
 * Textos com quantidade são { one, other }: escolhe a forma certa para `n` com Intl.PluralRules.
 * Zero usa sempre o plural ("0 palavras", "0 words", "0 palabras").
 */
function plural(forms, n, lang) {
  if (!Number.isFinite(n) || n === 0) return forms.other;
  pluralRules[lang] ??= new Intl.PluralRules(DICTS[lang].meta.htmlLang);
  return forms[pluralRules[lang].select(n)] ?? forms.other;
}

/** Texto da interface: t("cResumo", { n: 40 }) → "Resumo entre 30 e 90 palavras (agora: 40)". */
export function t(key, params = {}, lang = pageLang()) {
  let s = lookup(DICTS[lang].ui, key) ?? lookup(DICTS.pt.ui, key) ?? key;
  if (s && typeof s === "object" && "other" in s) s = plural(s, Number(params.n), lang);
  return typeof s === "string" ? s.replace(/\{(\w+)\}/g, (m, k) => (k in params ? String(params[k]) : m)) : s;
}

/** Textos fixos do currículo (títulos de seção, "Atual", modalidade...). */
export const cvText = (lang = pageLang()) => DICTS[lang]?.cv || DICTS.pt.cv;

// Códigos que o Intl conhece mas não servem para um endereço: regiões, uso reservado
// e códigos antigos que repetiriam um país (DD = Alemanha, SU = Rússia, YU = Sérvia...)
const NOT_COUNTRIES = new Set("AC AN BU CP CQ CS DD DG EA EU EZ FX IC NT QO SU TA TP UN XA XB YD YU ZR ZZ".split(" "));
const nameCache = {};

/** Nome do país no idioma pedido: countryName("BR", "en") → "Brazil". */
export function countryName(code, lang = pageLang()) {
  if (!code) return "";
  nameCache[lang] ??= new Intl.DisplayNames([DICTS[lang].meta.htmlLang], { type: "region", fallback: "none" });
  return nameCache[lang].of(code) || "";
}

/** Lista [código, nome] de todos os países, em ordem alfabética no idioma pedido. */
export function countries(lang = pageLang()) {
  const out = [];
  for (let a = 65; a <= 90; a++) {
    for (let b = 65; b <= 90; b++) {
      const code = String.fromCharCode(a, b);
      if (NOT_COUNTRIES.has(code)) continue;
      const name = countryName(code, lang);
      if (name && name !== code && !out.some(([, n]) => n === name)) out.push([code, name]);
    }
  }
  return out.sort((x, y) => x[1].localeCompare(y[1], DICTS[lang].meta.htmlLang));
}
