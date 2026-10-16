// Checagem de boas práticas para ATS. Pura: recebe estado + modelo e devolve a lista de itens.
import { ACTION_VERBS } from "./cv-i18n.js";
import { isDate, lines, stripAccents, wordCount } from "./format.js";

const startsWithVerb = (bullet, lang) => {
  const first = stripAccents(bullet).toLowerCase().split(/\s+/)[0] || "";
  return ACTION_VERBS[lang].split(" ").some((v) => first.startsWith(v));
};

/** Devolve [{ ok, text }] na ordem em que aparecem na tela. */
export function computeChecks(s, m, errorCount = 0) {
  const bullets = s.exp.flatMap((x) => lines(x.bullets));
  const words = wordCount(s.resumo);
  const lang = ACTION_VERBS[s.cvLang] ? s.cvLang : "pt";
  const expPreenchidas = s.exp.filter((x) => x.cargo.trim() || x.empresa.trim());
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
      ok: bullets.length > 0 && bullets.filter((b) => /\d/.test(b)).length >= Math.ceil(bullets.length / 2),
      text: "Metade ou mais das conquistas com números"
    },
    {
      ok: bullets.length > 0 && bullets.every((b) => startsWithVerb(b, lang)),
      text: "Conquistas começam com verbo de ação"
    },
    { ok: bullets.every((b) => b.length <= 220), text: "Conquistas com até 2 linhas cada" },
    { ok: !!s.linkedin.trim(), text: "Link do LinkedIn" },
    {
      ok: errorCount === 0,
      text: errorCount ? `Campos com erro no formulário (${errorCount})` : "Nenhum campo com erro"
    }
  ];
}
