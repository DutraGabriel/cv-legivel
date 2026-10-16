export default {
  extends: ["html-validate:recommended"],
  rules: {
    // Prettier gera <!doctype html>, que é HTML5 válido
    "doctype-style": "off",
    // o formulário nunca é enviado: tudo é processado no navegador, então não há botão "submit"
    "wcag/h32": "off",
    "void-style": "off",
    "no-inline-style": "error",
    "long-title": "off"
  }
};
