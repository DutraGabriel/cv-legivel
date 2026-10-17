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

test("página em inglês: interface, exemplo, PDF e nome do arquivo em inglês", async ({ page }) => {
  await open(page, "/en/");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("legend").first()).toHaveText("Personal details");
  await expect(page.locator("#pdfBtn")).toHaveText("Download PDF");
  await expect(page.locator("label", { hasText: "Country" }).locator("select")).toHaveValue("BR");
  await expect(page.locator("#checkList")).toContainText("Summary between 30 and 90 words");
  const { name, buffer } = await downloadPdf(page);
  expect(name).toBe("Mariana-Souza-Resume.pdf");
  const { text } = await pdfText(buffer);
  for (const s of ["WORK EXPERIENCE", "03/2022 – Present", "(Hybrid)", "Florianópolis, Brazil", "+55 48 99999-0000"]) {
    expect(text).toContain(s);
  }
});

test("página em espanhol: interface e currículo em espanhol", async ({ page }) => {
  await open(page, "/es/");
  await expect(page.locator("html")).toHaveAttribute("lang", "es");
  await expect(page.locator("#pdfBtn")).toHaveText("Generar PDF");
  await expect(page.locator("#sheet h3").nth(1)).toHaveText("Experiencia profesional");
  await page.fill("#telefone", "612");
  await page.locator("#telefone").blur();
  await expect(page.locator("#telefone-msg")).toContainText("incluye el código del país");
});

test("navegador em inglês vê um aviso em inglês; a escolha vale nas próximas visitas", async ({ browser }) => {
  const context = await browser.newContext({ locale: "en-US" });
  const page = await context.newPage();
  await page.route("https://servicodados.ibge.gov.br/**", (r) => r.fulfill({ json: [] }));
  await page.goto("/");
  // sem escolha salva, não redireciona sozinho (bom para buscadores): só sugere
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  const aviso = page.locator("#langSuggest");
  await expect(aviso).toBeVisible();
  await expect(aviso).toHaveAttribute("lang", "en");
  await expect(aviso).toContainText("This site is also available in English.");
  await aviso.getByRole("link", { name: "Switch to English" }).click();
  await expect(page).toHaveURL(/\/en\/$/);
  await expect(page.locator("#langSuggest")).toBeHidden(); // já está no idioma do navegador
  // com a escolha salva, a raiz leva direto ao inglês
  await page.goto("/");
  await expect(page).toHaveURL(/\/en\/$/);
  // escolher português no seletor também vale para as próximas visitas
  await page.click('[data-lang-link="pt"]');
  await expect(page).toHaveURL(/127\.0\.0\.1:4173\/$/);
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("#langSuggest")).toBeHidden();
  await context.close();
});

test('"Agora não" no aviso de idioma não volta a aparecer', async ({ browser }) => {
  const context = await browser.newContext({ locale: "es-ES" });
  const page = await context.newPage();
  await page.route("https://servicodados.ibge.gov.br/**", (r) => r.fulfill({ json: [] }));
  await page.goto("/en/");
  await expect(page.locator("#langSuggest")).toContainText("Este sitio también está en español.");
  await page.getByRole("button", { name: "Ahora no" }).click();
  await expect(page.locator("#langSuggest")).toBeHidden();
  await page.reload();
  await expect(page.locator("#langSuggest")).toBeHidden();
  await context.close();
});

test("importar na página em inglês um arquivo exportado em português", async ({ page }) => {
  await open(page);
  const download = page.waitForEvent("download");
  await page.click("#exportBtn");
  const file = await (await download).path();
  await open(page, "/en/");
  await page.setInputFiles("#importFile", file);
  await expect(page.locator("#telefone")).toHaveValue("+55 48 99999-0000");
  await expect(page.locator("#pais")).toHaveValue("BR");
  await expect(page.locator("#telefone")).not.toHaveAttribute("aria-invalid");
});

test("cada idioma tem seu rascunho e oferece copiar de outro", async ({ page }) => {
  await open(page);
  await page.fill("#nome", "Ana Português");
  await open(page, "/en/");
  await expect(page.locator("#nome")).toHaveValue("Mariana Souza"); // exemplo em inglês, não o rascunho pt
  await expect(page.locator("#copyOffer")).toBeVisible();
  await expect(page.locator("#copyTitle")).toHaveText("You already have a resume in Portuguese");
  await page.click("#copyActions button >> nth=0");
  await expect(page.locator("#nome")).toHaveValue("Ana Português");
  await expect(page.locator("#pais")).toHaveValue("BR");
  await expect(page.locator("#telefone")).toHaveValue("+55 48 99999-0000");
  await expect(page.locator("#copyOffer")).toBeHidden();
  await open(page, "/");
  await expect(page.locator("#nome")).toHaveValue("Ana Português");
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
  expect(dl.suggestedFilename()).toBe("cv-legivel-pt.json");
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
