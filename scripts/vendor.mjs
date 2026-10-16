// Copia bibliotecas e fontes do node_modules para assets/vendor/.
// O site não tem etapa de build: os arquivos copiados são versionados no git
// e servidos pelo próprio GitHub Pages, sem depender de CDNs de terceiros.
// Rode `npm run vendor` depois de atualizar qualquer dependência no package.json.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const nm = (...p) => join(root, "node_modules", ...p);
const out = (...p) => join(root, "assets", "vendor", ...p);
const version = (pkg) => JSON.parse(readFileSync(nm(pkg, "package.json"), "utf8")).version;

const FILES = [
  // [pacote, arquivo de origem, destino]
  ["jspdf", "dist/jspdf.umd.min.js", "jspdf/jspdf.umd.min.js"],
  ["jspdf", "LICENSE", "jspdf/LICENSE"],
  ["pdfjs-dist", "build/pdf.min.mjs", "pdfjs/pdf.min.mjs"],
  ["pdfjs-dist", "build/pdf.worker.min.mjs", "pdfjs/pdf.worker.min.mjs"],
  ["pdfjs-dist", "LICENSE", "pdfjs/LICENSE"],
  ["@expo-google-fonts/arimo", "400Regular/Arimo_400Regular.ttf", "fonts/arimo/Arimo-Regular.ttf"],
  ["@expo-google-fonts/arimo", "700Bold/Arimo_700Bold.ttf", "fonts/arimo/Arimo-Bold.ttf"],
  ["@expo-google-fonts/arimo", "LICENSE_FONT", "fonts/arimo/LICENSE"]
];
// fontes da interface: só os subconjuntos latino e latino estendido
const WOFF2 = {
  "@fontsource-variable/bricolage-grotesque": [
    "bricolage-grotesque-latin-opsz-normal",
    "bricolage-grotesque-latin-ext-opsz-normal"
  ],
  "@fontsource-variable/instrument-sans": [
    "instrument-sans-latin-wght-normal",
    "instrument-sans-latin-ext-wght-normal"
  ],
  "@fontsource/ibm-plex-mono": [
    "ibm-plex-mono-latin-400-normal",
    "ibm-plex-mono-latin-ext-400-normal",
    "ibm-plex-mono-latin-500-normal",
    "ibm-plex-mono-latin-ext-500-normal"
  ]
};

rmSync(out(), { recursive: true, force: true });
for (const [pkg, from, to] of FILES) {
  mkdirSync(dirname(out(to)), { recursive: true });
  cpSync(nm(pkg, from), out(to));
}
for (const [pkg, names] of Object.entries(WOFF2)) {
  for (const n of names) {
    mkdirSync(out("fonts/ui"), { recursive: true });
    cpSync(nm(pkg, "files", `${n}.woff2`), out("fonts/ui", `${n}.woff2`));
  }
  cpSync(nm(pkg, "LICENSE"), out("fonts/ui", `LICENSE-${pkg.split("/")[1]}`));
}
// sem o .map ao lado, o comentário só gera um 404 no DevTools
const umd = out("jspdf/jspdf.umd.min.js");
writeFileSync(umd, readFileSync(umd, "utf8").replace(/\n\/\/# sourceMappingURL=[^\n]*\n?$/, "\n"));

const versions = Object.fromEntries(
  [...new Set([...FILES.map(([p]) => p), ...Object.keys(WOFF2)])].map((p) => [p, version(p)])
);
writeFileSync(out("VERSIONS.json"), JSON.stringify(versions, null, 2) + "\n");
console.log("assets/vendor atualizado:", versions);
