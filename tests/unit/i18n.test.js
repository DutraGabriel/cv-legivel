import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { countries, countryName, DICTS, LANGS, t } from "../../assets/js/i18n/index.js";
import { copyToLang, fromImport, load, sampleFor, save, storageKey } from "../../assets/js/state.js";
import { MANIFEST, OUTPUT, renderManifest, renderPage } from "../../scripts/pages.mjs";

const PARTS = ["meta", "ui", "help", "cv", "rules"];

const keys = (o, p = "") =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === "object" && !Array.isArray(v) ? keys(v, `${p}${k}.`) : [`${p}${k}`]
  );

test("os três idiomas têm exatamente as mesmas chaves de texto", () => {
  for (const lang of ["en", "es"]) {
    for (const part of PARTS) {
      assert.deepEqual(keys(DICTS[lang][part]).sort(), keys(DICTS.pt[part]).sort(), `${lang}.${part}`);
    }
  }
});

test("nenhum texto ficou vazio", () => {
  for (const lang of LANGS) {
    for (const part of PARTS) {
      for (const k of keys(DICTS[lang][part])) {
        const v = k.split(".").reduce((o, x) => o[x], DICTS[lang][part]);
        assert.ok(String(v).trim(), `${lang}.${part}.${k} está vazio`);
      }
    }
  }
});

test("t() traduz e preenche parâmetros", () => {
  assert.equal(t("cResumo", { n: 40 }, "en"), "Summary between 30 and 90 words (now: 40)");
  assert.equal(t("mod.hibrido", {}, "es"), "Híbrido");
  assert.equal(t("chave-que-nao-existe", {}, "en"), "chave-que-nao-existe");
});

test("t() escolhe singular ou plural pela quantidade", () => {
  assert.equal(t("words", { n: 1 }, "pt"), "1 palavra");
  assert.equal(t("words", { n: 0 }, "pt"), "0 palavras");
  assert.equal(t("words", { n: 2 }, "en"), "2 words");
  assert.equal(t("words", { n: 1 }, "es"), "1 palabra");
  assert.match(t("stPdfOkErr", { name: "a.pdf", n: 1 }, "en"), /1 field has an error/);
  assert.match(t("stPdfOkErr", { name: "a.pdf", n: 3 }, "es"), /3 campos con errores/);
});

test("regras de cada idioma são expressões regulares válidas", () => {
  for (const lang of LANGS) {
    for (const k of ["past", "current"]) assert.doesNotThrow(() => new RegExp(DICTS[lang].rules[k], "u"), lang);
  }
});

test("manifestos do app estão atualizados e abrem na pasta do idioma (rode `npm run pages`)", () => {
  for (const lang of LANGS) {
    const onDisk = readFileSync(new URL(`../../${MANIFEST[lang]}`, import.meta.url), "utf8");
    assert.equal(onDisk, renderManifest(lang), `${MANIFEST[lang]} desatualizado`);
  }
  const en = JSON.parse(renderManifest("en"));
  assert.deepEqual(
    [en.lang, en.start_url, en.scope, en.icons[0].src],
    ["en", "./", "../", "../assets/icons/icon-192.png"]
  );
  assert.match(en.description, /resume builder/);
});

test("imagem de divulgação de cada idioma existe", () => {
  for (const lang of LANGS) {
    assert.doesNotThrow(() => readFileSync(new URL(`../../${DICTS[lang].meta.ogImage}`, import.meta.url)), lang);
  }
});

test("lista de países no idioma pedido, sem códigos antigos nem duplicados", () => {
  for (const lang of LANGS) {
    const list = countries(lang);
    assert.ok(list.length > 240, `${lang}: ${list.length}`);
    assert.equal(new Set(list.map(([, n]) => n)).size, list.length);
    assert.ok(!list.some(([c]) => ["DD", "SU", "YU", "EU", "UN"].includes(c)));
  }
  assert.equal(countryName("DE", "pt"), "Alemanha");
  assert.equal(countryName("DE", "en"), "Germany");
  assert.equal(countryName("DE", "es"), "Alemania");
});

test("páginas geradas estão atualizadas com o modelo (rode `npm run pages`)", () => {
  for (const lang of LANGS) {
    const onDisk = readFileSync(new URL(`../../${OUTPUT[lang]}`, import.meta.url), "utf8");
    assert.equal(onDisk, renderPage(lang), `${OUTPUT[lang]} desatualizado`);
  }
});

test("cada página tem o idioma, o seletor e os campos certos", () => {
  const pt = renderPage("pt");
  const en = renderPage("en");
  assert.match(pt, /<html lang="pt-BR" data-lang="pt" data-langs="pt en es">/);
  assert.match(en, /<html lang="en" data-lang="en" data-langs="pt en es">/);
  assert.match(pt, /id="uf"/);
  assert.doesNotMatch(pt, /id="pais"/);
  assert.match(en, /id="pais"/);
  assert.doesNotMatch(en, /id="uf"/);
  assert.match(en, /src="\.\.\/assets\/js\/main\.js"/);
  assert.match(en, /data-lang-link="en"[^>]*aria-current="page"/);
  assert.match(en, /<legend>Work experience<\/legend>/);
  assert.match(renderPage("es"), /<legend>Experiencia profesional<\/legend>/);
});

const memoryStorage = () => {
  const data = {};
  return {
    getItem: (k) => data[k] ?? null,
    setItem: (k, v) => (data[k] = String(v)),
    removeItem: (k) => delete data[k],
    data
  };
};

test("cada idioma guarda o seu próprio rascunho", () => {
  const storage = memoryStorage();
  save({ ...sampleFor("en"), nome: "English Name" }, storage);
  assert.equal(load(storage, "en").state.nome, "English Name");
  assert.equal(load(storage, "pt").isExample, true);
  assert.equal(load(storage, "es").isExample, true);
  assert.deepEqual(Object.keys(storage.data), [storageKey("en")]);
  assert.equal(storageKey("pt"), "cv-legivel-v1"); // rascunhos antigos em português continuam valendo
});

test("copiar de um idioma para outro adapta local e telefone", () => {
  const en = copyToLang(sampleFor("pt"), "en");
  assert.deepEqual(
    [en.cvLang, en.pais, en.uf, en.cidade, en.telefone],
    ["en", "BR", "", "Florianópolis", "+55 48 99999-0000"]
  );
  assert.equal(en.exp[0].cargo, "Desenvolvedora Back-end"); // o conteúdo vem igual, para a pessoa traduzir
  const pt = copyToLang(sampleFor("es"), "pt");
  assert.deepEqual([pt.cvLang, pt.uf, pt.cidade, pt.telefone], ["pt", "", "Florianópolis", "48999990000"]);
});

test("importar um arquivo de outro idioma adapta telefone e local", () => {
  const exportadoEmPt = JSON.parse(JSON.stringify(sampleFor("pt")));
  const en = fromImport(exportadoEmPt, "en");
  assert.deepEqual([en.cvLang, en.pais, en.telefone], ["en", "BR", "+55 48 99999-0000"]);
  // arquivo antigo, de antes dos idiomas (sem cvLang): era português
  const { cvLang, ...antigo } = exportadoEmPt;
  assert.equal(cvLang, "pt");
  assert.equal(fromImport(antigo, "es").telefone, "+55 48 99999-0000");
  // mesmo idioma: nada muda
  assert.deepEqual(fromImport(JSON.parse(JSON.stringify(sampleFor("es"))), "es"), sampleFor("es"));
});
