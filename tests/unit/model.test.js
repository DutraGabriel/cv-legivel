import assert from "node:assert/strict";
import { test } from "node:test";
import { computeChecks } from "../../assets/js/checks.js";
import { matchJob, extractKeywords, containsTerm } from "../../assets/js/jobmatch.js";
import { eduPeriod, model, plainText } from "../../assets/js/model.js";
import { needsUnicodeFont } from "../../assets/js/pdf.js";
import { dateErrors, sanitize } from "../../assets/js/rules.js";
import { normalize, SAMPLE, sampleFor } from "../../assets/js/state.js";

test("model monta as seções na ordem padrão e respeita 'formação primeiro'", () => {
  assert.deepEqual(
    model(SAMPLE).sections.map((s) => s.key),
    ["resumo", "exp", "edu", "hab", "idi", "cert"]
  );
  assert.deepEqual(
    model({ ...SAMPLE, formacaoPrimeiro: true }).sections.map((s) => s.key),
    ["resumo", "edu", "exp", "hab", "idi", "cert"]
  );
});

test("cada idioma tem os próprios textos fixos e o próprio formato de local e telefone", () => {
  const es = model(sampleFor("es"));
  assert.equal(es.sections[1].t, "Experiencia profesional");
  assert.equal(es.sections[1].jobs[0].meta, "Nuvem Tech | Florianópolis, Brasil (Híbrido) | 03/2022 – Actualidad");
  assert.deepEqual(
    es.contato.slice(0, 2).map((c) => c.text),
    ["Florianópolis, Brasil", "+55 48 99999-0000"]
  );
  assert.equal(es.contato[1].url, "tel:+5548999990000");
  const en = model(sampleFor("en"));
  assert.equal(en.sections[1].jobs[0].meta, "Nuvem Tech | Florianópolis, Brazil (Hybrid) | 03/2022 – Present");
  const pt = model(SAMPLE);
  assert.deepEqual(
    pt.contato.slice(0, 2).map((c) => c.text),
    ["Florianópolis, SC", "(48) 99999-0000"]
  );
});

test("o exemplo de cada idioma passa em toda a checagem", () => {
  for (const lang of ["pt", "en", "es"]) {
    const s = sampleFor(lang);
    assert.deepEqual(
      computeChecks(s, model(s)).filter((c) => !c.ok),
      [],
      lang
    );
  }
});

test("formação em andamento usa 'Início' e 'Previsão de conclusão'", () => {
  assert.equal(
    eduPeriod({ status: "andamento", inicio: "07/2025", fim: "07/2029" }),
    "Início: 07/2025 – Previsão de conclusão: 07/2029"
  );
  assert.equal(eduPeriod({ status: "concluido", inicio: "02/2015", fim: "12/2019" }), "02/2015 – 12/2019");
});

test("contato vira links: e-mail, LinkedIn e portfólio", () => {
  const urls = model(SAMPLE)
    .contato.map((c) => c.url)
    .filter(Boolean);
  assert.deepEqual(urls, [
    "tel:+5548999990000",
    "mailto:mariana.souza@email.com",
    "https://linkedin.com/in/marianasouza",
    "https://github.com/marianasouza"
  ]);
});

test("checagem do exemplo passa em todos os itens", () => {
  const checks = computeChecks(SAMPLE, model(SAMPLE));
  assert.deepEqual(
    checks.filter((c) => !c.ok),
    []
  );
});

test("checagem reconhece verbos de ação no idioma do currículo", () => {
  const en = normalize(
    { ...SAMPLE, exp: [{ ...SAMPLE.exp[0], bullets: "Built APIs used by 120k users\nReduced latency by 40%" }] },
    "en"
  );
  const verbs = (s) => computeChecks(s, model(s))[6].ok; // 7º item: verbos de ação
  assert.equal(verbs(en), true);
  assert.equal(verbs({ ...en, cvLang: "pt" }), false);
});

test("sanitize remove só o que a regra proíbe", () => {
  assert.deepEqual(sanitize("Ana2 Paula!", "nome"), {
    value: "Ana Paula",
    removed: true,
    msg: "rNome"
  });
  assert.equal(sanitize("Desenvolvedor C++ / .NET (Pleno)", "exp.cargo").removed, false);
  assert.equal(sanitize("3M <b>", "exp.empresa").value, "3M b");
  assert.equal(sanitize("qualquer coisa", "campo-sem-regra").removed, false);
});

test("dateErrors aponta fim antes do início, mês inválido e datas futuras", () => {
  const now = 202610;
  assert.equal(dateErrors({ inicio: "01/2020", fim: "12/2019", atual: false }, "exp", now).fim, "dEndBefore");
  assert.equal(dateErrors({ inicio: "13/2020", fim: "", atual: false }, "exp", now).inicio, "dMonth");
  assert.equal(dateErrors({ inicio: "01/2020", fim: "01/2030", atual: false }, "exp", now).fim, "dEndFutureExp");
  assert.equal(dateErrors({ inicio: "01/2025", fim: "01/2029", status: "andamento" }, "edu", now).fim, "");
  assert.equal(dateErrors({ inicio: "01/2020", fim: "01/2030", atual: true }, "exp", now).fim, "");
});

test("comparação com a vaga encontra termos técnicos sem pegar pedaços", () => {
  const vaga =
    "Requisitos: Python, Django REST Framework, .NET, C#, Node.js e CI/CD. Diferencial: Power BI. Desenvolvedor Pleno.";
  const k = extractKeywords(vaga);
  for (const t of [".NET", "C#", "Node.js", "CI/CD", "Power BI", "Python"])
    assert.ok(k.includes(t), `faltou ${t} em ${k}`);
  for (const t of ["NET", "Node", "BI", "Desenvolvedor", "Pleno"]) assert.ok(!k.includes(t), `não devia ter ${t}`);
  assert.equal(containsTerm("Sei C# e Java", "C#"), true);
  assert.equal(containsTerm("Sei C e Java", "C#"), false);
  assert.equal(containsTerm("JavaScript", "Java"), false);
  const r = matchJob(vaga, plainText(model(SAMPLE)));
  assert.ok(r.missing.includes("C#") && r.found.includes("Python"));
});

test("fonte Unicode só é usada quando necessária", () => {
  assert.equal(needsUnicodeFont("Ação, coração, Müller, “aspas” – travessão • €"), false);
  assert.equal(needsUnicodeFont("Łukasz"), true);
  assert.equal(needsUnicodeFont("Иван"), true);
});
