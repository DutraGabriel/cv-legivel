// Carregado no <head> sem defer, antes da primeira pintura:
// 1. aplica o tema salvo, para a página não piscar no tema errado;
// 2. na página em português (a raiz do site), leva para /en/ ou /es/ quem já ESCOLHEU esse idioma
//    no seletor. Sem escolha salva não há redirecionamento: quem usa o navegador em outro idioma
//    vê um aviso com o link (ui/chrome.js), e buscadores indexam cada página no seu idioma.
// Fica num arquivo (e não inline) para a Content-Security-Policy poder bloquear scripts inline.
(() => {
  try {
    const theme = localStorage.getItem("cv-legivel-tema");
    if (theme === "light" || theme === "dark") document.documentElement.dataset.theme = theme;

    const { lang, langs = "" } = document.documentElement.dataset;
    if (lang !== "pt") return;
    const saved = localStorage.getItem("cv-legivel-idioma");
    if (saved && saved !== "pt" && langs.split(" ").includes(saved)) {
      location.replace(`${saved}/${location.search}${location.hash}`);
    }
  } catch {
    /* armazenamento indisponível: segue o tema do sistema e fica em português */
  }
})();
