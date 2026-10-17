// Acessibilidade automática (axe-core, regras WCAG 2.1 A e AA) nas três páginas, nos dois temas.
// Não substitui testar com teclado e leitor de tela, mas pega contraste, nomes e atributos faltando.
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { open } from "./helpers.js";

test.beforeEach(async ({ page }) => {
  await page.route("https://servicodados.ibge.gov.br/**", (route) =>
    route.fulfill({ json: [{ nome: "Florianópolis" }, { nome: "São José" }] })
  );
});

for (const path of ["/", "/en/", "/es/"]) {
  for (const theme of ["light", "dark"]) {
    test(`sem violações de acessibilidade em ${path} (tema ${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("cv-legivel-tema", t), theme);
      await open(page, path);
      // abre as ajudas e a comparação com a vaga, para checar também o conteúdo escondido
      await page.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      const resumo = violations.map(
        (v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`
      );
      expect(resumo).toEqual([]);
    });
  }
}
