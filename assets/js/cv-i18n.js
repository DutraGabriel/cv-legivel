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

// Verbos de ação no passado, por idioma, para a checagem "conquistas começam com verbo".
// Comparação feita pelo começo da frase, sem acentos e em minúsculas.
export const ACTION_VERBS = {
  pt: "desenvolvi criei liderei implantei implementei reduzi aumentei construi escrevi gerenciei coordenei projetei automatizei otimizei migrei entreguei conduzi melhorei elevei lancei mantive integrei analisei treinei negociei organizei planejei estruturei atuei participei apoiei responsavel desenhei defini resolvi monitorei documentei atendi vendi prospectei contribui corrigi apresentei acompanhei capacitei administrei executei realizei elaborei",
  en: "developed built created led implemented reduced increased designed managed coordinated automated optimized migrated delivered improved launched maintained integrated analyzed trained negotiated organized planned wrote resolved monitored documented supported sold achieved drove established streamlined mentored owned shipped",
  es: "desarrolle cree lidere implemente reduje aumente construi disene gestione coordine automatice optimice migre entregue mejore lance mantuve integre analice capacite negocie organice planifique escribi resolvi monitoree documente atendi vendi logre impulse"
};
