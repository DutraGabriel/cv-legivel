// O layout é o mesmo nos três idiomas: mesmas alturas do topo, dos cartões e das linhas do
// formulário, nas larguras mais comuns. Se um texto traduzido ficar longo demais e quebrar
// uma linha a mais, este teste aponta qual parte mudou.
import { expect, test } from "@playwright/test";

const PAGES = { pt: "/", en: "/en/", es: "/es/" };
const WIDTHS = [2560, 1920, 1536, 1440, 1366, 1280, 1024, 980, 768, 390];
// partes fixas da página; o resumo e as conquistas do exemplo têm tamanhos diferentes em cada idioma
const PARTS = {
  topo: "header.top",
  abas: ".tabs",
  dadosPessoais: "#form fieldset:nth-of-type(1)",
  privacidade: ".privacy",
  checagem: ".checks",
  vaga: ".job"
};

async function measure(page, path) {
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector("#sheet .nm"));
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(
    (parts) =>
      Object.fromEntries(
        Object.entries(parts).map(([name, sel]) => {
          const el = document.querySelector(sel);
          return [name, el?.offsetParent ? Math.round(el.getBoundingClientRect().height) : null];
        })
      ),
    PARTS
  );
}

test("o layout tem as mesmas medidas em português, inglês e espanhol", async ({ page }) => {
  test.setTimeout(90_000);
  // idioma já escolhido: o aviso de idioma do navegador não aparece e não empurra o topo
  await page.addInitScript(() => localStorage.setItem("cv-legivel-idioma", "pt"));
  await page.route("https://servicodados.ibge.gov.br/**", (route) =>
    route.fulfill({ json: [{ nome: "Florianópolis" }] })
  );
  const differences = [];
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    const sizes = {};
    for (const [lang, path] of Object.entries(PAGES)) sizes[lang] = await measure(page, path);
    for (const part of Object.keys(PARTS)) {
      const values = Object.values(sizes).map((s) => s[part]);
      if (new Set(values).size > 1)
        differences.push(`${width}px ${part}: pt ${values[0]}, en ${values[1]}, es ${values[2]}`);
    }
  }
  expect(differences).toEqual([]);
});
