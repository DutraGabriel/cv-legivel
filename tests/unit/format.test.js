import assert from "node:assert/strict";
import { test } from "node:test";
import {
  cleanUrl,
  esc,
  fileName,
  fmtDate,
  fmtPhone,
  isDate,
  labeled,
  lines,
  wordCount,
  ym
} from "../../assets/js/format.js";

test("esc neutraliza HTML, inclusive aspas simples e duplas", () => {
  assert.equal(esc(`<img src=x onerror="alert('x')">`), "&lt;img src=x onerror=&quot;alert(&#39;x&#39;)&quot;&gt;");
  assert.equal(esc(null), "");
});

test("fmtPhone formata fixo, celular e entradas parciais", () => {
  assert.equal(fmtPhone("48996187500"), "(48) 99618-7500");
  assert.equal(fmtPhone("4833334444"), "(48) 3333-4444");
  assert.equal(fmtPhone("489"), "(48) 9");
  assert.equal(fmtPhone("(48) 99618-7500 ramal 2"), "(48) 99618-7500");
  assert.equal(fmtPhone(""), "");
});

test("fmtDate e isDate trabalham com MM/AAAA", () => {
  assert.equal(fmtDate("032022"), "03/2022");
  assert.equal(fmtDate("0320229"), "03/2022");
  assert.equal(isDate("12/2019"), true);
  assert.equal(isDate("13/2019"), false);
  assert.equal(isDate("00/2019"), false);
  assert.equal(ym("03/2022"), 202203);
  assert.equal(ym("3/2022"), 0);
});

test("labeled separa categoria e itens", () => {
  assert.deepEqual(labeled("Front-end: HTML, CSS"), { label: "Front-end", text: "HTML, CSS" });
  assert.deepEqual(labeled("Inglês - Avançado", true), { label: "Inglês", text: "Avançado" });
  assert.deepEqual(labeled("Inglês - Avançado"), { label: "", text: "Inglês - Avançado" });
});

test("lines remove marcadores digitados e linhas vazias", () => {
  assert.deepEqual(lines("• Um\n\n- Dois\n  * Três  "), ["Um", "Dois", "Três"]);
});

test("cleanUrl normaliza links colados", () => {
  assert.equal(cleanUrl("https://www.linkedin.com/in/ana-souza/?trk=abc"), "linkedin.com/in/ana-souza");
  assert.equal(cleanUrl("  github.com/ana/  "), "github.com/ana");
});

test("fileName tira acentos e símbolos", () => {
  assert.equal(fileName("João D'Ávila"), "Joao-DAvila-Curriculo.pdf");
  assert.equal(fileName("", "Resume"), "Resume-Resume.pdf");
});

test("wordCount conta palavras", () => {
  assert.equal(wordCount("  uma  frase com   cinco palavras "), 5);
  assert.equal(wordCount(""), 0);
});
