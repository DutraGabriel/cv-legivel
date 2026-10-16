// Geração do PDF com jsPDF. A biblioteca (420 KB) só é baixada no primeiro clique em "Gerar PDF".
// As fontes padrão do PDF (Helvetica) só cobrem o alfabeto latino ocidental (Windows-1252);
// quando o texto tem algo fora disso (ł, ş, ă, cirílico...), embutimos a Arimo, que tem as
// mesmas medidas da Helvetica, então o layout não muda.
import { plainText } from "./model.js";

const VENDOR = new URL("../vendor/", import.meta.url);
const LANG_TAG = { pt: "pt-BR", en: "en-US", es: "es-ES" };

// tudo o que a Helvetica padrão do PDF consegue escrever
const WIN1252 = /^[\n\r\t\x20-\x7E\xA0-\xFF€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]*$/;
export const needsUnicodeFont = (text) => !WIN1252.test(text);

let jsPDFPromise = null;
/** Carrega o jsPDF (UMD, mesma origem) uma única vez. */
export function loadJsPDF() {
  if (globalThis.jspdf) return Promise.resolve(globalThis.jspdf.jsPDF);
  jsPDFPromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = new URL("jspdf/jspdf.umd.min.js", VENDOR).href;
    s.onload = () => resolve(globalThis.jspdf.jsPDF);
    s.onerror = () => {
      jsPDFPromise = null;
      reject(new Error("Não foi possível carregar o gerador de PDF."));
    };
    document.head.append(s);
  });
  return jsPDFPromise;
}

let fontPromise = null;
const toBase64 = (buf) => {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
};
/** Baixa a Arimo regular e negrito (≈ 640 KB no total) uma única vez. */
export function loadUnicodeFont() {
  fontPromise ??= Promise.all(
    ["Arimo-Regular.ttf", "Arimo-Bold.ttf"].map(async (f) => {
      const r = await fetch(new URL(`fonts/arimo/${f}`, VENDOR));
      if (!r.ok) throw new Error(`Fonte ${f}: HTTP ${r.status}`);
      return [f, toBase64(await r.arrayBuffer())];
    })
  ).catch((e) => {
    fontPromise = null;
    throw e;
  });
  return fontPromise;
}

