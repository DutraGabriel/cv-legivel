// Español. Debe tener exactamente las mismas claves que pt.js (lo verifica una prueba unitaria).
export default {
  meta: {
    htmlLang: "es",
    locale: "es-ES",
    ogLocale: "es_ES",
    name: "Español",
    title: "CV Legível — currículums que los ATS pueden leer",
    description:
      "Generador gratuito de currículum en PDF de una sola columna, con texto real y secciones estándar, optimizado para sistemas de selección (ATS) y filtros con IA. Tus datos no salen del navegador.",
    ogDescription:
      "Crea un currículum en PDF que los sistemas de selección (ATS) y la IA pueden leer, con revisión en tiempo real y comparación con la oferta. Gratis y sin registro.",
    ogAlt: "Pantalla de CV Legível: formulario, revisión ATS y vista previa del currículum en A4",
    ogImage: "docs/og-image-es.png",
    appDescription:
      "Generador de currículum en PDF legible por ATS. Funciona sin conexión y tus datos no salen del navegador."
  },

  ui: {
    skip: "Ir al formulario",
    noscript:
      "CV Legível necesita JavaScript para crear el currículum. Activa JavaScript en este sitio y recarga la página.",
    suggest: "Este sitio también está en español.",
    suggestGo: "Ver en español",
    suggestClose: "Ahora no",
    sub: "Completa el formulario y genera un PDF de una sola columna, con texto real y títulos estándar, que los sistemas de selección (ATS) y las herramientas de RR. HH. con IA pueden interpretar sin perder información.",
    badge: "Datos de ejemplo",
    langNav: "Idioma",
    pdf: "Generar PDF",
    themeBtn: "Tema",
    themeLight: "☀ Tema claro",
    themeDark: "☾ Tema oscuro",
    themeLightAria: "Cambiar al tema claro",
    themeDarkAria: "Cambiar al tema oscuro",
    tabsAria: "Alternar entre formulario y vista previa",
    tabEdit: "Editar",
    tabPreview: "Vista previa y revisión",

    legPersonal: "Datos personales",
    legSummary: "Resumen profesional",
    legExp: "Experiencia profesional",
    legEdu: "Formación académica",
    legSkills: "Habilidades, idiomas y certificaciones",
    help: "Cómo completar",

    fNome: "Nombre completo",
    hNome: "solo letras; sin apodos",
    pNome: "Ej.: Ana Martínez",
    fCargo: "Puesto al que aspiras",
    hCargo: "igual al título de la oferta",
    pCargo: "Ej.: Analista de Datos Semi Senior",
    fEmail: "Correo electrónico",
    pEmail: "Ej.: ana.martinez@email.com",
    fTel: "Teléfono",
    pTel: "Ej.: +34 612 345 678",
    fPais: "País",
    fUf: "Estado",
    fCidade: "Ciudad",
    pCidade: "Ej.: Madrid",
    fLinkedin: "LinkedIn",
    pLinkedin: "linkedin.com/in/tu-perfil",
    fSite: "Portafolio / GitHub (opcional)",
    pSite: "Ej.: github.com/anamartinez",

    fResumo: "De 2 a 4 frases: quién eres, años de experiencia, especialidad y qué aportas",
    pResumo:
      "Ej.: Analista de datos con 4 años de experiencia en SQL, Python y Power BI en el sector retail. Automaticé informes que ahorraron 20 horas al mes al equipo financiero. Busco un puesto de Analista de Datos Semi Senior en una empresa orientada a datos.",
    words: { one: "{n} palabra", other: "{n} palabras" },

    expItem: "Experiencia {n}",
    expRecent: "la más reciente primero",
    remove: "Eliminar",
    fExpCargo: "Puesto",
    hExpCargo: "título estándar del mercado, sin siglas internas",
    pExpCargo: "Ej.: Analista de Datos Junior",
    fEmpresa: "Empresa",
    pEmpresa: "Ej.: Supermercados El Ahorro",
    fLocal: "Ubicación",
    pLocal: "Ej.: Madrid, España",
    fModalidade: "Modalidad",
    none: "No indicar",
    mod: { presencial: "Presencial", hibrido: "Híbrido", remoto: "Remoto" },
    fInicio: "Inicio",
    fFim: "Fin",
    datePh: "MM/AAAA",
    fAtual: "Trabajo aquí actualmente",
    fBullets: "Logros",
    hBullets:
      "uno por línea: verbo en pasado (Desarrollé, Creé, Reduje) + qué hiciste + resultado con número; en el empleo actual vale el presente (Desarrollo)",
    pBullets:
      "Ej.:\nAutomaticé 12 informes semanales con Python y SQL, ahorrando 20 horas al mes al equipo financiero\nCreé paneles en Power BI usados por 15 gerentes de tienda para seguir las ventas diarias\nReduje un 35% los errores de registro implementando validaciones en el proceso ETL",
    addExp: "+ Añadir experiencia",

    eduItem: "Formación {n}",
    fCurso: "Titulación",
    hCurso: "tipo + nombre de la carrera",
    pCurso: "Ej.: Grado en Administración de Empresas",
    fInst: "Institución",
    hInst: "nombre completo y sigla",
    pInst: "Ej.: Universidad Complutense de Madrid (UCM)",
    fStatus: "Estado",
    status: { concluido: "Completado", andamento: "En curso", trancado: "Interrumpido" },
    fConclusao: "Finalización",
    fPrevisao: "Finalización prevista",
    addEdu: "+ Añadir formación",
    order: "Mostrar la formación antes de la experiencia",
    orderHint: "recomendado para estudiantes, becarios y quienes cambian de área",

    fHab: "Habilidades",
    hHab: "una categoría por línea: Categoría: elementos",
    pHab: "Ej.:\nAnálisis de datos: SQL, Python, Power BI, Excel avanzado\nMetodologías: Scrum, Kanban\nCompetencias: comunicación con stakeholders, organización",
    fIdi: "Idiomas",
    hIdi: "uno por línea: Idioma: nivel",
    pIdi: "Ej.:\nInglés: avanzado\nPortugués: intermedio",
    fCert: "Certificaciones y cursos",
    hCert: "uno por línea, con el nombre oficial y el año",
    pCert:
      "Ej.:\nMicrosoft Certified: Power BI Data Analyst Associate (2024)\nGoogle Data Analytics Professional Certificate (2023)",

    privacyTitle: "Tus datos se quedan en este navegador",
    privacyText:
      'Nada de lo que escribes se envía a servidores. En un ordenador compartido, exporta una copia y usa "Borrar todo" al terminar.',
    exportBtn: "Exportar datos",
    importBtn: "Importar datos",
    clearBtn: "Borrar todo",
    clearConfirm: "Confirmar borrado",
    checksTitle: "Revisión ATS",
    jobTitle: "Comparar con una oferta",
    jobLabel: "Pega aquí la descripción de la oferta",
    jobHint: "se queda solo en tu navegador",
    jobPh: "Ej.: Requisitos: Python, Django, PostgreSQL, Docker, AWS...",
    sheetBar: "Vista previa del PDF",
    atsBtn: "Ver cómo lo lee el ATS",
    sheetAria: "Vista previa del currículum",
    atsTitle: "Texto extraído de tu PDF",
    atsClose: "Cerrar",
    atsHint:
      "Así es como un sistema de selección lee el archivo: en el mismo orden, sin perder secciones. Este texto se extrajo del PDF recién generado, con la misma técnica que usan esos sistemas.",
    atsNewPage: "— nueva página —",

    copyTitle: "Ya tienes un currículum en {lang}",
    copyText: "Copia esos datos aquí y solo traduce los textos, o empieza con el ejemplo.",
    copyBtn: "Copiar de {lang}",
    copyDismiss: "Empezar con el ejemplo",

    selectUf: "Selecciona",
    ufFirst: "Elige primero el estado",
    loadingCities: "Cargando ciudades…",
    selectCity: "Selecciona la ciudad",
    selectCountry: "Selecciona el país",
    loadFail: "No se pudo cargar",

    rNome: "Usa solo letras, espacios, puntos, guiones y apóstrofos.",
    rCargo: "Símbolo no permitido. Se aceptan: . , : ' + # / - ( ) &",
    rLocal: "Usa solo letras, comas, guiones y paréntesis, sin números.",
    rCurso: "Usa solo letras, números y . , : ' & / - ( )",
    rLivre: "Carácter no permitido en este campo.",
    rTexto: "Los sistemas de selección no leen bien los emojis.",
    rLink: "Las direcciones web no llevan espacios.",
    rTel: "Usa solo números, espacios y + ( ) -",
    vEmail: "Correo incompleto. Ej.: nombre.apellido@email.com",
    vLinkedin: "Usa la dirección de tu perfil: linkedin.com/in/tu-perfil",
    vTel: "Teléfono incompleto: indica el prefijo y el número.",
    vTelIntl: "Teléfono incompleto: incluye el código del país, ej.: +34 612 345 678.",
    dMonth: "Mes no válido: usa de 01 a 12.",
    dStartFuture: "La fecha de inicio no puede estar en el futuro.",
    dEndBefore: "La fecha de fin no puede ser anterior al inicio.",
    dEndFutureExp: 'Fecha en el futuro. Si aún trabajas aquí, marca "Trabajo aquí actualmente".',
    dEndFutureEdu: '¿Finalización en el futuro? Cambia el estado a "En curso".',

    checkOk: "Hecho:",
    checkNo: "Pendiente:",
    cContact: "Nombre, correo y teléfono en el cuerpo del documento",
    cCargo: "Puesto al que aspiras debajo del nombre",
    cResumo: "Resumen de entre 30 y 90 palabras (ahora: {n})",
    cSkills: "Al menos 6 habilidades (ahora: {n})",
    cDates: "Cada experiencia tiene inicio y fin (MM/AAAA)",
    cNumbers: "La mitad o más de los logros con números",
    cNow: "(ahora: {a} de {b})",
    cNone: "(aún no hay logros)",
    cVerbs: "Los logros empiezan con un verbo de acción",
    cVerbsFail: "({a} de {b} sin verbo al inicio, ej.: {ex})",
    cLength: "Logros de hasta 2 líneas cada uno",
    cLengthFail: "(largo: {ex})",
    cLinkedin: "Enlace de LinkedIn",
    cErrors: "Campos con errores en el formulario ({n})",
    cNoErrors: "Ningún campo con errores",

    jobNone: "No encontré términos técnicos en esta descripción. Pega el texto completo de la oferta.",
    jobScore: "de los términos de la oferta aparecen en tu currículum ({found} de {total}).",
    jobMissing: "Faltan en tu currículum: añade los que realmente dominas.",
    jobFound: "Ya presentes:",

    stPdf: "Generando el PDF…",
    stPdfOk: "PDF generado: {name}",
    stPdfOkErr: {
      one: "PDF generado: {name}. Atención: {n} campo con errores en el formulario.",
      other: "PDF generado: {name}. Atención: {n} campos con errores en el formulario."
    },
    stPdfFail: "No se pudo generar el PDF. Recarga la página e inténtalo de nuevo.",
    stFont: "Descargando la fuente para caracteres especiales…",
    stSaveFail:
      "Atención: este navegador no permite guardar el borrador (ventana privada o almacenamiento lleno). Exporta tus datos antes de cerrar.",
    stCorrupt: "El borrador guardado estaba dañado y no se pudo leer. El formulario empezó vacío.",
    stCities: "No se pudo cargar la lista de ciudades. Revisa tu conexión y recarga la página.",
    stExport: "Datos exportados: {name}. Guarda el archivo en un lugar seguro, contiene tus datos personales.",
    stImportBig: "El archivo es demasiado grande para ser un borrador de CV Legível (máximo 1 MB).",
    stImportBad: "No se pudo leer el archivo: no es un JSON válido.",
    stImportNotCv: "El archivo no parece ser un borrador exportado por CV Legível.",
    stImportConfirm: "Importar reemplazará el currículum del formulario. ¿Continuar?",
    stImported: "Datos importados de {name}.",
    stClearArmed:
      'Haz clic de nuevo en "Confirmar borrado" para eliminar todos los datos de este idioma en este navegador.',
    stCleared: "Se eliminaron todos los datos de este idioma de este navegador.",
    stCopied: "Datos copiados de {lang}. Ahora traduce los textos.",
    stAts: "Generando el PDF y extrayendo el texto…",
    stAtsFail: "No se pudo probar la lectura del PDF. Recarga la página e inténtalo de nuevo."
  },

  help: {
    personal: `<li><b>Puesto al que aspiras:</b> copia el título de la oferta. <span class="good">Analista de Datos Semi Senior</span> <span class="bad">Profesional en busca de oportunidades</span></li>
            <li><b>Correo:</b> preferiblemente nombre.apellido, sin apodos.</li>
            <li><b>LinkedIn y portafolio:</b> puedes pegar el enlace completo, se ajusta automáticamente.</li>
            <li><b>No incluyas</b> foto, DNI, estado civil, edad ni dirección completa. No se piden en un currículum y exponen tus datos.</li>`,
    summary: `<li>Usa de 2 a 4 frases en este orden: <b>quién eres</b> + años de experiencia, <b>principales herramientas</b>, <b>un resultado</b> con número y <b>qué buscas</b>.</li>
            <li><span class="good">Analista de datos con 4 años de experiencia en SQL y Power BI. Automaticé informes que ahorraron 20 horas al mes.</span></li>
            <li><span class="bad">Soy una persona proactiva, dinámica y comunicativa.</span> Los adjetivos genéricos no dicen qué haces.</li>
            <li><b>¿Sin experiencia?</b> Habla de tus estudios, proyectos y de lo que quieres aprender.</li>`,
    exp: `<li>Empieza por la experiencia <b>más reciente</b>. Las prácticas, el trabajo freelance y el voluntariado también cuentan.</li>
            <li><b>Logros:</b> verbo en pasado + qué hiciste + herramienta + resultado con número. En el empleo actual también vale el presente ("Desarrollo", "Lidero").</li>
            <li><span class="good">Reduje un 30% el tiempo de atención implantando un nuevo flujo en Zendesk</span></li>
            <li><span class="bad">Responsable de la atención al cliente</span> Describe la función, no el resultado.</li>
            <li><b>¿No tienes el número exacto?</b> Usa una estimación honesta: "unos 50 clientes al mes".</li>`,
    edu: `<li>Escribe el tipo y el nombre de la titulación: <span class="good">Grado en Ingeniería Informática</span> <span class="bad">GII</span></li>
            <li>Institución con el nombre completo y la sigla entre paréntesis.</li>
            <li><b>¿Sigues estudiando?</b> Elige "En curso" e indica la fecha prevista de finalización.</li>
            <li>Incluye la educación secundaria solo si es tu nivel más alto.</li>`,
    skills: `<li><b>Habilidades:</b> una categoría por línea, con el formato <code>Categoría: elementos separados por comas</code>. La categoría aparece en negrita.</li>
            <li>Usa <b>los mismos términos de la oferta</b>: si pide "Power BI", no escribas solo "BI".</li>
            <li><b>Idiomas:</b> <code>Idioma: nivel</code>. Niveles: básico, intermedio, avanzado, fluido o nativo. Sé honesto; pueden evaluarlo en la entrevista.</li>
            <li><b>Certificaciones:</b> nombre oficial y año. Cursos cortos solo si tienen relación con el puesto.</li>`
  },

  cv: {
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
  },

  // Reglas que dependen del idioma (ver los comentarios en pt.js).
  rules: {
    // pasado: desarrollé, construí, lideró
    past: "[éíó]$",
    // presente, aceptado solo en el empleo actual: desarrollo, lidero, gestiono
    // (sin sustantivos como "Mantenimiento")
    current: "(?<!mient)o$",
    irregular:
      "hice fui tuve obtuve mantuve puse propuse traje di estuve pude quise vine conduje reduje produje introduje traduje hizo tuvo obtuvo mantuvo condujo redujo produjo",
    jobStop:
      "el la los las del con por para una unos unas como mas más sus nuestro nuestra nuestros nuestras y o en de un al lo le se su " +
      "tu tus nos que es son ser estar muy empresa equipo trabajo puesto oferta vacante perfil requisitos requisito " +
      "experiencia conocimiento conocimientos años año buscamos ofrecemos valoramos somos contamos tenemos estamos deseable " +
      "deseables imprescindible responsabilidades funciones beneficios sobre nosotros quiénes únete " +
      "desarrollar colaborar diseñar mantener garantizar participar apoyar implementar crear trabajar " +
      "júnior junior sénior senior semisenior becario becaria desarrollador desarrolladora ingeniero ingeniera programador programadora analista"
  },

  sample: {
    nome: "Mariana Souza",
    cargo: "Desarrolladora Back-end",
    email: "mariana.souza@email.com",
    telefone: "+55 48 99999-0000",
    pais: "BR",
    uf: "",
    cidade: "Florianópolis",
    linkedin: "linkedin.com/in/marianasouza",
    site: "github.com/marianasouza",
    resumo:
      "Desarrolladora back-end con 5 años de experiencia en Python y Django, especializada en APIs REST, integraciones y rendimiento de bases de datos. Lideré la migración de un monolito a servicios en AWS y reduje un 40% el tiempo medio de respuesta. Busco unirme a un equipo ágil de producto SaaS.",
    exp: [
      {
        cargo: "Desarrolladora Back-end",
        empresa: "Nuvem Tech",
        local: "Florianópolis, Brasil",
        modalidade: "hibrido",
        inicio: "03/2022",
        fim: "",
        atual: true,
        bullets:
          "Desarrollé APIs REST con Django REST Framework usadas por 120 mil usuarios activos\nReduje un 40% el tiempo medio de respuesta optimizando consultas en PostgreSQL y añadiendo caché con Redis\nImplementé un pipeline de CI/CD con GitHub Actions y Docker, reduciendo el despliegue de 30 a 8 minutos"
      },
      {
        cargo: "Desarrolladora Junior",
        empresa: "Agência Pixel",
        local: "",
        modalidade: "remoto",
        inicio: "01/2020",
        fim: "02/2022",
        atual: false,
        bullets:
          "Construí integraciones con pasarelas de pago (Stripe, Pagar.me) en Python\nEscribí pruebas automatizadas con pytest, elevando la cobertura del 35% al 80%"
      }
    ],
    edu: [
      {
        curso: "Grado en Ciencias de la Computación",
        inst: "Universidad Federal de Santa Catarina (UFSC)",
        status: "concluido",
        inicio: "02/2015",
        fim: "12/2019"
      }
    ],
    habilidades:
      "Back-end: Python, Django, Django REST Framework\nBases de datos: PostgreSQL, Redis\nInfraestructura: Docker, AWS, CI/CD\nPrácticas: Git, Pruebas automatizadas, Scrum",
    idiomas: "Portugués: nativo\nInglés: avanzado",
    certificacoes: "AWS Certified Cloud Practitioner (2023)"
  }
};
