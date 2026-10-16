// Carregado no <head> sem defer: aplica o tema salvo antes da primeira pintura,
// para a página não piscar no tema errado. Fica num arquivo (e não inline) para a
// Content-Security-Policy poder bloquear qualquer script inline.
try {
  const t = localStorage.getItem("cv-legivel-tema");
  if (t === "light" || t === "dark") document.documentElement.dataset.theme = t;
} catch {
  /* armazenamento indisponível: segue o tema do sistema */
}
