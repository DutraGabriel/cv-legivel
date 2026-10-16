import { readFile } from "node:fs/promises";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

/** Extrai o texto de um PDF (Buffer) na ordem de leitura, como um ATS faria. */
export async function pdfText(buffer) {
  const pdf = await getDocument({ data: new Uint8Array(buffer), isEvalSupported: false, verbosity: 0 }).promise;
  let text = "";
  for (let p = 1; p <= pdf.numPages; p++) {
    const content = await (await pdf.getPage(p)).getTextContent();
    for (const it of content.items) text += it.str + (it.hasEOL ? "\n" : "");
    text += "\n";
  }
  return { text, pages: pdf.numPages, pdf };
}

/** Clica em "Gerar PDF" e devolve o nome e o conteúdo do arquivo baixado. */
export async function downloadPdf(page) {
  const [download] = await Promise.all([page.waitForEvent("download"), page.click("#pdfBtn")]);
  return { name: download.suggestedFilename(), buffer: await readFile(await download.path()) };
}

/** Links clicáveis (anotações) da primeira página. */
export async function pdfLinks(pdf) {
  const annots = await (await pdf.getPage(1)).getAnnotations();
  return annots.filter((a) => a.subtype === "Link").map((a) => a.url);
}

/** Abre o site e registra erros de console e violações de CSP. */
export async function open(page, path = "/") {
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto(path);
  await page.waitForFunction(() => document.querySelector("#sheet .nm"));
  return errors;
}
