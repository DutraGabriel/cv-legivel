// Textos que aparecem NO CURRÍCULO (prévia e PDF), por idioma do currículo.
// A interface do site continua em português; só o documento gerado muda de idioma.
// Os valores salvos no rascunho são chaves neutras ("hibrido", "andamento"),
// traduzidas apenas na hora de exibir.

export const CV_LANGS = { pt: "Português", en: "English", es: "Español" };

export const MODALIDADES = ["presencial", "hibrido", "remoto"];
export const SITUACOES = ["concluido", "andamento", "trancado"];

export const CV_TEXT = {
  pt: {
    resumo: "Resumo profissional",
    exp: "Experiência profissional",
    edu: "Formação acadêmica",
    hab: "Habilidades",
    idi: "Idiomas",
    cert: "Certificações",
    atual: "Atual",
    inicio: "Início",
    previsao: "Previsão de conclusão",
    nomePadrao: "Seu Nome",
    doc: "Currículo",
    arquivo: "Curriculo",
    mod: { presencial: "Presencial", hibrido: "Híbrido", remoto: "Remoto" },
    status: { concluido: "Concluído", andamento: "Em andamento", trancado: "Trancado" }
  },
  en: {
    resumo: "Professional summary",
    exp: "Work experience",
    edu: "Education",
    hab: "Skills",
    idi: "Languages",
    cert: "Certifications",
    atual: "Present",
    inicio: "Start",
    previsao: "Expected graduation",
    nomePadrao: "Your Name",
    doc: "Resume",
    arquivo: "Resume",
    mod: { presencial: "On-site", hibrido: "Hybrid", remoto: "Remote" },
    status: { concluido: "Completed", andamento: "In progress", trancado: "Discontinued" }
  },
  es: {
    resumo: "Resumen profesional",
    exp: "Experiencia profesional",
    edu: "Formación académica",
    hab: "Habilidades",
    idi: "Idiomas",
    cert: "Certificaciones",
    atual: "Actualidad",
    inicio: "Inicio",
    previsao: "Finalización prevista",
    nomePadrao: "Tu Nombre",
    doc: "Currículum",
    arquivo: "Curriculum",
    mod: { presencial: "Presencial", hibrido: "Híbrido", remoto: "Remoto" },
    status: { concluido: "Completado", andamento: "En curso", trancado: "Interrumpido" }
  }
};

/** Rótulos usados no formulário (sempre em português). */
export const FORM_LABEL = {
  mod: CV_TEXT.pt.mod,
  status: CV_TEXT.pt.status
};

// Verbos de ação no passado. Os regulares são reconhecidos pela terminação (ver checks.js):
// "-ei"/"-i" em português (criei, desenvolvi, abri), "-ed" em inglês, "-é"/"-í" em espanhol.
// Aqui ficam só os irregulares, escritos sem acento e em minúsculas.
export const IRREGULAR_VERBS = {
  pt: "fiz fui tive obtive mantive detive contive pus propus compus dispus trouxe dei estive pude quis vim conduzi reduzi produzi introduzi traduzi",
  en: "built led wrote made ran won grew drove sold taught began brought bought chose did found gave held kept left met paid put read rose saw set spoke spent stood took thought told understood became broke cut drew fought got oversaw overtook rebuilt rewrote undertook upheld went",
  es: "hice fui tuve obtuve mantuve puse propuse traje di estuve pude quise vine conduje reduje produje introduje traduje"
};
