// Testes de ponta a ponta: abrem o site num navegador real, preenchem o formulário,
// geram o PDF e conferem o TEXTO extraído dele (o que um ATS realmente lê).
import { expect, test } from "@playwright/test";
import { downloadPdf, open, pdfLinks, pdfText } from "./helpers.js";

// a lista de cidades vem do IBGE; nos testes respondemos localmente para não depender da rede
test.beforeEach(async ({ page }) => {
  await page.route("https://servicodados.ibge.gov.br/**", (route) =>
    route.fulfill({ json: [{ nome: "Florianópolis" }, { nome: "São José" }] })
  );
});

test("abre com o exemplo, sem erros no console nem violações de CSP", async ({ page }) => {
  const errors = await open(page);
  await expect(page.locator("#exampleBadge")).toBeVisible();
  await expect(page.locator("#sheet .nm")).toHaveText("Mariana Souza");
  await expect(page.locator("#score")).toHaveText("10/10");
  expect(errors).toEqual([]);
});

test("PDF tem texto real, na ordem certa, com links clicáveis", async ({ page }) => {
  await open(page);
  const { name, buffer } = await downloadPdf(page);
  expect(name).toBe("Mariana-Souza-Curriculo.pdf");
  const { text, pdf } = await pdfText(buffer);
  const order = [
    "Mariana Souza",
    "Desenvolvedora Back-end Pleno",
    "RESUMO PROFISSIONAL",
    "EXPERIÊNCIA PROFISSIONAL",
    "FORMAÇÃO ACADÊMICA",
    "HABILIDADES",
    "IDIOMAS",
    "CERTIFICAÇÕES"
  ];
  const positions = order.map((s) => text.indexOf(s));
  expect(
    positions.every((p) => p >= 0),
    `faltou algum trecho em:\n${text}`
  ).toBe(true);
  expect([...positions].sort((a, b) => a - b)).toEqual(positions);
  expect(text).toContain("Nuvem Tech | Florianópolis, SC (Híbrido) | 03/2022 – Atual");
  expect(text).toContain("Back-end: Python, Django, Django REST Framework");
  expect(await pdfLinks(pdf)).toEqual(
    expect.arrayContaining([
      "mailto:mariana.souza@email.com",
      "https://linkedin.com/in/marianasouza",
      "https://github.com/marianasouza"
    ])
  );
});

test("idioma do currículo em inglês muda títulos, datas e nome do arquivo", async ({ page }) => {
  await open(page);
  await page.selectOption("#cvLang", "en");
  await expect(page.locator("#sheet h3").first()).toHaveText("Professional summary");
  const { name, buffer } = await downloadPdf(page);
  expect(name).toBe("Mariana-Souza-Resume.pdf");
  const { text } = await pdfText(buffer);
  expect(text).toContain("WORK EXPERIENCE");
  expect(text).toContain("03/2022 – Present");
  expect(text).toContain("(Hybrid)");
  expect(text).toContain("Florianópolis, SC, Brazil");
});

test("nomes com letras fora do latim ocidental saem corretos (fonte Unicode)", async ({ page }) => {
  await open(page);
  await page.fill("#nome", "Łukasz Żółć Şahin");
  const { buffer } = await downloadPdf(page);
  const { text } = await pdfText(buffer);
  expect(text).toContain("Łukasz Żółć Şahin");
});

test("restrições e validações aparecem abaixo do campo", async ({ page }) => {
  await open(page);
  await page.fill("#nome", "");
  await page.locator("#nome").pressSequentially("Ana2 Paula!");
  await expect(page.locator("#nome")).toHaveValue("Ana Paula");
  await expect(page.locator("#nome-msg")).toContainText("apenas letras");

  await page.fill("#email", "ana@");
  await page.locator("#email").blur();
  await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "");
  await expect(page.locator("#email-msg")).toContainText("E-mail incompleto");

  await page.fill("#exp-1-fim", "12/2019");
  await expect(page.locator("#exp-1-fim-msg")).toHaveText("O fim não pode ser antes do início.");
  await expect(page.locator("#checkList")).toContainText("Campos com erro no formulário (2)");
});

test("rascunho corrompido no navegador não trava o site", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("cv-legivel-v1", '{"exp":"quebrado","nome":42}'));
  const errors = await open(page);
  await expect(page.locator("#nome")).toHaveValue("42");
  await expect(page.locator("#exp-0-cargo")).toBeVisible();
  expect(errors).toEqual([]);
});

test("exportar e importar devolvem os mesmos dados", async ({ page }) => {
  await open(page);
  await page.fill("#nome", "Teste Exportação");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.click("#exportBtn")]);
  expect(dl.suggestedFilename()).toBe("cv-legivel-dados.json");
  const file = await dl.path();

  await page.click("#clearBtn");
  await page.click("#clearBtn");
  await expect(page.locator("#nome")).toHaveValue("");

  page.on("dialog", (d) => d.accept());
  await page.setInputFiles("#importFile", file);
  await expect(page.locator("#nome")).toHaveValue("Teste Exportação");
  await expect(page.locator("#exp-0-empresa")).toHaveValue("Nuvem Tech");
});

test("comparação com a vaga aponta termos ausentes", async ({ page }) => {
  await open(page);
  await page.click(".job summary");
  await page.fill("#vaga", "Requisitos: Python, Django, Kubernetes e RabbitMQ. Diferencial: Power BI.");
  const missing = page.locator("#jobResult .chip.missing");
  await expect(missing).toHaveCount(3);
  for (const t of ["Kubernetes", "Power BI", "RabbitMQ"]) await expect(missing.filter({ hasText: t })).toHaveCount(1);
  for (const t of ["Django", "Python"])
    await expect(page.locator("#jobResult .chip.found").filter({ hasText: t })).toHaveCount(1);
});

test('"Ver como o ATS lê" mostra o texto extraído do PDF', async ({ page }) => {
  await open(page);
  await page.click("#atsBtn");
  await expect(page.locator("#atsDialog")).toBeVisible();
  await expect(page.locator("#atsText")).toContainText("EXPERIÊNCIA PROFISSIONAL");
  await expect(page.locator("#atsText")).toContainText("Mariana Souza");
});

test("@mobile abas Editar/Prévia funcionam por toque e teclado", async ({ page }) => {
  await open(page);
  await expect(page.locator("#form")).toBeVisible();
  await expect(page.locator("#preview")).toBeHidden();
  await page.click("#tabPreview");
  await expect(page.locator("#preview")).toBeVisible();
  await page.locator("#tabPreview").press("ArrowLeft");
  await expect(page.locator("#tabForm")).toBeFocused();
  await expect(page.locator("#form")).toBeVisible();
});
