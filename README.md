# CV Legível

[![CI](https://github.com/DutraGabriel/cv-legivel/actions/workflows/ci.yml/badge.svg)](https://github.com/DutraGabriel/cv-legivel/actions/workflows/ci.yml)
[![Licença: MIT](https://img.shields.io/badge/licen%C3%A7a-MIT-blue.svg)](LICENSE)
![Sem build](https://img.shields.io/badge/build-nenhum-success)
![Dados](https://img.shields.io/badge/dados-ficam%20no%20navegador-informational)

Gerador de currículo que roda inteiro no navegador. Você preenche um formulário e baixa um PDF que **sistemas de triagem (ATS) e leitores de RH com IA conseguem ler sem perder informação**: coluna única, texto real, títulos padrão.

**[▶ Usar online](https://dutragabriel.github.io/cv-legivel/)** · grátis, sem cadastro, funciona offline

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
- Restrições e validações por campo, com mensagens logo abaixo do campo: nome só com letras, e-mail e LinkedIn válidos, fim da experiência não pode ser antes do início etc.

### Para passar na triagem

- **Checagem ATS em tempo real**: tamanho do resumo, conquistas com números e verbos de ação, datas completas e mais.
- **Comparar com uma vaga**: cole a descrição e veja quais termos técnicos dela faltam no seu currículo.
- **Ver como o ATS lê**: mostra o texto extraído do PDF gerado, na ordem em que um sistema de triagem o lê.
- **Currículo em português, inglês ou espanhol** (títulos, "Atual"/"Present", modalidade, nome do arquivo).
- PDF com **links clicáveis** (e-mail, LinkedIn, portfólio), idioma e metadados definidos, e fonte Unicode embutida automaticamente quando o nome tem letras como `ł`, `ş` ou cirílico.

### Para os seus dados

- Rascunho salvo automaticamente no navegador; **exportar/importar em JSON** para levar a outro computador.
- **Limpar tudo** apaga o formulário e a cópia salva (útil em computador compartilhado).
- Instalável como app (PWA) e **funciona offline** depois do primeiro acesso.
- Tema claro e escuro, layout para celular, tablet e telas largas, navegação completa por teclado.

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
| `npm run vendor` | Copia jsPDF, pdf.js e fontes de `node_modules` para `assets/vendor/` |

Não há variáveis de ambiente nem segredos.

## Estrutura

```text
cv-legivel/
├── index.html                 marcação, CSP e meta tags
├── sw.js                      service worker (modo offline)
├── assets/
│   ├── css/                   estilos e fontes
│   ├── js/
│   │   ├── main.js            ponto de entrada: liga os módulos
│   │   ├── state.js           formato, exemplo, validação e migração do rascunho
│   │   ├── model.js           formulário → estrutura do currículo (usada pela prévia e pelo PDF)
│   │   ├── pdf.js             geração do PDF (jsPDF carregado sob demanda)
│   │   ├── checks.js          checagem ATS
│   │   ├── jobmatch.js        comparação com a vaga
│   │   ├── rules.js           restrições e validações
│   │   ├── format.js          máscaras e utilitários puros
│   │   ├── cv-i18n.js         textos do currículo em PT, EN e ES
│   │   └── ui/                módulos que mexem na página (formulário, prévia, ferramentas…)
│   └── vendor/                bibliotecas e fontes de terceiros (geradas por `npm run vendor`)
├── tests/
│   ├── unit/                  funções puras, estado, consistência do projeto
│   └── e2e/                   navegador real + extração do texto do PDF
└── scripts/vendor.mjs
```

Os módulos da raiz de `assets/js/` são **puros** (não tocam no DOM) e por isso são testados direto no Node; os de `ui/` cuidam da página.

### Atualizando dependências

O site não tem etapa de build, então as bibliotecas usadas no navegador ficam versionadas em `assets/vendor/`. Ao atualizar uma delas (por exemplo, num PR do Dependabot), rode `npm run vendor` e faça commit da pasta. Um teste unitário falha se os arquivos copiados não forem da versão do `package.json`.

## Limitações conhecidas

- A interface está em português; o idioma escolhido muda só o currículo gerado.
- A comparação com a vaga é uma heurística (termos técnicos, siglas e palavras repetidas), não uma IA: serve como lembrete, não como nota oficial.
- Árabe, hindi, chinês e outras escritas não latinas/cirílicas não são suportadas no PDF.
- A lista de cidades depende da API do IBGE (precisa de internet no primeiro uso de cada UF).

## Próximos passos

- [ ] Interface traduzida (além do currículo)
- [ ] Mais de um modelo visual, todos compatíveis com ATS
- [ ] Sugestões de verbos de ação ao escrever as conquistas

## Licença

[MIT](LICENSE) © Gabriel Dutra
