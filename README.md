# CV Legível

[![CI](https://github.com/DutraGabriel/cv-legivel/actions/workflows/ci.yml/badge.svg)](https://github.com/DutraGabriel/cv-legivel/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
![Sem build](https://img.shields.io/badge/build-nenhum-success)
![Dados](https://img.shields.io/badge/dados-ficam%20no%20navegador-informational)

Gerador de currículo que roda inteiro no navegador. Você preenche um formulário e baixa um PDF que **sistemas de triagem (ATS) e leitores de RH com IA conseguem ler sem perder informação**: coluna única, texto real, títulos padrão.

**[▶ Usar online](https://dutragabriel.github.io/cv-legivel/)** · [English](https://dutragabriel.github.io/cv-legivel/en/) · [Español](https://dutragabriel.github.io/cv-legivel/es/) · grátis, sem cadastro, funciona offline

![Tela do CV Legível: formulário à esquerda; privacidade, checagem ATS, comparação com a vaga e prévia A4 à direita](docs/screenshot.png)

## Destaques técnicos

- **Zero build, zero framework.** HTML, CSS e JavaScript modular (ES modules) servidos direto pelo GitHub Pages.
- **O que você vê é o que sai no PDF.** Uma única função, `model()`, transforma o formulário na estrutura do currículo; a prévia HTML e o gerador de PDF só desenham essa estrutura.
- **Testado onde importa.** Os testes de ponta a ponta geram o PDF num navegador real, **extraem o texto do arquivo** com pdf.js e conferem a ordem das seções, os links e os acentos, exatamente o que um ATS faz.
- **Privacidade e segurança por padrão.** Nenhum dado sai do navegador, todas as bibliotecas e fontes são servidas pelo próprio site e uma Content-Security-Policy bloqueia scripts de qualquer outra origem.

## O que ele faz

### Para montar o currículo

- Prévia ao vivo em folha A4, com a mesma proporção do PDF.
- Exemplos e um bloco **"Como preencher"** em cada seção, com exemplos ✔ bons e ✘ ruins.
- Máscaras enquanto digita (telefone `(48) 99618-7500`, datas `MM/AAAA`), UF e cidade com os municípios do IBGE, local e modalidade (presencial, híbrido, remoto), situação da formação e opção de mostrar a formação antes da experiência.
- Restrições e validações por campo, com mensagens logo abaixo do campo: nome sem números nem símbolos, e-mail e LinkedIn válidos (inclusive `es.linkedin.com`), fim da experiência não pode ser antes do início etc. Acentos colados de PDF ou do Mac são preservados.

### Para passar na triagem

- **Checagem ATS em tempo real**: tamanho do resumo, conquistas com números e verbos de ação (no passado; no emprego atual, o presente também vale, como é costume em inglês), datas completas e mais.
- **Comparar com uma vaga**: cole a descrição (em português, inglês ou espanhol) e veja quais termos técnicos dela faltam no seu currículo.
- **Ver como o ATS lê**: mostra o texto extraído do PDF gerado, na ordem em que um sistema de triagem o lê.
- **Site completo em português, inglês e espanhol**: três páginas (`/`, `/en/` e `/es/`) com interface, ajuda, mensagens, checagem, exemplo e currículo no idioma escolhido. Cada idioma guarda o seu próprio rascunho; ao abrir um idioma pela primeira vez, o site oferece copiar os dados de outro para você só traduzir. Quem usa o navegador em outro desses idiomas vê um aviso, no idioma do navegador, com o link para a página certa; depois de escolher, a raiz do site abre direto no idioma escolhido. Não há redirecionamento automático sem escolha, para cada página ser indexada no seu idioma pelos buscadores. Importar um arquivo exportado em outro idioma adapta telefone e país.
- **Local e telefone por país**: em português, UF e cidade do IBGE com telefone brasileiro; em inglês e espanhol, país (lista com os nomes no idioma da página), cidade livre e telefone internacional.
- PDF com **links clicáveis** (e-mail, LinkedIn, portfólio), idioma e metadados definidos, e fonte Unicode embutida automaticamente quando o nome tem letras como `ł`, `ş` ou cirílico.

### Para os seus dados

- Rascunho salvo automaticamente no navegador; **exportar/importar em JSON** para levar a outro computador.
- **Limpar tudo** apaga o formulário e a cópia salva (útil em computador compartilhado).
- Instalável como app (PWA, com nome e descrição no idioma da página) e **funciona offline** depois do primeiro acesso.
- Tema claro e escuro, layout para celular, tablet e telas largas, navegação completa por teclado e verificação automática de acessibilidade (WCAG 2.1 AA) nos testes.

## Privacidade e segurança

| Ponto | Como é tratado |
| --- | --- |
| Dados do currículo | Ficam só no `localStorage` do navegador. Não há servidor, banco, cadastro nem analytics. |
| Terceiros | Nenhuma CDN ou Google Fonts: jsPDF, pdf.js e as fontes são servidos pelo próprio site. A única chamada externa é a API do IBGE, que recebe só a sigla da UF. |
| XSS | Todo texto digitado passa por `esc()` antes de ir para o HTML; a CSP (`script-src 'self'`) bloqueia scripts inline e de outras origens. |
| Rascunho corrompido | `normalize()` valida o formato do que foi salvo; um rascunho quebrado nunca trava o site. |
| Dependências | `npm audit` no CI e Dependabot semanal. |

## Decisões de formatação para ATS

| Decisão | Motivo |
| --- | --- |
| Coluna única, sem tabelas nem ícones | Parsers leem de cima para baixo; colunas lado a lado embaralham a ordem do texto. |
| Títulos de seção padrão ("Experiência profissional", "Formação acadêmica"…) | É assim que os sistemas identificam cada bloco. Títulos criativos não são reconhecidos. |
| Contato no corpo, não em cabeçalho/rodapé | Muitos ATS descartam cabeçalhos e rodapés do PDF. |
| Datas no formato `MM/AAAA – MM/AAAA` | Formato consistente permite calcular o tempo de experiência. |
| Helvetica, com Arimo embutida quando preciso | A Helvetica padrão do PDF cobre o português e o alfabeto latino ocidental. Para outros caracteres o site embute a Arimo, que tem as mesmas medidas, então o layout não muda. |
| Texto contínuo por trecho de estilo | Palavras de mesmo estilo saem num único bloco de texto, para a extração não quebrar palavras. |
| Metadados e idioma do PDF | Dão contexto extra para indexação e leitores de tela. |

## Como rodar localmente

Requer [Node.js](https://nodejs.org/) 20 ou mais recente.

```bash
git clone https://github.com/DutraGabriel/cv-legivel.git
cd cv-legivel
npm install
npm start          # abre em http://localhost:8000
```

> O `index.html` não abre com duplo clique: o navegador bloqueia módulos JavaScript em `file://`. Use `npm start` ou qualquer servidor estático (`python3 -m http.server 8000`).

| Comando | O que faz |
| --- | --- |
| `npm run lint` | ESLint no JavaScript e html-validate no HTML |
| `npm run format` | Formata o código com Prettier |
| `npm test` | Testes unitários (`node --test`, sem dependências) |
| `npm run test:e2e` | Testes de ponta a ponta com Playwright (usa o Chrome instalado) |
| `npm run pages` | Gera as três páginas (`index.html`, `en/index.html`, `es/index.html`) e os manifestos do app a partir do modelo e dos textos |
| `npm run screenshots` | Regera as imagens de divulgação (uma por idioma) e o print do README (usa o Chrome instalado) |
| `npm run vendor` | Copia jsPDF, pdf.js e fontes de `node_modules` para `assets/vendor/` |

Não há variáveis de ambiente nem segredos.

## Testes e integração contínua

| Camada | O que cobre | Ferramenta |
| --- | --- | --- |
| Unitários (54) | Máscaras e datas, validação e migração do rascunho, modelo do currículo, checagem ATS, comparação com a vaga, regras dos campos, **traduções (mesmas chaves nos três idiomas, nenhum texto vazio, plural)**, regras por idioma (acentos, nomes e cursos em inglês, LinkedIn com prefixo de país, verbos no passado e no presente, palavras comuns da vaga em espanhol), rascunho por idioma, cópia e importação entre idiomas e consistência do projeto (páginas e manifestos em dia com o modelo, versões em `assets/vendor`, lista offline do `sw.js`, CSP) | `node --test` |
| Ponta a ponta (21) | Abre o site num navegador real, preenche o formulário, **gera o PDF e confere o texto extraído dele** (ordem das seções, links, fonte Unicode), páginas em inglês e espanhol, aviso de idioma do navegador, cópia do rascunho e importação entre idiomas, validações, exportar/importar, rascunho corrompido, abas no celular e **acessibilidade (axe, WCAG 2.1 AA) nas três páginas, nos dois temas** | Playwright + pdf.js + axe-core |

O [CI no GitHub Actions](.github/workflows/ci.yml) roda em todo push e pull request na `main` e na `develop`, em dois jobs:

1. **Lint, formatação e testes unitários**: ESLint, html-validate, Prettier, `npm test` e `npm audit`.
2. **Testes de ponta a ponta**: instala o Chromium e roda o Playwright; em caso de falha, guarda o relatório como artefato.

Usa Node.js 24 e `ubuntu-24.04` fixo, para o ambiente não mudar sem aviso. Também dá para rodar manualmente em **Actions → CI → Run workflow**. O Dependabot abre PRs semanais para as dependências npm e mensais para as actions.

## Fluxo de desenvolvimento

- O trabalho acontece na branch `develop`; a `main` recebe as mudanças por merge e é a branch publicada no GitHub Pages.
- Commits seguem o [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat:`, `fix:`, `docs:`, `ci:`…).
- Antes de enviar, `npm run check` roda lint, formatação e testes unitários; `npm run test:e2e` roda os testes no navegador.

## Estrutura

```text
cv-legivel/
├── index.html                 página em português  ┐
├── en/index.html              página em inglês     ├ geradas por `npm run pages` (com os manifestos), não edite
├── es/index.html              página em espanhol   ┘
├── templates/index.html       modelo das três páginas (marcação, CSP e meta tags)
├── sw.js                      service worker (modo offline)
├── assets/
│   ├── css/                   estilos e fontes
│   ├── js/
│   │   ├── boot.js            antes da pintura: tema salvo e idioma escolhido
│   │   ├── main.js            ponto de entrada: liga os módulos
│   │   ├── state.js           formato, exemplo, validação e migração do rascunho
│   │   ├── model.js           formulário → estrutura do currículo (usada pela prévia e pelo PDF)
│   │   ├── pdf.js             geração do PDF (jsPDF carregado sob demanda)
│   │   ├── checks.js          checagem ATS
│   │   ├── jobmatch.js        comparação com a vaga
│   │   ├── rules.js           restrições e validações
│   │   ├── format.js          máscaras e utilitários puros
│   │   ├── i18n/              textos e regras de cada idioma (pt.js, en.js, es.js), t() com plural, países
│   │   ├── options.js         opções neutras salvas no rascunho (modalidade, situação)
│   │   └── ui/                módulos que mexem na página (formulário, prévia, ferramentas…)
│   └── vendor/                bibliotecas e fontes de terceiros (geradas por `npm run vendor`)
├── tests/
│   ├── unit/                  funções puras, estado, consistência do projeto
│   └── e2e/                   navegador real + extração do texto do PDF
├── docs/                      print do README e imagens de divulgação (geradas por `npm run screenshots`)
└── scripts/                   pages.mjs (páginas e manifestos), screenshots.mjs (imagens) e vendor.mjs (dependências)
```

Os módulos da raiz de `assets/js/` são **puros** (não tocam no DOM) e por isso são testados direto no Node; os de `ui/` cuidam da página.

### Adicionando ou mudando textos

Todos os textos ficam em `assets/js/i18n/pt.js`, `en.js` e `es.js`, com as mesmas chaves (um teste confere). Textos com quantidade usam `{ one, other }` e a forma certa é escolhida com `Intl.PluralRules`. Cada arquivo também tem `rules`: terminações de verbo no passado e no presente, verbos irregulares e palavras comuns em vagas. Depois de mudar um texto ou o `templates/index.html`, rode `npm run pages` e faça commit dos arquivos gerados; um teste falha se eles estiverem desatualizados.

Para **acrescentar um idioma**: crie o arquivo em `assets/js/i18n/` com as mesmas chaves, registre-o em `i18n/index.js` (`DICTS`, `LANGS` e `LANG_PATH`), acrescente as novas páginas à lista do `sw.js` e rode `npm run pages` e `npm run screenshots`.

### Atualizando as bibliotecas

O site não tem etapa de build, então as bibliotecas usadas no navegador ficam versionadas em `assets/vendor/`. Ao atualizar uma delas (por exemplo, num PR do Dependabot), rode `npm run vendor` e faça commit da pasta. Um teste unitário falha se os arquivos copiados não forem da versão do `package.json`.

## Limitações conhecidas

- O conteúdo que você digita não é traduzido automaticamente: cada idioma tem o seu rascunho, e a cópia entre idiomas traz o texto para você traduzir.
- A comparação com a vaga é uma heurística (termos técnicos, siglas e palavras repetidas), não uma IA: serve como lembrete, não como nota oficial.
- A checagem de verbos é por terminação e lista de irregulares: no emprego atual, um substantivo terminado como o presente ("Desarrollo de APIs" em espanhol) também é aceito.
- Árabe, hindi, chinês e outras escritas não latinas/cirílicas não são suportadas no PDF.
- A lista de cidades depende da API do IBGE (precisa de internet no primeiro uso de cada UF).
- Antivírus que inspecionam páginas HTTPS (como o Kaspersky) podem injetar código e alterar a Content-Security-Policy. A política do site termina com `;` para continuar válida mesmo assim, mas, se algo não carregar, teste com essa proteção desativada.

## Próximos passos

- [ ] Mais de um modelo visual, todos compatíveis com ATS
- [ ] Sugestões de verbos de ação ao escrever as conquistas

## Licença

[MIT](LICENSE) © Gabriel Dutra
