// Checagem de boas práticas para ATS. Pura: recebe estado + modelo e devolve a lista de itens.
import { isDate, stripAccents, wordCount } from "./format.js";
import { DICTS, LANGS, t } from "./i18n/index.js";

// regras de verbo de cada idioma, vindas de assets/js/i18n/*.js (rules)
const VERBS = Object.fromEntries(
  LANGS.map((l) => {
    const r = DICTS[l].rules;
    return [
      l,
      { past: new RegExp(r.past, "u"), current: new RegExp(r.current, "u"), irregular: new Set(r.irregular.split(" ")) }
    ];
  })
);

/**
 * A conquista começa com um verbo de ação? Passado pela terminação ou pela lista de irregulares.
 * No emprego atual (`current`), o presente também vale: "Desenvolvo", "Develop", "Lidero".
 * Ex.: "Desenvolvi", "Criei", "Fiz" (pt); "Developed", "Built" (en); "Desarrollé", "Hice" (es).
 */
export function startsWithActionVerb(bullet, lang = "pt", current = false) {
  const v = VERBS[lang] || VERBS.pt;
  const word = (bullet.trim().split(/\s+/)[0] || "").toLowerCase().replace(/[^\p{L}]/gu, "");
  if (v.irregular.has(stripAccents(word))) return true;
  if (word.length < 4) return current && v.current.test(word);
  return v.past.test(word) || (current && v.current.test(word));
}

const excerpt = (s) => `“${s.length > 45 ? `${s.slice(0, 45).trimEnd()}…` : s}”`;

/** Devolve [{ ok, text }] na ordem em que aparecem na tela, no idioma do rascunho. */
export function computeChecks(s, m, errorCount = 0) {
  const lang = VERBS[s.cvLang] ? s.cvLang : "pt";
  const tr = (key, params) => t(key, params, lang);
  const withDetail = (key, detail) => (detail ? `${tr(key)} ${detail}` : tr(key));
  // mesmas conquistas que vão para o currículo (experiências preenchidas, linhas quebradas já unidas)
  const jobs = m.sections.find((sec) => sec.key === "exp")?.jobs || [];
  const bullets = jobs.flatMap((j) => j.bullets);
  const words = wordCount(s.resumo);
  const expPreenchidas = s.exp.filter((x) => x.cargo.trim() || x.empresa.trim());
  const comNumero = bullets.filter((b) => /\d/.test(b)).length;
  const semVerbo = jobs.flatMap((j) => j.bullets.filter((b) => !startsWithActionVerb(b, lang, j.current)));
  const longas = bullets.filter((b) => b.length > 220);
  const none = bullets.length ? "" : tr("cNone");
  return [
    { ok: !!(s.nome.trim() && s.email.trim() && s.telefone.trim()), text: tr("cContact") },
    { ok: !!s.cargo.trim(), text: tr("cCargo") },
    { ok: words >= 30 && words <= 90, text: tr("cResumo", { n: words }) },
    { ok: m.skills.length >= 6, text: tr("cSkills", { n: m.skills.length }) },
    { ok: expPreenchidas.every((x) => isDate(x.inicio) && (x.atual || isDate(x.fim))), text: tr("cDates") },
    {
      ok: bullets.length > 0 && comNumero >= Math.ceil(bullets.length / 2),
      text: withDetail("cNumbers", none || tr("cNow", { a: comNumero, b: bullets.length }))
    },
    {
      ok: bullets.length > 0 && semVerbo.length === 0,
      text: withDetail(
        "cVerbs",
        none ||
          (semVerbo.length && tr("cVerbsFail", { a: semVerbo.length, b: bullets.length, ex: excerpt(semVerbo[0]) }))
      )
    },
    {
      ok: longas.length === 0,
      text: withDetail("cLength", longas.length && tr("cLengthFail", { ex: excerpt(longas[0]) }))
    },
    { ok: !!s.linkedin.trim(), text: tr("cLinkedin") },
    { ok: errorCount === 0, text: errorCount ? tr("cErrors", { n: errorCount }) : tr("cNoErrors") }
  ];
}
