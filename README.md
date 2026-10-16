# CV Legível

Gerador de currículo que roda direto no navegador. Você preenche um formulário e baixa um PDF pensado para ser lido por **ATS** (Applicant Tracking Systems), os sistemas de triagem automática, e por ferramentas de RH baseadas em IA.

**[▶ Usar online](https://SEU-USUARIO.github.io/cv-legivel/)**

![Tela do CV Legível: formulário à esquerda, checagem ATS e prévia A4 à direita](docs/screenshot.png)

## Por que existe

Grande parte dos currículos passa primeiro por um software antes de chegar a uma pessoa. Layouts com duas colunas, tabelas, ícones ou texto dentro de imagens costumam ser lidos fora de ordem ou simplesmente ignorados. O CV Legível gera um PDF que fica bonito para quem lê e continua fácil de interpretar para quem faz o parsing.

## Funcionalidades

- **Prévia ao vivo** em folha A4, atualizada enquanto você digita.
- **PDF com texto real**, gerado com [jsPDF](https://github.com/parallax/jsPDF). Não é print de tela nem imagem.
- **Checagem ATS em tempo real.** Mostra se o resumo tem tamanho adequado, se as conquistas trazem números e começam com verbo de ação, se as datas estão completas, entre outros pontos.
- **Rascunho salvo automaticamente** no `localStorage`. Nenhum dado sai do seu navegador.
- **Tema claro e escuro**, e layout responsivo.
- **Zero build.** HTML, CSS e JavaScript puros.

## Decisões de formatação para ATS

| Decisão | Motivo |
|---|---|
| Coluna única, sem tabelas nem ícones | Parsers leem de cima para baixo. Colunas lado a lado embaralham a ordem do texto. |
| Títulos de seção padrão ("Experiência profissional", "Formação acadêmica"…) | É assim que os sistemas identificam cada bloco. Títulos criativos não são reconhecidos. |
| Contato no corpo, não em cabeçalho/rodapé | Muitos ATS descartam cabeçalhos e rodapés do PDF. |
| Datas no formato `MM/AAAA – MM/AAAA` | Formato consistente permite calcular o tempo de experiência. |
| Fonte padrão (Helvetica) | Garante a extração correta de acentos e caracteres. |
| Metadados do PDF (título, autor, palavras-chave) | Dá contexto extra para indexação. |
| Nome do arquivo `Nome-Sobrenome-Curriculo.pdf` | Facilita a identificação pelo recrutador. |

Para validar, você pode extrair o texto do PDF gerado (por exemplo com `pdftotext` ou `pypdf`). Ele sai na mesma ordem e com a mesma estrutura da prévia.

## Como rodar localmente

```bash
git clone https://github.com/SEU-USUARIO/cv-legivel.git
cd cv-legivel
python3 -m http.server 8000   # ou abra o index.html direto no navegador
```

Depois acesse `http://localhost:8000`.

## Estrutura

```
cv-legivel/
├── index.html            # marcação do formulário e da prévia
├── assets/
│   ├── css/styles.css    # tokens de cor, tema claro/escuro, layout
│   └── js/app.js         # estado, prévia, checagem ATS e geração do PDF
└── docs/screenshot.png
```

A prévia em HTML e o PDF saem da **mesma função `model()`**. Ela normaliza os dados do formulário em seções, e os dois renderizadores apenas desenham essa estrutura. Assim, o que você vê é o que vai para o PDF.

## Próximos passos

- [ ] Comparar o currículo com a descrição de uma vaga e destacar as palavras-chave ausentes
- [ ] Importar e exportar os dados em JSON
- [ ] Versão em inglês do currículo
- [ ] Mais de um modelo visual, todos compatíveis com ATS
- [ ] Testes automatizados da geração do PDF

## Licença

[MIT](LICENSE)
