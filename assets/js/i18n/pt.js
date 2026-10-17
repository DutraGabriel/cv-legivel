// Português. Este arquivo define todas as chaves; en.js e es.js precisam ter as mesmas
// (um teste unitário confere). Textos com {nome} recebem valores na hora de exibir.
export default {
  meta: {
    htmlLang: "pt-BR",
    locale: "pt-BR",
    ogLocale: "pt_BR",
    name: "Português",
    title: "CV Legível — currículos que o ATS consegue ler",
    description:
      "Gerador gratuito de currículo em PDF de coluna única, com texto real e seções padrão, otimizado para ATS e triagem por IA. Seus dados não saem do navegador.",
    ogDescription:
      "Monte um currículo em PDF legível por sistemas de triagem (ATS) e por IA, com checagem em tempo real e comparação com a vaga. Grátis e sem cadastro.",
    ogAlt: "Tela do CV Legível: formulário, checagem ATS e prévia do currículo em A4",
    ogImage: "docs/og-image.png",
    appDescription: "Gerador de currículo em PDF legível por ATS. Funciona offline e seus dados não saem do navegador."
  },

  ui: {
    skip: "Pular para o formulário",
    noscript:
      "O CV Legível precisa de JavaScript para montar o currículo. Ative o JavaScript neste site e recarregue a página.",
    suggest: "Este site também está em português.",
    suggestGo: "Ver em português",
    suggestClose: "Agora não",
    sub: "Preencha o formulário e gere um PDF de coluna única, com texto real e títulos padrão, que sistemas de triagem (ATS) e leitores de RH com IA conseguem interpretar sem perder informação.",
    badge: "Dados de exemplo",
    langNav: "Idioma",
    pdf: "Gerar PDF",
    themeBtn: "Tema",
    themeLight: "☀ Tema claro",
    themeDark: "☾ Tema escuro",
    themeLightAria: "Mudar para o tema claro",
    themeDarkAria: "Mudar para o tema escuro",
    tabsAria: "Alternar entre formulário e prévia",
    tabEdit: "Editar",
    tabPreview: "Prévia e checagem",

    legPersonal: "Dados pessoais",
    legSummary: "Resumo profissional",
    legExp: "Experiência profissional",
    legEdu: "Formação acadêmica",
    legSkills: "Habilidades, idiomas e certificações",
    help: "Como preencher",

    fNome: "Nome completo",
    hNome: "só letras; sem apelidos",
    pNome: "Ex.: Ana Paula Ribeiro",
    fCargo: "Cargo pretendido",
    hCargo: "igual ao título da vaga",
    pCargo: "Ex.: Analista de Dados Pleno",
    fEmail: "E-mail",
    pEmail: "Ex.: ana.ribeiro@email.com",
    fTel: "Telefone",
    pTel: "(48) 99999-0000",
    fPais: "País",
    fUf: "UF",
    fCidade: "Cidade",
    pCidade: "Ex.: Lisboa",
    fLinkedin: "LinkedIn",
    pLinkedin: "linkedin.com/in/seu-perfil",
    fSite: "Portfólio / GitHub (opcional)",
    pSite: "Ex.: github.com/anaribeiro",

    fResumo: "2 a 4 frases: quem você é, anos de experiência, especialidade e o que entrega",
    pResumo:
      "Ex.: Analista de dados com 4 anos de experiência em SQL, Python e Power BI no varejo. Automatizei relatórios que economizaram 20 horas por mês da equipe financeira. Busco atuar como Analista de Dados Pleno em empresas orientadas a dados.",
    words: { one: "{n} palavra", other: "{n} palavras" },

    expItem: "Experiência {n}",
    expRecent: "a mais recente primeiro",
    remove: "Remover",
    fExpCargo: "Cargo",
    hExpCargo: "título de mercado, sem siglas internas",
    pExpCargo: "Ex.: Analista de Dados Júnior",
    fEmpresa: "Empresa",
    pEmpresa: "Ex.: Supermercados Bom Preço",
    fLocal: "Local",
    pLocal: "Ex.: Curitiba, PR",
    fModalidade: "Modalidade",
    none: "Não informar",
    mod: { presencial: "Presencial", hibrido: "Híbrido", remoto: "Remoto" },
    fInicio: "Início",
    fFim: "Fim",
    datePh: "MM/AAAA",
    fAtual: "Trabalho aqui atualmente",
    fBullets: "Conquistas",
    hBullets:
      "uma por linha: verbo no passado (Desenvolvi, Criei, Reduzi) + o que fez + resultado com número; no emprego atual vale o presente (Desenvolvo)",
    pBullets:
      "Ex.:\nAutomatizei 12 relatórios semanais com Python e SQL, economizando 20 horas por mês da equipe financeira\nCriei painéis no Power BI usados por 15 gerentes de loja para acompanhar vendas diárias\nReduzi em 35% os erros de cadastro implantando validações no processo de ETL",
    addExp: "+ Adicionar experiência",

    eduItem: "Formação {n}",
    fCurso: "Curso / grau",
    hCurso: "tipo + nome do curso",
    pCurso: "Ex.: Bacharelado em Administração",
    fInst: "Instituição",
    hInst: "nome completo e sigla",
    pInst: "Ex.: Universidade Federal do Paraná (UFPR)",
    fStatus: "Situação",
    status: { concluido: "Concluído", andamento: "Em andamento", trancado: "Trancado" },
    fConclusao: "Conclusão",
    fPrevisao: "Previsão de conclusão",
    addEdu: "+ Adicionar formação",
    order: "Mostrar formação antes da experiência",
    orderHint: "indicado para estudantes, estagiários e quem está mudando de área",

    fHab: "Habilidades",
    hHab: "uma categoria por linha: Categoria: itens",
    pHab: "Ex.:\nAnálise de dados: SQL, Python, Power BI, Excel avançado\nMetodologias: Scrum, Kanban\nCompetências: comunicação com stakeholders, organização",
    fIdi: "Idiomas",
    hIdi: "um por linha: Idioma: nível",
    pIdi: "Ex.:\nInglês: avançado\nEspanhol: intermediário",
    fCert: "Certificações e cursos",
    hCert: "um por linha, com o nome oficial e o ano",
    pCert:
      "Ex.:\nMicrosoft Certified: Power BI Data Analyst Associate (2024)\nGoogle Data Analytics Professional Certificate (2023)",

    privacyTitle: "Seus dados ficam neste navegador",
    privacyText:
      'Nada do que você digita vai para servidores. Em computador compartilhado, exporte uma cópia e use "Limpar tudo" ao sair.',
    exportBtn: "Exportar dados",
    importBtn: "Importar dados",
    clearBtn: "Limpar tudo",
    clearConfirm: "Confirmar limpeza",
    checksTitle: "Checagem para ATS",
    jobTitle: "Comparar com uma vaga",
    jobLabel: "Cole aqui a descrição da vaga",
    jobHint: "os termos ficam só no seu navegador",
    jobPh: "Ex.: Requisitos: Python, Django, PostgreSQL, Docker, AWS...",
    sheetBar: "Prévia do PDF",
    atsBtn: "Ver como o ATS lê",
    sheetAria: "Prévia do currículo",
    atsTitle: "Texto extraído do seu PDF",
    atsClose: "Fechar",
    atsHint:
      "É assim que um sistema de triagem lê o arquivo: na mesma ordem, sem perder seções. Este texto foi extraído do PDF gerado agora, com a mesma técnica que esses sistemas usam.",
    atsNewPage: "— nova página —",

    copyTitle: "Você já tem um currículo em {lang}",
    copyText: "Copie os dados para cá e só traduza os textos, ou comece pelo exemplo.",
    copyBtn: "Copiar de {lang}",
    copyDismiss: "Começar pelo exemplo",

    selectUf: "Selecione",
    ufFirst: "Escolha a UF primeiro",
    loadingCities: "Carregando cidades…",
    selectCity: "Selecione a cidade",
    selectCountry: "Selecione o país",
    loadFail: "Não foi possível carregar",

    rNome: "Use apenas letras, espaço, ponto, hífen e apóstrofo.",
    rCargo: "Símbolo não permitido. Aceitos: . , : ' + # / - ( ) &",
    rLocal: "Use apenas letras, vírgula, hífen e parênteses, sem números.",
    rCurso: "Use apenas letras, números e . , : ' & / - ( )",
    rLivre: "Caractere não permitido neste campo.",
    rTexto: "Emojis não são lidos corretamente por sistemas de triagem.",
    rLink: "Endereços não têm espaços.",
    rTel: "Use apenas números, espaço e + ( ) -",
    vEmail: "E-mail incompleto. Ex.: nome.sobrenome@email.com",
    vLinkedin: "Use o endereço do perfil: linkedin.com/in/seu-perfil",
    vTel: "Telefone incompleto: informe DDD + número.",
    vTelIntl: "Telefone incompleto: inclua o código do país, ex.: +351 912 345 678.",
    dMonth: "Mês inválido: use de 01 a 12.",
    dStartFuture: "O início não pode estar no futuro.",
    dEndBefore: "O fim não pode ser antes do início.",
    dEndFutureExp: 'Data no futuro. Se ainda trabalha aqui, marque "Trabalho aqui atualmente".',
    dEndFutureEdu: 'Conclusão no futuro? Mude a situação para "Em andamento".',

    checkOk: "Concluído:",
    checkNo: "Pendente:",
    cContact: "Nome, e-mail e telefone no corpo do documento",
    cCargo: "Cargo pretendido abaixo do nome",
    cResumo: "Resumo entre 30 e 90 palavras (agora: {n})",
    cSkills: "Pelo menos 6 habilidades (agora: {n})",
    cDates: "Toda experiência tem início e fim (MM/AAAA)",
    cNumbers: "Metade ou mais conquistas com números",
    cNow: "(agora: {a} de {b})",
    cNone: "(nenhuma conquista ainda)",
    cVerbs: "Conquistas começam com verbo de ação",
    cVerbsFail: "({a} de {b} sem verbo no início, ex.: {ex})",
    cLength: "Conquistas com até 2 linhas cada",
    cLengthFail: "(longa: {ex})",
    cLinkedin: "Link do LinkedIn",
    cErrors: "Campos com erro no formulário ({n})",
    cNoErrors: "Nenhum campo com erro",

    jobNone: "Não encontrei termos técnicos nessa descrição. Cole o texto completo da vaga.",
    jobScore: "dos termos da vaga aparecem no seu currículo ({found} de {total}).",
    jobMissing: "Ausentes no currículo: inclua os que você realmente domina.",
    jobFound: "Já presentes:",

    stPdf: "Gerando o PDF…",
    stPdfOk: "PDF gerado: {name}",
    stPdfOkErr: {
      one: "PDF gerado: {name}. Atenção: {n} campo com erro no formulário.",
      other: "PDF gerado: {name}. Atenção: {n} campos com erro no formulário."
    },
    stPdfFail: "Não foi possível gerar o PDF. Recarregue a página e tente de novo.",
    stFont: "Baixando a fonte para caracteres especiais…",
    stSaveFail:
      "Atenção: este navegador não permite salvar o rascunho (aba anônima ou armazenamento cheio). Exporte os dados antes de fechar.",
    stCorrupt: "O rascunho salvo estava corrompido e não pôde ser lido. O formulário começou vazio.",
    stCities: "Não foi possível carregar a lista de cidades. Verifique a conexão e recarregue a página.",
    stExport: "Dados exportados: {name}. Guarde o arquivo em local seguro, ele tem seus dados pessoais.",
    stImportBig: "Arquivo grande demais para ser um rascunho do CV Legível (máximo 1 MB).",
    stImportBad: "Não foi possível ler o arquivo: ele não é um JSON válido.",
    stImportNotCv: "O arquivo não parece ser um rascunho exportado pelo CV Legível.",
    stImportConfirm: "Importar vai substituir o currículo que está no formulário. Continuar?",
    stImported: "Dados importados de {name}.",
    stClearArmed: 'Clique de novo em "Confirmar limpeza" para apagar todos os dados deste idioma neste navegador.',
    stCleared: "Todos os dados deste idioma foram apagados deste navegador.",
    stCopied: "Dados copiados de {lang}. Agora traduza os textos.",
    stAts: "Gerando o PDF e extraindo o texto…",
    stAtsFail: "Não foi possível testar a leitura do PDF. Recarregue a página e tente de novo."
  },

  help: {
    personal: `<li><b>Cargo pretendido:</b> copie o título da vaga. <span class="good">Analista de Dados Pleno</span> <span class="bad">Profissional em busca de oportunidade</span></li>
            <li><b>E-mail:</b> de preferência no formato nome.sobrenome, sem apelidos.</li>
            <li><b>LinkedIn e portfólio:</b> pode colar o link inteiro, ele é ajustado automaticamente.</li>
            <li><b>Não inclua</b> foto, CPF, RG, estado civil, idade ou endereço completo. Não são pedidos em currículo e expõem seus dados.</li>`,
    summary: `<li>Use 2 a 4 frases nesta ordem: <b>quem você é</b> + anos de experiência, <b>principais ferramentas</b>, <b>um resultado</b> com número e <b>o que você busca</b>.</li>
            <li><span class="good">Analista de dados com 4 anos de experiência em SQL e Power BI. Automatizei relatórios que economizaram 20 horas por mês.</span></li>
            <li><span class="bad">Sou uma pessoa proativa, dinâmica e comunicativa.</span> Adjetivos genéricos não dizem o que você faz.</li>
            <li><b>Sem experiência?</b> Fale do curso, de projetos e do que você quer aprender.</li>`,
    exp: `<li>Comece pela experiência <b>mais recente</b>. Estágio, freelance e trabalho voluntário também contam.</li>
            <li><b>Conquistas:</b> verbo no passado + o que você fez + ferramenta + resultado com número. No emprego atual, o presente também vale ("Desenvolvo", "Lidero").</li>
            <li><span class="good">Reduzi em 30% o tempo de atendimento implantando um novo fluxo no Zendesk</span></li>
            <li><span class="bad">Responsável pelo atendimento ao cliente</span> Descreve a função, não o resultado.</li>
            <li><b>Não tem o número exato?</b> Use uma estimativa honesta: "cerca de 50 clientes por mês".</li>`,
    edu: `<li>Escreva o tipo e o nome do curso: <span class="good">Bacharelado em Ciência da Computação</span> <span class="bad">BCC</span></li>
            <li>Instituição com o nome completo e a sigla entre parênteses.</li>
            <li><b>Ainda estudando?</b> Escolha "Em andamento" e informe a previsão de conclusão.</li>
            <li>Inclua o ensino médio só se for a sua formação mais alta.</li>`,
    skills: `<li><b>Habilidades:</b> uma categoria por linha, no formato <code>Categoria: itens separados por vírgula</code>. A categoria sai em negrito no currículo.</li>
            <li>Use <b>os mesmos termos da vaga</b>: se ela pede "Power BI", não escreva só "BI".</li>
            <li><b>Idiomas:</b> <code>Idioma: nível</code>. Níveis: básico, intermediário, avançado, fluente ou nativo. Seja honesto, o nível pode ser testado na entrevista.</li>
            <li><b>Certificações:</b> nome oficial e ano. Cursos curtos só se tiverem relação com a vaga.</li>`
  },

  cv: {
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

  // Regras que dependem do idioma. Expressões regulares em texto, aplicadas à primeira palavra
  // da conquista em minúsculas (com acento); "irregular" é comparado sem acento.
  rules: {
    // verbo no passado: criei, desenvolvi, construí
    past: "(ei|i|í)$",
    // presente, aceito só no emprego atual: desenvolvo, lidero, gerencio
    // (sem os substantivos "Gestão", "Desenvolvimento", "Atendimento")
    current: "(?<!ã|ment)o$",
    irregular:
      "fiz fui tive obtive mantive detive contive pus propus compus dispus trouxe dei estive pude quis vim conduzi reduzi produzi introduzi traduzi",
    // palavras comuns em descrições de vaga, ignoradas na comparação com a vaga
    jobStop:
      "a o e é de da do das dos em no na nos nas um uma uns umas para por com sem que se ao aos à às ou como mais muito " +
      "sua seu suas seus nossa nosso nossas nossos você vocês ser ter estar será são está esta este essa esse " +
      "isso isto pelo pela pelos pelas entre sobre até desde quando onde qual quais também já não sim " +
      "vaga vagas empresa time equipe área trabalho trabalhar atuar atuação experiência conhecimento conhecimentos " +
      "requisitos requisito diferencial diferenciais desejável benefícios responsabilidades atribuições qualificações " +
      "atividades buscamos procuramos oferecemos valorizamos somos estamos contamos venha seja profissional pessoa pessoas " +
      "forma boa bom bons boas novo nova novos novas anos ano dia dias mês meses horas " +
      "desenvolver colaborar criar manter garantir participar apoiar implementar " +
      "júnior pleno sênior estagiário estagiária trainee desenvolvedor desenvolvedora engenheiro engenheira analista"
  },

  sample: {
    nome: "Mariana Souza",
    cargo: "Desenvolvedora Back-end Pleno",
    email: "mariana.souza@email.com",
    telefone: "(48) 99999-0000",
    pais: "BR",
    uf: "SC",
    cidade: "Florianópolis",
    linkedin: "linkedin.com/in/marianasouza",
    site: "github.com/marianasouza",
    resumo:
      "Desenvolvedora back-end com 5 anos de experiência em Python e Django, focada em APIs REST, integrações e performance de banco de dados. Liderei a migração de um monólito para serviços em AWS e reduzi o tempo médio de resposta em 40%. Busco atuar em produtos SaaS com times ágeis.",
    exp: [
      {
        cargo: "Desenvolvedora Back-end",
        empresa: "Nuvem Tech",
        local: "Florianópolis, SC",
        modalidade: "hibrido",
        inicio: "03/2022",
        fim: "",
        atual: true,
        bullets:
          "Desenvolvi APIs REST em Django REST Framework usadas por 120 mil usuários ativos\nReduzi em 40% o tempo médio de resposta otimizando consultas PostgreSQL e adicionando cache Redis\nImplantei pipeline de CI/CD com GitHub Actions e Docker, cortando o tempo de deploy de 30 para 8 minutos"
      },
      {
        cargo: "Desenvolvedora Júnior",
        empresa: "Agência Pixel",
        local: "",
        modalidade: "remoto",
        inicio: "01/2020",
        fim: "02/2022",
        atual: false,
        bullets:
          "Construí integrações com gateways de pagamento (Stripe, Pagar.me) em Python\nEscrevi testes automatizados com pytest, elevando a cobertura de 35% para 80%"
      }
    ],
    edu: [
      {
        curso: "Bacharelado em Ciência da Computação",
        inst: "Universidade Federal de Santa Catarina (UFSC)",
        status: "concluido",
        inicio: "02/2015",
        fim: "12/2019"
      }
    ],
    habilidades:
      "Back-end: Python, Django, Django REST Framework\nBanco de dados: PostgreSQL, Redis\nInfraestrutura: Docker, AWS, CI/CD\nPráticas: Git, Testes automatizados, Scrum",
    idiomas: "Português: nativo\nInglês: avançado",
    certificacoes: "AWS Certified Cloud Practitioner (2023)"
  }
};
