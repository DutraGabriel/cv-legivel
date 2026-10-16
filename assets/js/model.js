// Transforma o estado do formulário na estrutura do currículo.
// A prévia (HTML) e o PDF desenham a partir desta mesma estrutura: o que se vê é o que sai no arquivo.
import { CV_TEXT } from "./cv-i18n.js";
import { bulletLines, fmtDate, fmtPhone, labeled, lines } from "./format.js";

const PAIS = { en: "Brazil", es: "Brasil" };
const join = (parts, sep = " | ") =>
  parts
    .map((v) => String(v ?? "").trim())
    .filter(Boolean)
    .join(sep);

export const period = (inicio, fim, atual, t = CV_TEXT.pt) => {
  const i = fmtDate(inicio);
  const f = atual ? t.atual : fmtDate(fim);
  return i && f ? `${i} – ${f}` : i || f;
};

// "Início: 07/2025 – Previsão de conclusão: 07/2029" quando em andamento
export const eduPeriod = (x, t = CV_TEXT.pt) => {
  if (x.status === "andamento")
    return join([x.inicio && `${t.inicio}: ${x.inicio}`, x.fim && `${t.previsao}: ${x.fim}`], " – ");
  if (x.status === "trancado") return x.inicio ? `${t.inicio}: ${x.inicio}` : "";
  return period(x.inicio, x.fim, false, t);
};

// "Florianópolis, SC (Híbrido)", ou só um dos dois
export const localModalidade = (x, t = CV_TEXT.pt) => {
  const l = x.local.trim();
  const m = t.mod[x.modalidade] || "";
  return l && m ? `${l} (${m})` : l || m;
};

const httpUrl = (v) => (v ? `https://${v.replace(/^https?:\/\//i, "")}` : "");

export function model(s) {
  const t = CV_TEXT[s.cvLang] || CV_TEXT.pt;
  const local = join([s.cidade, s.uf, s.cidade && PAIS[s.cvLang]], ", ");
  const contato = [
    { text: local },
    { text: fmtPhone(s.telefone), url: s.telefone ? `tel:+55${s.telefone.replace(/\D/g, "")}` : "" },
    { text: s.email.trim(), url: s.email.trim() ? `mailto:${s.email.trim()}` : "" },
    { text: s.linkedin.trim(), url: httpUrl(s.linkedin.trim()) },
    { text: s.site.trim(), url: httpUrl(s.site.trim()) }
  ].filter((c) => c.text);

  const sections = [];
  if (s.resumo.trim()) sections.push({ key: "resumo", t: t.resumo, paras: [s.resumo.trim()] });

  const exp = s.exp
    .filter((x) => x.cargo.trim() || x.empresa.trim())
    .map((x) => ({
      title: x.cargo.trim(),
      meta: join([x.empresa, localModalidade(x, t), period(x.inicio, x.fim, x.atual, t)]),
      bullets: bulletLines(x.bullets)
    }));
  const edu = s.edu
    .filter((x) => x.curso.trim() || x.inst.trim())
    .map((x) => ({ title: x.curso.trim(), meta: join([x.inst, t.status[x.status], eduPeriod(x, t)]), bullets: [] }));
  const expSec = exp.length && { key: "exp", t: t.exp, jobs: exp };
  const eduSec = edu.length && { key: "edu", t: t.edu, jobs: edu };
  sections.push(...(s.formacaoPrimeiro ? [eduSec, expSec] : [expSec, eduSec]).filter(Boolean));

  // habilidades: "Categoria: itens" em linhas viram lista; uma linha só, sem categoria, vira parágrafo
  const hab = lines(s.habilidades).map((l) => labeled(l));
  const skills = hab
    .flatMap((h) => h.text.split(/[,;]/))
    .map((v) => v.trim())
    .filter(Boolean);
  if (hab.length === 1 && !hab[0].label) sections.push({ key: "hab", t: t.hab, paras: [skills.join(", ")] });
  else if (hab.length) sections.push({ key: "hab", t: t.hab, list: hab });

  const idi = lines(s.idiomas).map((l) => labeled(l, true));
  if (idi.length) sections.push({ key: "idi", t: t.idi, list: idi });
  // certificações não usam rótulo: nomes como "Microsoft Certified: ..." têm dois-pontos
  const cert = lines(s.certificacoes).map((text) => ({ label: "", text }));
  if (cert.length) sections.push({ key: "cert", t: t.cert, list: cert });

  return { lang: s.cvLang, t, nome: s.nome.trim(), cargo: s.cargo.trim(), contato, sections, skills };
}

/** Texto corrido do currículo, na ordem de leitura. Usado na comparação com a vaga. */
export function plainText(m) {
  const out = [m.nome, m.cargo, m.contato.map((c) => c.text).join(" | ")];
  for (const sec of m.sections) {
    out.push(sec.t);
    (sec.paras || []).forEach((p) => out.push(p));
    (sec.jobs || []).forEach((j) => out.push(j.title, j.meta, ...j.bullets));
    (sec.list || []).forEach((it) => out.push(it.label ? `${it.label}: ${it.text}` : it.text));
  }
  return out.filter(Boolean).join("\n");
}
