import assert from "node:assert/strict";
import { test } from "node:test";
import { EMPTY, load, normalize, SAMPLE, save, STORAGE_KEY } from "../../assets/js/state.js";

const memoryStorage = (initial = {}) => {
  const data = { ...initial };
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => (data[k] = String(v)),
    removeItem: (k) => delete data[k],
    data
  };
};

test("normalize aceita qualquer coisa e devolve um estado válido", () => {
  for (const bad of [null, undefined, 42, "texto", [], { exp: "quebrado", edu: [null, 3] }]) {
    const s = normalize(bad);
    assert.ok(Array.isArray(s.exp) && s.exp.length >= 1);
    assert.ok(Array.isArray(s.edu) && s.edu.length >= 1);
    assert.equal(typeof s.nome, "string");
    assert.equal(s.cvLang, "pt");
  }
});

test("normalize migra rascunhos de versões antigas", () => {
  const s = normalize({
    cidade: "Florianópolis, SC",
    exp: [{ local: "São Paulo, SP (híbrido)", inicio: "2022-03", fim: "15/12/2023" }, { local: "Remoto" }],
    edu: [{ status: "Em andamento" }, { fim: "12/2019" }]
  });
  assert.equal(s.uf, "SC");
  assert.equal(s.cidade, "Florianópolis");
  assert.deepEqual(
    [s.exp[0].local, s.exp[0].modalidade, s.exp[0].inicio, s.exp[0].fim],
    ["São Paulo, SP", "hibrido", "03/2022", "12/2023"]
  );
  assert.deepEqual([s.exp[1].local, s.exp[1].modalidade], ["", "remoto"]);
  assert.equal(s.edu[0].status, "andamento");
  assert.equal(s.edu[1].status, "concluido");
});

test("normalize descarta valores fora das opções", () => {
  const s = normalize({ uf: "XX", cvLang: "fr", exp: [{ modalidade: "<script>" }], edu: [{ status: "qualquer" }] });
  assert.equal(s.uf, "");
  assert.equal(s.cvLang, "pt");
  assert.equal(s.exp[0].modalidade, "");
  assert.equal(s.edu[0].status, "");
});

test("o exemplo e o vazio já estão normalizados", () => {
  assert.deepEqual(normalize(SAMPLE), SAMPLE);
  assert.deepEqual(normalize(EMPTY), EMPTY);
});

test("load: sem rascunho mostra o exemplo; JSON corrompido começa vazio", () => {
  assert.equal(load(memoryStorage()).isExample, true);
  const corrupt = load(memoryStorage({ [STORAGE_KEY]: "{não é json" }));
  assert.equal(corrupt.error, "corrupt");
  assert.deepEqual(corrupt.state, EMPTY);
});

test("save devolve false quando o navegador recusa", () => {
  const recusa = {
    setItem: () => {
      throw new Error("QuotaExceeded");
    }
  };
  assert.equal(save(EMPTY, recusa), false);
  const ok = memoryStorage();
  assert.equal(save(SAMPLE, ok), true);
  assert.equal(load(ok).state.nome, "Mariana Souza");
});
