// Testes de consistência do projeto: pegam esquecimentos comuns antes de chegarem ao site publicado.
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { test } from "node:test";

const read = (p) => readFileSync(new URL(`../../${p}`, import.meta.url), "utf8");
const pkg = JSON.parse(read("package.json"));

test("arquivos em assets/vendor são das versões do package.json (rode `npm run vendor`)", () => {
  const vendored = JSON.parse(read("assets/vendor/VERSIONS.json"));
  for (const [name, version] of Object.entries(vendored)) assert.equal(version, pkg.dependencies[name], name);
});

test("todos os arquivos da lista offline (sw.js) existem", () => {
  const shell = [...read("sw.js").matchAll(/^\s+"([^"]+)",?$/gm)].map((m) => m[1]).filter((f) => f !== "./");
  assert.ok(shell.length > 10);
  for (const f of shell)
    assert.ok(existsSync(new URL(`../../${f}`, import.meta.url)), `sw.js lista ${f}, que não existe`);
});

test("todo módulo JS do site está na lista offline", () => {
  const shell = read("sw.js");
  const modules = [...read("assets/js/main.js").matchAll(/from "\.\/([^"]+)"/g)].map((m) => `assets/js/${m[1]}`);
  for (const m of modules) assert.ok(shell.includes(`"${m}"`), `${m} não está no sw.js`);
});

test("index.html tem CSP restrita e não carrega nada de CDNs", () => {
  const html = read("index.html");
  assert.match(html, /http-equiv="Content-Security-Policy"/);
  assert.match(html, /script-src 'self';/);
  assert.doesNotMatch(html, /<script(?![^>]*src=)[^>]*>/, "script inline seria bloqueado pela CSP");
  assert.doesNotMatch(html, /https:\/\/(cdnjs|cdn\.jsdelivr|unpkg|fonts\.googleapis)/);
});
