// English. Must have exactly the same keys as pt.js (checked by a unit test).
export default {
  meta: {
    htmlLang: "en",
    locale: "en-US",
    ogLocale: "en_US",
    name: "English",
    title: "CV Legível — resumes that ATS software can read",
    description:
      "Free single-column PDF resume builder with real text and standard sections, optimized for applicant tracking systems (ATS) and AI screening. Your data never leaves your browser.",
    ogDescription:
      "Build a PDF resume that applicant tracking systems (ATS) and AI screeners can read, with real-time checks and job description matching. Free, no sign-up.",
    ogAlt: "CV Legível screen: form, ATS check and A4 resume preview",
    ogImage: "docs/og-image-en.png",
    appDescription: "ATS-friendly PDF resume builder. Works offline and your data never leaves your browser."
  },

  ui: {
    skip: "Skip to the form",
    noscript: "CV Legível needs JavaScript to build your resume. Turn on JavaScript for this site and reload the page.",
    suggest: "This site is also available in English.",
    suggestGo: "Switch to English",
    suggestClose: "Not now",
    sub: "Fill in the form and get a single-column PDF with real text and standard headings that applicant tracking systems (ATS) and AI recruiting tools can parse without losing information.",
    badge: "Sample data",
    langNav: "Language",
    pdf: "Download PDF",
    themeBtn: "Theme",
    themeLight: "☀ Light theme",
    themeDark: "☾ Dark theme",
    themeLightAria: "Switch to light theme",
    themeDarkAria: "Switch to dark theme",
    tabsAria: "Switch between form and preview",
    tabEdit: "Edit",
    tabPreview: "Preview and checks",

    legPersonal: "Personal details",
    legSummary: "Professional summary",
    legExp: "Work experience",
    legEdu: "Education",
    legSkills: "Skills, languages and certifications",
    help: "How to fill this in",

    fNome: "Full name",
    hNome: "letters only; no nicknames",
    pNome: "e.g., Anna Roberts",
    fCargo: "Target job title",
    hCargo: "same as the job posting",
    pCargo: "e.g., Data Analyst II",
    fEmail: "Email",
    pEmail: "e.g., anna.roberts@email.com",
    fTel: "Phone",
    pTel: "e.g., +1 555 123 4567",
    fPais: "Country",
    fUf: "State",
    fCidade: "City",
    pCidade: "e.g., Austin",
    fLinkedin: "LinkedIn",
    pLinkedin: "linkedin.com/in/your-profile",
    fSite: "Portfolio / GitHub (optional)",
    pSite: "e.g., github.com/annaroberts",

    fResumo: "2 to 4 sentences: who you are, years of experience, specialty and the value you deliver",
    pResumo:
      "e.g., Data analyst with 4 years of experience in SQL, Python and Power BI in retail. Automated reports that saved the finance team 20 hours a month. Looking for a Data Analyst II role at a data-driven company.",
    words: { one: "{n} word", other: "{n} words" },

    expItem: "Experience {n}",
    expRecent: "most recent first",
    remove: "Remove",
    fExpCargo: "Job title",
    hExpCargo: "industry-standard title, no internal codes",
    pExpCargo: "e.g., Junior Data Analyst",
    fEmpresa: "Company",
    pEmpresa: "e.g., Fresh Market Inc.",
    fLocal: "Location",
    pLocal: "e.g., Austin, TX",
    fModalidade: "Work model",
    none: "Not specified",
    mod: { presencial: "On-site", hibrido: "Hybrid", remoto: "Remote" },
    fInicio: "Start",
    fFim: "End",
    datePh: "MM/YYYY",
    fAtual: "I currently work here",
    fBullets: "Achievements",
    hBullets:
      "one per line: past-tense action verb (Developed, Built, Reduced) + what you did + a measurable result; present tense is fine for your current job (Develop)",
    pBullets:
      "e.g.:\nAutomated 12 weekly reports with Python and SQL, saving the finance team 20 hours a month\nBuilt Power BI dashboards used by 15 store managers to track daily sales\nReduced data entry errors by 35% by adding validation to the ETL process",
    addExp: "+ Add experience",

    eduItem: "Education {n}",
    fCurso: "Degree / program",
    hCurso: "degree type + field",
    pCurso: "e.g., Bachelor of Business Administration",
    fInst: "School",
    hInst: "full name and abbreviation",
    pInst: "e.g., University of Texas at Austin (UT Austin)",
    fStatus: "Status",
    status: { concluido: "Completed", andamento: "In progress", trancado: "Discontinued" },
    fConclusao: "Graduation",
    fPrevisao: "Expected graduation",
    addEdu: "+ Add education",
    order: "Show education before experience",
    orderHint: "recommended for students, interns and career changers",

    fHab: "Skills",
    hHab: "one category per line: Category: items",
    pHab: "e.g.:\nData analysis: SQL, Python, Power BI, advanced Excel\nMethodologies: Scrum, Kanban\nSoft skills: stakeholder communication, organization",
    fIdi: "Languages",
    hIdi: "one per line: Language: level",
    pIdi: "e.g.:\nEnglish: native\nSpanish: intermediate",
    fCert: "Certifications and courses",
    hCert: "one per line, with the official name and year",
    pCert:
      "e.g.:\nMicrosoft Certified: Power BI Data Analyst Associate (2024)\nGoogle Data Analytics Professional Certificate (2023)",

    privacyTitle: "Your data stays in this browser",
    privacyText:
      'Nothing you type is sent to any server. On a shared computer, export a copy and use "Clear all" when you are done.',
    exportBtn: "Export data",
    importBtn: "Import data",
    clearBtn: "Clear all",
    clearConfirm: "Confirm clear",
    checksTitle: "ATS check",
    jobTitle: "Compare with a job posting",
    jobLabel: "Paste the job description here",
    jobHint: "it stays in your browser",
    jobPh: "e.g., Requirements: Python, Django, PostgreSQL, Docker, AWS...",
    sheetBar: "PDF preview",
    atsBtn: "See what the ATS reads",
    sheetAria: "Resume preview",
    atsTitle: "Text extracted from your PDF",
    atsClose: "Close",
    atsHint:
      "This is how a screening system reads your file: in the same order, without losing sections. This text was extracted from the PDF just generated, using the same technique those systems use.",
    atsNewPage: "— new page —",

    copyTitle: "You already have a resume in {lang}",
    copyText: "Copy that data here and just translate the text, or start from the sample.",
    copyBtn: "Copy from {lang}",
    copyDismiss: "Start from the sample",

    selectUf: "Select",
    ufFirst: "Choose a state first",
    loadingCities: "Loading cities…",
    selectCity: "Select a city",
    selectCountry: "Select a country",
    loadFail: "Could not load",

    rNome: "Use letters, spaces, periods, hyphens and apostrophes only.",
    rCargo: "Symbol not allowed. Allowed: . , : ' + # / - ( ) &",
    rLocal: "Use letters, commas, hyphens and parentheses only, no numbers.",
    rCurso: "Use letters, numbers and . , : ' & / - ( ) only",
    rLivre: "Character not allowed in this field.",
    rTexto: "Emojis are not read correctly by screening systems.",
    rLink: "Web addresses have no spaces.",
    rTel: "Use digits, spaces and + ( ) - only",
    vEmail: "Incomplete email. e.g., first.last@email.com",
    vLinkedin: "Use your profile address: linkedin.com/in/your-profile",
    vTel: "Incomplete phone: add area code and number.",
    vTelIntl: "Incomplete phone: include the country code, e.g., +1 555 123 4567.",
    dMonth: "Invalid month: use 01 to 12.",
    dStartFuture: "The start date can't be in the future.",
    dEndBefore: "The end date can't be before the start date.",
    dEndFutureExp: 'Date in the future. If you still work here, check "I currently work here".',
    dEndFutureEdu: 'Graduation in the future? Change the status to "In progress".',

    checkOk: "Done:",
    checkNo: "To do:",
    cContact: "Name, email and phone in the body of the document",
    cCargo: "Target job title below your name",
    cResumo: "Summary between 30 and 90 words (now: {n})",
    cSkills: "At least 6 skills (now: {n})",
    cDates: "Every job has start and end dates (MM/YYYY)",
    cNumbers: "Half or more of the achievements include numbers",
    cNow: "(now: {a} of {b})",
    cNone: "(no achievements yet)",
    cVerbs: "Achievements start with an action verb",
    cVerbsFail: "({a} of {b} don't start with a verb, e.g., {ex})",
    cLength: "Achievements are at most 2 lines each",
    cLengthFail: "(too long: {ex})",
    cLinkedin: "LinkedIn link",
    cErrors: "Fields with errors in the form ({n})",
    cNoErrors: "No fields with errors",

    jobNone: "No technical terms found in this description. Paste the full job posting.",
    jobScore: "of the job's terms appear in your resume ({found} of {total}).",
    jobMissing: "Missing from your resume: add the ones you actually know.",
    jobFound: "Already there:",

    stPdf: "Generating the PDF…",
    stPdfOk: "PDF generated: {name}",
    stPdfOkErr: {
      one: "PDF generated: {name}. Note: {n} field has an error in the form.",
      other: "PDF generated: {name}. Note: {n} fields have errors in the form."
    },
    stPdfFail: "Could not generate the PDF. Reload the page and try again.",
    stFont: "Downloading the font for special characters…",
    stSaveFail:
      "Note: this browser doesn't allow saving the draft (private window or storage full). Export your data before closing.",
    stCorrupt: "The saved draft was corrupted and couldn't be read. The form started empty.",
    stCities: "Could not load the city list. Check your connection and reload the page.",
    stExport: "Data exported: {name}. Keep the file somewhere safe, it contains your personal data.",
    stImportBig: "File too large to be a CV Legível draft (1 MB max).",
    stImportBad: "Could not read the file: it isn't valid JSON.",
    stImportNotCv: "This file doesn't look like a draft exported by CV Legível.",
    stImportConfirm: "Importing will replace the resume in the form. Continue?",
    stImported: "Data imported from {name}.",
    stClearArmed: 'Click "Confirm clear" again to delete all data for this language in this browser.',
    stCleared: "All data for this language was deleted from this browser.",
    stCopied: "Data copied from {lang}. Now translate the text.",
    stAts: "Generating the PDF and extracting the text…",
    stAtsFail: "Could not test the PDF. Reload the page and try again."
  },

  help: {
    personal: `<li><b>Target job title:</b> copy the title from the job posting. <span class="good">Data Analyst II</span> <span class="bad">Motivated professional seeking opportunities</span></li>
            <li><b>Email:</b> ideally first.last, no nicknames.</li>
            <li><b>LinkedIn and portfolio:</b> you can paste the full link; it is cleaned up automatically.</li>
            <li><b>Don't include</b> a photo, date of birth, marital status, ID numbers or your full address. They aren't expected on a resume and expose your data.</li>`,
    summary: `<li>Use 2 to 4 sentences in this order: <b>who you are</b> + years of experience, <b>main tools</b>, <b>one result</b> with a number and <b>what you are looking for</b>.</li>
            <li><span class="good">Data analyst with 4 years of experience in SQL and Power BI. Automated reports that saved 20 hours a month.</span></li>
            <li><span class="bad">I am a proactive, dynamic and communicative person.</span> Generic adjectives don't say what you do.</li>
            <li><b>No experience yet?</b> Talk about your studies, projects and what you want to learn.</li>`,
    exp: `<li>Start with your <b>most recent</b> job. Internships, freelance and volunteer work count too.</li>
            <li><b>Achievements:</b> past-tense verb + what you did + tool + a measurable result. For your current job, present tense works too ("Develop", "Lead").</li>
            <li><span class="good">Reduced customer response time by 30% by rolling out a new Zendesk workflow</span></li>
            <li><span class="bad">Responsible for customer service</span> Describes the role, not the result.</li>
            <li><b>Don't know the exact number?</b> Use an honest estimate: "about 50 clients a month".</li>`,
    edu: `<li>Write the degree type and field: <span class="good">Bachelor of Science in Computer Science</span> <span class="bad">BSCS</span></li>
            <li>School with its full name and the abbreviation in parentheses.</li>
            <li><b>Still studying?</b> Choose "In progress" and enter the expected graduation date.</li>
            <li>Include high school only if it is your highest level of education.</li>`,
    skills: `<li><b>Skills:</b> one category per line, as <code>Category: comma-separated items</code>. The category is shown in bold.</li>
            <li>Use <b>the same terms as the job posting</b>: if it asks for "Power BI", don't write just "BI".</li>
            <li><b>Languages:</b> <code>Language: level</code>. Levels: basic, intermediate, advanced, fluent or native. Be honest; it may be tested in the interview.</li>
            <li><b>Certifications:</b> official name and year. Short courses only if they relate to the job.</li>`
  },

  cv: {
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

  // Language-dependent rules (see the comments in pt.js).
  rules: {
    // past tense: developed, reduced
    past: "ed$",
    // present tense, accepted only for the current job: develop, lead, optimize
    current:
      "^(develop|manage|lead|build|design|create|implement|maintain|own|drive|coordinate|analyze|analyse|support|mentor|deliver|oversee|run|write|test|automate|optimize|optimise|improve|reduce|increase|launch|plan|collaborate|partner|train|handle|monitor|migrate|refactor|deploy|architect|define|prioritize|review|conduct|produce|administer|operate|configure|integrate|research|teach|sell|negotiate|prepare|process|ensure|establish|streamline|spearhead|execute|provide|perform|present|report|resolve|serve|track|guide|supervise|direct|head|grow|scale|ship|cut|save|win|help)$|(ize|ise|ate|ify)$",
    irregular:
      "built led wrote made ran won grew drove sold taught began brought bought chose did found gave held kept left met paid put read rose saw set spoke spent stood took thought told understood became broke cut drew fought got oversaw overtook rebuilt rewrote undertook upheld went",
    jobStop:
      "the and for with you your our are will this that from have has can able work team role job company experience " +
      "knowledge skills skill requirements required preferred plus years year strong good great new using use within across " +
      "about into also more must should would other who what which their they them we us an of to in on or as at by be is " +
      "responsibilities qualifications benefits opportunity candidate ideal ideally bonus nice join looking hiring " +
      "build collaborate develop design ensure maintain create write support participate drive own manage implement deliver " +
      "partner apply bring help junior senior mid trainee intern developer engineer analyst"
  },

  sample: {
    nome: "Mariana Souza",
    cargo: "Back-end Developer",
    email: "mariana.souza@email.com",
    telefone: "+55 48 99999-0000",
    pais: "BR",
    uf: "",
    cidade: "Florianópolis",
    linkedin: "linkedin.com/in/marianasouza",
    site: "github.com/marianasouza",
    resumo:
      "Back-end developer with 5 years of experience in Python and Django, focused on REST APIs, integrations and database performance. Led the migration of a monolith to AWS services and cut average response time by 40%. Looking to join a SaaS product team that works in agile.",
    exp: [
      {
        cargo: "Back-end Developer",
        empresa: "Nuvem Tech",
        local: "Florianópolis, Brazil",
        modalidade: "hibrido",
        inicio: "03/2022",
        fim: "",
        atual: true,
        bullets:
          "Developed REST APIs with Django REST Framework used by 120,000 active users\nReduced average response time by 40% by optimizing PostgreSQL queries and adding Redis caching\nImplemented a CI/CD pipeline with GitHub Actions and Docker, cutting deploy time from 30 to 8 minutes"
      },
      {
        cargo: "Junior Developer",
        empresa: "Agência Pixel",
        local: "",
        modalidade: "remoto",
        inicio: "01/2020",
        fim: "02/2022",
        atual: false,
        bullets:
          "Built payment gateway integrations (Stripe, Pagar.me) in Python\nWrote automated tests with pytest, raising coverage from 35% to 80%"
      }
    ],
    edu: [
      {
        curso: "Bachelor of Science in Computer Science",
        inst: "Federal University of Santa Catarina (UFSC)",
        status: "concluido",
        inicio: "02/2015",
        fim: "12/2019"
      }
    ],
    habilidades:
      "Back-end: Python, Django, Django REST Framework\nDatabases: PostgreSQL, Redis\nInfrastructure: Docker, AWS, CI/CD\nPractices: Git, Automated testing, Scrum",
    idiomas: "Portuguese: native\nEnglish: advanced",
    certificacoes: "AWS Certified Cloud Practitioner (2023)"
  }
};
