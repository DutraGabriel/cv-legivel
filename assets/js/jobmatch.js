// Compara o currículo com a descrição de uma vaga e aponta palavras-chave ausentes.
// Heurística simples e transparente (sem IA): termos técnicos, siglas, nomes próprios
// e palavras que se repetem na vaga. Pura: pode ser testada no Node.
import { stripAccents } from "./format.js";

// palavras comuns em PT, EN e ES que não dizem nada sobre a vaga
const STOP = new Set(
  (
    "a o e é de da do das dos em no na nos nas um uma uns umas para por com sem que se ao aos à às ou como mais muito " +
    "sua seu suas seus nossa nosso nossas nossos voce você vocês ser ter estar será sera sao são está esta este essa esse " +
    "isso isto pelo pela pelos pelas entre sobre ate até desde quando onde qual quais tambem também já ja não nao sim " +
    "vaga vagas empresa time equipe area área trabalho trabalhar atuar atuacao atuação experiencia experiência conhecimento " +
    "conhecimentos requisitos requisito diferencial diferenciais desejavel desejável beneficios benefícios responsabilidades " +
    "atividades buscamos procuramos oferecemos profissional pessoa pessoas forma boa bom bons boas novo nova novos novas " +
    "anos ano dia dias mes mês meses horas the and for with you your our are will this that from have has can able " +
    "work team role job company experience knowledge skills skill requirements required preferred plus years year strong " +
    "good great new using use within across about into also more must should would other who what which their they them " +
    "el la los las del con por para una unos unas como mas más sus nuestro nuestra empresa equipo trabajo puesto requisitos " +
    "experiencia conocimiento conocimientos años " +
    // títulos e senioridade: o cargo já é conferido em outro lugar e "Desenvolvedor" × "Desenvolvedora" geraria falso alerta
    "junior júnior pleno senior sênior estagiario estagiário trainee desenvolvedor desenvolvedora developer engineer " +
    "engenheiro engenheira analista vacante hiring looking nice have join seja venha buscamos procuramos sobre"
  ).split(/\s+/)
);

const norm = (s) => stripAccents(s).toLowerCase();
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** true se o termo aparece como palavra inteira no texto (funciona com "C#", ".NET", "Node.js"). */
export function containsTerm(text, term) {
  const re = new RegExp(`(^|[^\\p{L}\\p{N}])${escRe(norm(term))}(?=$|[^\\p{L}\\p{N}+#])`, "u");
  return re.test(norm(text));
}

/** Extrai até `limit` palavras-chave da vaga, das mais para as menos relevantes. */
export function extractKeywords(jobText, limit = 30) {
  const text = String(jobText ?? "");
  const scores = new Map(); // termo normalizado → { term, score }
  const add = (term, score) => {
    // tira palavras genéricas das pontas: "Senior Frontend Engineer" → "Frontend"
    const words = term.split(/\s+/);
    while (words.length && STOP.has(norm(words[0]))) words.shift();
    while (words.length && STOP.has(norm(words.at(-1)))) words.pop();
    const t = words.join(" ").replace(/^[^\p{L}\p{N}.#+]+|[^\p{L}\p{N}#+]+$/gu, "");
    const k = norm(t);
    if (t.length < 2 || STOP.has(k) || /^\d+$/.test(k)) return "";
    const cur = scores.get(k) || { term: t, score: 0 };
    cur.score += score;
    scores.set(k, cur);
    return t;
  };
  // termos técnicos: .NET, C#, C++, Node.js, CI/CD, siglas (SQL, AWS) e palavras com maiúscula no meio (PostgreSQL)
  // (os lookarounds evitam pegar pedaços: "NET" de ".NET", "Node" de "Node.js", "Back" de "Back-end")
  const ALONE_L = "(?<![.\\p{L}\\p{N}-])";
  const ALONE_R = "(?![.#+-]?[\\p{L}\\p{N}#+])";
  const TECH = new RegExp(
    `\\.[A-Z][A-Za-z]+|\\b[A-Za-z]\\w*(?:[#+]+|\\.[A-Za-z]+)+|${ALONE_L}[A-Z]{2,}(?:/[A-Z]{2,})?${ALONE_R}|\\b[A-Za-z]+[a-z][A-Z]\\w*\\b`,
    "gu"
  );
  for (const m of text.matchAll(TECH)) add(m[0], 3);
  // 2 ou 3 palavras com inicial maiúscula seguidas: "Power BI", "Django REST Framework"
  const multi = [];
  const MULTI = new RegExp(
    `${ALONE_L}(?:[A-Z][\\p{L}]+|[A-Z]{2,})(?:\\s+(?:[A-Z][\\p{L}]+|[A-Z]{2,})){1,2}${ALONE_R}`,
    "gu"
  );
  for (const m of text.matchAll(MULTI)) {
    const t = add(m[0], 2);
    if (t.includes(" ")) multi.push(t);
  }
  // palavras isoladas com inicial maiúscula: "Python", "Docker", "Kubernetes"
  for (const m of text.matchAll(new RegExp(`${ALONE_L}[A-Z][\\p{L}]{2,}${ALONE_R}`, "gu"))) add(m[0], 2);
  // palavras comuns que se repetem na vaga
  const counts = new Map();
  for (const w of text.match(/[\p{L}][\p{L}\p{N}-]{3,}/gu) || []) {
    const k = norm(w);
    if (!STOP.has(k)) counts.set(k, { term: w.toLowerCase(), n: (counts.get(k)?.n || 0) + 1 });
  }
  for (const { term, n } of counts.values()) if (n >= 2) add(term, n);

  // descarta uma palavra que só aparece dentro de um termo composto ("BI" só em "Power BI")
  const occurrences = (needle, hay) =>
    (norm(hay).match(new RegExp(`(^|[^\\p{L}\\p{N}])${escRe(norm(needle))}(?![\\p{L}\\p{N}])`, "gu")) || []).length;
  for (const [k, { term }] of scores) {
    if (term.includes(" ")) continue;
    const inside = multi.filter((m) => m !== term && containsTerm(m, term)).length;
    if (inside && occurrences(term, text) <= inside) scores.delete(k);
  }

  return [...scores.values()]
    .sort((a, b) => b.score - a.score || a.term.localeCompare(b.term))
    .slice(0, limit)
    .map((x) => x.term);
}

/** Compara a vaga com o texto do currículo. */
export function matchJob(jobText, cvText) {
  const keywords = extractKeywords(jobText);
  const found = keywords.filter((k) => containsTerm(cvText, k));
  const missing = keywords.filter((k) => !containsTerm(cvText, k));
  const score = keywords.length ? Math.round((found.length / keywords.length) * 100) : 0;
  return { keywords, found, missing, score };
}
