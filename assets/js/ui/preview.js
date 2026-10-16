// Prévia em folha A4 e lista da checagem ATS. Todo texto do usuário passa por esc().
import { esc, wordCount } from "../format.js";
import { $ } from "./dom.js";

const li = (it) => `<li>${it.label ? `<b>${esc(it.label)}:</b> ` : ""}${esc(it.text)}</li>`;

export function renderPreview(m) {
  let h = `<p class="nm">${esc(m.nome || m.t.nomePadrao)}</p>`;
  if (m.cargo) h += `<p class="rl">${esc(m.cargo)}</p>`;
  if (m.contato.length) h += `<p class="ct">${m.contato.map((c) => esc(c.text)).join(" | ")}</p>`;
  for (const sec of m.sections) {
    h += `<h3>${esc(sec.t)}</h3>`;
    (sec.paras || []).forEach((p) => (h += `<p>${esc(p)}</p>`));
    (sec.jobs || []).forEach((j) => {
      h += `<p class="jt">${esc(j.title)}</p>`;
      if (j.meta) h += `<p class="jm">${esc(j.meta)}</p>`;
      if (j.bullets.length) h += `<ul>${j.bullets.map((b) => li({ text: b })).join("")}</ul>`;
    });
    if (sec.list) h += `<ul>${sec.list.map(li).join("")}</ul>`;
  }
  $("sheet").innerHTML = h;
  $("sheet").lang = { pt: "pt-BR", en: "en", es: "es" }[m.lang] || "pt-BR";
}

/** O resultado não depende só da cor: ✓ / ! visíveis e "concluído" / "pendente" para leitores de tela. */
export function renderChecks(checks, resumo) {
  const ok = checks.filter((c) => c.ok).length;
  $("score").textContent = $("tabScore").textContent = `${ok}/${checks.length}`;
  $("checkList").innerHTML = checks
    .map(
      (c) =>
        `<li class="${c.ok ? "ok" : "no"}"><span class="sr-only">${c.ok ? "Concluído:" : "Pendente:"}</span> ${esc(c.text)}</li>`
    )
    .join("");
  $("resumoCount").textContent = `${wordCount(resumo)} palavras`;
}
