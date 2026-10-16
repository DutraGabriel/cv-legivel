// Checagem de boas práticas para ATS. Pura: recebe estado + modelo e devolve a lista de itens.
import { IRREGULAR_VERBS } from "./cv-i18n.js";
import { isDate, stripAccents, wordCount } from "./format.js";

const IRREGULAR = Object.fromEntries(Object.entries(IRREGULAR_VERBS).map(([k, v]) => [k, new Set(v.split(" "))]));

/**
 * A conquista começa com um verbo no passado? Regulares pela terminação, irregulares pela lista.
 * Ex.: "Desenvolvi", "Criei", "Abri", "Fiz" (pt); "Developed", "Built" (en); "Desarrollé", "Hice" (es).
 */
export function startsWithActionVerb(bullet, lang = "pt") {
  const word = (bullet.trim().split(/\s+/)[0] || "").toLowerCase().replace(/[^\p{L}]/gu, "");
  const plain = stripAccents(word);
  if (IRREGULAR[lang]?.has(plain)) return true;
  if (plain.length < 4) return false;
  if (lang === "en") return plain.endsWith("ed");
  if (lang === "es") return /[éí]$/.test(word);
  return /(ei|i)$/.test(plain); // pretérito perfeito: criei, implementei, desenvolvi, construí, abri
}

const excerpt = (s) => `“${s.length > 45 ? `${s.slice(0, 45).trimEnd()}…` : s}”`;

/** Devolve [{ ok, text }] na ordem em que aparecem na tela. */
export function computeChecks(s, m, errorCount = 0) {
  // mesmas conquistas que vão para o currículo (experiências preenchidas, linhas quebradas já unidas)
  const bullets = (m.sections.find((sec) => sec.key === "exp")?.jobs || []).flatMap((j) => j.bullets);
  const words = wordCount(s.resumo);
  const lang = IRREGULAR[s.cvLang] ? s.cvLang : "pt";
  const expPreenchidas = s.exp.filter((x) => x.cargo.trim() || x.empresa.trim());
  const comNumero = bullets.filter((b) => /\d/.test(b)).length;
  const semVerbo = bullets.filter((b) => !startsWithActionVerb(b, lang));
  const longas = bullets.filter((b) => b.length > 220);
  return [
    {
      ok: !!(s.nome.trim() && s.email.trim() && s.telefone.trim()),
      text: "Nome, e-mail e telefone no corpo do documento"
    },
    { ok: !!s.cargo.trim(), text: "Cargo pretendido abaixo do nome" },
    { ok: words >= 30 && words <= 90, text: `Resumo entre 30 e 90 palavras (agora: ${words})` },
    { ok: m.skills.length >= 6, text: `Pelo menos 6 habilidades (agora: ${m.skills.length})` },
    {
      ok: expPreenchidas.every((x) => isDate(x.inicio) && (x.atual || isDate(x.fim))),
      text: "Toda experiência tem início e fim (MM/AAAA)"
    },
    {
      ok: bullets.length > 0 && comNumero >= Math.ceil(bullets.length / 2),
      text: bullets.length
        ? `Metade ou mais das conquistas com números (agora: ${comNumero} de ${bullets.length})`
        : "Metade ou mais das conquistas com números (nenhuma conquista ainda)"
    },
    {
      ok: bullets.length > 0 && semVerbo.length === 0,
      text: !bullets.length
        ? "Conquistas começam com verbo de ação (nenhuma conquista ainda)"
        : semVerbo.length
          ? `Conquistas começam com verbo de ação no passado (${semVerbo.length} de ${bullets.length} não começa${semVerbo.length > 1 ? "m" : ""}: ${excerpt(semVerbo[0])})`
          : "Conquistas começam com verbo de ação"
    },
    {
      ok: longas.length === 0,
      text: longas.length
        ? `Conquistas com até 2 linhas cada (longa: ${excerpt(longas[0])})`
        : "Conquistas com até 2 linhas cada"
    },
    { ok: !!s.linkedin.trim(), text: "Link do LinkedIn" },
    {
      ok: errorCount === 0,
      text: errorCount ? `Campos com erro no formulário (${errorCount})` : "Nenhum campo com erro"
    }
  ];
}
