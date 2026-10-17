import assert from "node:assert/strict";
import { test } from "node:test";
import { computeChecks, startsWithActionVerb } from "../../assets/js/checks.js";
import { bulletLines } from "../../assets/js/format.js";
import { model } from "../../assets/js/model.js";
import { normalize, SAMPLE } from "../../assets/js/state.js";

test("bulletLines junta as linhas quebradas de um texto colado de PDF", () => {
  const colado =
    "• Desenvolvi novas funcionalidades em sistemas internos de segurança da informação\n" +
    "utilizados pela empresa, com atuação no front-end.\n" +
    "• Corrigi 30 bugs em formulários de cadastro";
  assert.deepEqual(bulletLines(colado), [
    "Desenvolvi novas funcionalidades em sistemas internos de segurança da informação utilizados pela empresa, com atuação no front-end.",
    "Corrigi 30 bugs em formulários de cadastro"
  ]);
});

test("bulletLines: sem marcadores, linha com minúscula é continuação; com maiúscula é conquista nova", () => {
  assert.deepEqual(bulletLines("Criei 3 telas\nem React\nReduzi 20% dos erros"), [
    "Criei 3 telas em React",
    "Reduzi 20% dos erros"
  ]);
  assert.deepEqual(bulletLines("1. Criei 3 telas\n2) Reduzi erros"), ["Criei 3 telas", "Reduzi erros"]);
});

test("verbos de ação no passado: regulares pela terminação e irregulares pela lista", () => {
  for (const b of [
    "Desenvolvi APIs",
    "Criei painéis",
    "Abri chamados",
    "Fiz 40 entregas",
    "Construí",
    "Contribuí",
    "Auxiliei",
    "Utilizei",
    "Trabalhei"
  ]) {
    assert.ok(startsWithActionVerb(b, "pt"), b);
  }
  for (const b of [
    "Desenvolvimento de telas",
    "Gestão de carteira",
    "Responsável pelo atendimento",
    "Melhorias de usabilidade",
    "Implementação de validações"
  ]) {
    assert.ok(!startsWithActionVerb(b, "pt"), b);
  }
  assert.ok(startsWithActionVerb("Developed APIs", "en") && startsWithActionVerb("Built a pipeline", "en"));
  assert.ok(!startsWithActionVerb("Development of APIs", "en"));
  assert.ok(startsWithActionVerb("Desarrollé APIs", "es") && startsWithActionVerb("Hice 20 entregas", "es"));
});

test("checagem diz quantas e qual conquista não começa com verbo", () => {
  const s = normalize({
    ...SAMPLE,
    exp: [{ ...SAMPLE.exp[0], bullets: "Desenvolvi 3 APIs\nGestão de carteira de clientes" }]
  });
  const verbos = computeChecks(s, model(s)).find((c) => c.text.startsWith("Conquistas começam"));
  assert.equal(verbos.ok, false);
  assert.match(verbos.text, /1 de 2 sem verbo no início, ex\.: “Gestão de carteira de clientes”/);
  const numeros = computeChecks(s, model(s)).find((c) => c.text.startsWith("Metade"));
  assert.equal(numeros.ok, true);
  assert.match(numeros.text, /agora: 1 de 2/);
});

test("conquistas coladas de PDF passam na checagem quando cada uma começa com verbo e tem número", () => {
  const bullets =
    "• Desenvolvi 5 telas de cadastro em sistemas internos\nutilizados pela empresa.\n• Corrigi 30 bugs reportados pelos\nusuários do sistema.";
  const s = normalize({ ...SAMPLE, exp: [{ ...SAMPLE.exp[0], bullets }] });
  const checks = computeChecks(s, model(s));
  assert.ok(checks.find((c) => c.text.startsWith("Metade")).ok);
  assert.ok(checks.find((c) => c.text.startsWith("Conquistas começam")).ok);
  assert.equal(model(s).sections.find((x) => x.key === "exp").jobs[0].bullets.length, 2);
});

test("conquistas de experiência vazia (sem cargo nem empresa) não contam", () => {
  const s = normalize({ ...SAMPLE, exp: [SAMPLE.exp[0], { bullets: "texto solto sem número" }] });
  assert.ok(computeChecks(s, model(s)).find((c) => c.text.startsWith("Conquistas começam")).ok);
});