/** Monta o documento. `fontFiles` é o retorno de loadUnicodeFont() ou null para usar a Helvetica. */
export function buildPdf(m, jsPDF, fontFiles = null) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let FONT = "helvetica";
  if (fontFiles) {
    for (const [file, b64] of fontFiles) {
      doc.addFileToVFS(file, b64);
      doc.addFont(file, "Arimo", file.includes("Bold") ? "bold" : "normal");
    }
    FONT = "Arimo";
  }
  const L = 18,
    T = 18,
    B = 18,
    W = 210 - 2 * L,
    H = 297;
  let y = T;
  const LH = (pt) => pt * 0.3528 * 1.25; // altura da linha em mm
  const ensure = (need) => {
    if (y + need > H - B) {
      doc.addPage();
      y = T;
    }
  };
  const style = (size, bold = false, color = 25) => {
    doc.setFont(FONT, bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color);
  };
  const para = (txt, size, bold = false, color = 25, indent = 0, bullet = false) => {
    style(size, bold, color);
    doc.splitTextToSize(txt, W - indent - (bullet ? 4 : 0)).forEach((ln, i) => {
      ensure(LH(size));
      if (bullet && i === 0) doc.text("•", L + indent, y + LH(size) * 0.75);
      doc.text(ln, L + indent + (bullet ? 4 : 0), y + LH(size) * 0.75);
      y += LH(size);
    });
  };
  // item com rótulo em negrito ("Front-end: HTML, CSS"), quebrando as linhas à mão
  const rich = (label, txt, size = 10, indent = 1) => {
    const width = (s, b) => {
      style(size, b);
      return doc.getTextWidth(s);
    };
    const words = [
      ...`${label}:`.split(" ").map((w) => ({ w, b: true })),
      ...txt
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => ({ w, b: false }))
    ];
    const maxW = W - indent - 4;
    const rows = [[]];
    let lineW = 0;
    for (const t of words) {
      const add = width((rows.at(-1).length ? " " : "") + t.w, t.b);
      if (rows.at(-1).length && lineW + add > maxW) {
        rows.push([]);
        lineW = width(t.w, t.b);
      } else lineW += add;
      rows.at(-1).push(t);
    }
    rows.forEach((row, i) => {
      ensure(LH(size));
      const base = y + LH(size) * 0.75;
      let x = L + indent + 4;
      if (i === 0) {
        style(size);
        doc.text("•", L + indent, base);
      }
      // palavras seguidas do mesmo estilo saem num único trecho, para a extração de texto ficar limpa
      const runs = [];
      row.forEach((t, j) => {
        const s = (j ? " " : "") + t.w;
        const last = runs.at(-1);
        if (last && last.b === t.b) last.s += s;
        else runs.push({ s, b: t.b });
      });
      for (const r of runs) {
        style(size, r.b);
        doc.text(r.s, x, base);
        x += doc.getTextWidth(r.s);
      }
      y += LH(size);
    });
  };
  const item = (it) => {
    if (it.label) rich(it.label, it.text);
    else para(it.text, 10, false, 25, 1, true);
    y += 0.5;
  };
  // linha de contato: cada item vira um link clicável (e-mail, telefone, LinkedIn, portfólio)
  const contactLine = (items, size = 9.5) => {
    style(size, false, 100);
    const sep = " | ";
    let x = L;
    ensure(LH(size));
    items.forEach((c, i) => {
      const w = doc.getTextWidth(c.text);
      const sepW = i ? doc.getTextWidth(sep) : 0;
      if (i && x + sepW + w > L + W) {
        x = L;
        y += LH(size);
        ensure(LH(size));
      } else if (i) {
        doc.text(sep, x, y + LH(size) * 0.75);
        x += sepW;
      }
      doc.text(c.text, x, y + LH(size) * 0.75);
      if (c.url) doc.link(x, y, w, LH(size), { url: c.url });
      x += w;
    });
    y += LH(size);
  };

  para(m.nome || m.t.nomePadrao, 24, true, 15);
  if (m.cargo) {
    y += 0.4;
    para(m.cargo, 12.5, false, 60);
  }
  if (m.contato.length) {
    y += 0.6;
    contactLine(m.contato);
  }

  for (const sec of m.sections) {
    y += 5;
    ensure(14);
    para(sec.t.toUpperCase(), 11.5, true, 15);
    doc.setDrawColor(170);
    doc.setLineWidth(0.25);
    doc.line(L, y + 0.5, L + W, y + 0.5);
    y += 2.6;
    (sec.paras || []).forEach((p) => para(p, 10));
    (sec.jobs || []).forEach((j, idx) => {
      if (idx) y += 2.4;
      // título + linha de dados + primeira conquista ficam juntos na mesma página
      ensure(LH(10.5) + LH(9.5) + (j.bullets.length ? LH(10) + 1 : 0));
      if (j.title) para(j.title, 10.5, true, 15);
      if (j.meta) para(j.meta, 9.5, false, 110);
      if (j.bullets.length) y += 0.6;
      j.bullets.forEach((b) => item({ text: b }));
    });
    (sec.list || []).forEach(item);
  }

  doc.setLanguage(LANG_TAG[m.lang] || "pt-BR");
  doc.setProperties({
    title: `${m.t.doc} - ${m.nome || m.t.nomePadrao}`,
    subject: m.cargo || m.t.doc,
    author: m.nome,
    keywords: m.skills.join(", "),
    creator: "CV Legível"
  });
  return doc;
}

/** Carrega o que for preciso e devolve o documento pronto. `onStatus` recebe mensagens de progresso. */
export async function generatePdf(m, onStatus = () => {}) {
  const jsPDF = await loadJsPDF();
  let fontFiles = null;
  if (needsUnicodeFont(plainText(m))) {
    onStatus("Baixando a fonte para caracteres especiais…");
    fontFiles = await loadUnicodeFont();
  }
  return buildPdf(m, jsPDF, fontFiles);
}
