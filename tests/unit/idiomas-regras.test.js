// Regras que precisam funcionar nos três idiomas: caracteres aceitos, links, verbos e vaga.
import assert from "node:assert/strict";
import { test } from "node:test";
import { computeChecks, startsWithActionVerb } from "../../assets/js/checks.js";
import { cleanUrl } from "../../assets/js/format.js";
import { extractKeywords } from "../../assets/js/jobmatch.js";
import { model } from "../../assets/js/model.js";
import { sanitize, VALIDATE } from "../../assets/js/rules.js";
import { normalize, sampleFor } from "../../assets/js/state.js";

test("acentos colados em forma decomposta (NFD) não são apagados", () => {
  const decomposto = "José Peña".normalize("NFD");
  assert.notEqual(decomposto, "José Peña");
  assert.deepEqual(sanitize(decomposto, "nome"), { value: "José Peña", removed: false, msg: "rNome" });
  assert.equal(sanitize("Conceição".normalize("NFD"), "cidade").value, "Conceição");
});

test("caracteres comuns em inglês e espanhol são aceitos", () => {
  for (const [v, campo] of [
    ["John A. Smith Jr.", "nome"],
    ["María O'Neill", "nome"],
    ["Bachelor's in Computer Science", "edu.curso"],
    ["MBA: Data & Analytics 2", "edu.curso"],
    ["Head of Data, LATAM", "exp.cargo"],
    ["Engineer II: Platform", "exp.cargo"]
  ]) {
    assert.deepEqual(sanitize(v, campo), { value: v, removed: false, msg: sanitize(v, campo).msg }, v);
  }
  assert.equal(sanitize("Ana2 Paula!", "nome").value, "Ana Paula"); // números e símbolos continuam fora
});

test("LinkedIn com prefixo de país é limpo e aceito", () => {
  assert.equal(cleanUrl("https://es.linkedin.com/in/ana-perez/?locale=es_ES"), "linkedin.com/in/ana-perez");
  assert.equal(cleanUrl("br.linkedin.com/in/joao"), "linkedin.com/in/joao");
  assert.equal(cleanUrl("es.wikipedia.org/wiki/x"), "es.wikipedia.org/wiki/x"); // só o LinkedIn
  assert.equal(VALIDATE.linkedin("es.linkedin.com/in/ana-perez"), "");
  assert.equal(VALIDATE.linkedin("linkedin.com/company/x"), "vLinkedin");
});

test("verbos: passado sempre; presente só no emprego atual", () => {
  const casos = [
    // [conquista, idioma, emprego atual?, esperado]
    ["Developed APIs", "en", false, true],
    ["Develop APIs", "en", false, false],
    ["Develop APIs", "en", true, true],
    ["Optimize queries", "en", true, true],
    ["Responsible for APIs", "en", true, false],
    ["Desenvolvi APIs", "pt", false, true],
    ["Desenvolvo APIs", "pt", false, false],
    ["Desenvolvo APIs", "pt", true, true],
    ["Gestão de clientes", "pt", true, false],
    ["Desenvolvimento de APIs", "pt", true, false],
    ["Desarrollé APIs", "es", false, true],
    ["Lideró el equipo", "es", false, true],
    ["Lidero el equipo", "es", true, true],
    ["Mantenimiento de servidores", "es", true, false],
    ["Hice 3 migraciones", "es", false, true]
  ];
  for (const [b, lang, atual, esperado] of casos) {
    assert.equal(startsWithActionVerb(b, lang, atual), esperado, `${lang} "${b}" atual=${atual}`);
  }
});

test("checagem aceita o presente no emprego atual (costume em inglês)", () => {
  const base = sampleFor("en");
  const bullets = "Lead a team of 5 engineers\nOptimize 12 data pipelines";
  const atual = normalize({ ...base, exp: [{ ...base.exp[0], atual: true, bullets }] }, "en");
  const anterior = normalize({ ...base, exp: [{ ...base.exp[0], atual: false, fim: "01/2024", bullets }] }, "en");
  const verbos = (s) => computeChecks(s, model(s))[6];
  assert.equal(verbos(atual).ok, true);
  assert.equal(verbos(anterior).ok, false);
});

test("comparação com a vaga ignora palavras comuns em espanhol e inglês", () => {
  const es =
    "Buscamos Desarrollador Frontend. Responsabilidades: Desarrollar interfaces con React y TypeScript. " +
    "Ofrecemos trabajo remoto. Valoramos conocimientos de Docker. Deseable inglés avanzado. Somos una empresa ágil.";
  const k = extractKeywords(es);
  for (const termo of ["React", "TypeScript", "Docker", "Frontend"]) assert.ok(k.includes(termo), `faltou ${termo}`);
  for (const ruido of ["Buscamos", "Ofrecemos", "Valoramos", "Deseable", "Somos", "Desarrollar", "Responsabilidades"])
    assert.ok(!k.includes(ruido), `não devia ter ${ruido}`);
  const en = extractKeywords(
    "Responsibilities: Build interfaces with React. Collaborate with design. Nice to have: Docker."
  );
  for (const ruido of ["Responsibilities", "Build", "Collaborate"])
    assert.ok(!en.includes(ruido), `não devia ter ${ruido}`);
});
