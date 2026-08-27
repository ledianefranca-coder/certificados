# Certifica IET

Sistema web para cadastrar alunos e gerar certificados institucionais, individualmente ou em lote, a partir de uma planilha Excel.

O projeto foi desenvolvido para o Instituto de Economia e Finanças do Exército (IET) e utiliza o modelo institucional do curso **Condutores de Veículos de Transporte de Emergência**, mantendo as informações fixas do certificado e preenchendo automaticamente os dados variáveis de cada aluno.

## Problema que o projeto resolve

A produção manual de muitos certificados exige a repetição do mesmo trabalho e aumenta o risco de:

- erros de digitação ou transcrição;
- divergências entre certificados;
- documentos com campos obrigatórios ausentes;
- demora para cadastrar, revisar e emitir cada certificado;
- dificuldade para padronizar o layout institucional.

O Certifica IET reúne essas etapas em um único fluxo, valida os principais campos e gera documentos padronizados em PDF.

## Principais funcionalidades

- Cadastro manual de alunos.
- Importação em lote por planilha Excel (.xlsx, .xls) ou CSV.
- Download de uma planilha-modelo para preenchimento.
- Validação de CPF e registro da CNH com exatamente 11 dígitos.
- Preparação e geração individual ou em lote.
- Certificado institucional em PDF, com frente e verso.
- QR Code e código exclusivo para consulta de autenticidade.
- Conteúdo programático no verso.
- Pré-visualização antes da emissão.
- Layout com identidade visual institucional, brasões e marca-d'água da bandeira.

## Como funciona

1. O operador baixa a planilha-modelo ou cadastra um aluno manualmente.
2. Preenche os dados variáveis de cada participante.
3. Importa a planilha no sistema.
4. O sistema confere os campos obrigatórios e indica linhas com erro.
5. Os alunos válidos são adicionados à lista.
6. O operador revisa a prévia e gera os certificados.
7. Cada PDF é emitido com dados do aluno, código exclusivo, conteúdo programático e QR Code.

## Dados do certificado

### Informações institucionais fixas

- Instituição emissora.
- Nome do curso.
- Texto institucional e regulamentação.
- Identidade visual.
- Conteúdo programático.

### Informações variáveis

| Campo | Descrição |
|---|---|
| Código | Número identificador do certificado |
| Ano | Ano do registro |
| Nome | Nome completo do aluno |
| CPF | CPF com 11 dígitos |
| Registro CNH | Registro com 11 dígitos |
| Categoria | Categoria da habilitação |
| Data inicial | Início do curso |
| Data final | Término do curso |
| Carga horária | Duração total do curso |
| Data de emissão | Data registrada no certificado |

## Importação por Excel

Use o botão **Baixar modelo Excel** no cadastro de alunos. Preencha uma linha por participante e preserve os títulos das colunas. Depois, selecione **Importar Excel/CSV**.

O sistema aceita datas reconhecidas pelo Excel e também textos de data. Antes de incluir os registros, ele apresenta a quantidade de linhas válidas e descreve os erros encontrados.

## Tecnologias

- React
- TypeScript
- Vite
- Tailwind CSS
- jsPDF
- SheetJS (xlsx)
- QRCode
- Lucide React

## Executar localmente

Requisitos: Node.js 18 ou superior e npm.

    git clone https://github.com/ledianefranca-coder/certificados.git
    cd certificados
    npm install
    npm run dev

Para validar a versão de produção:

    npm run lint
    npm run build

## Estrutura principal

    src/
    ├── components/          # Telas, formulários e prévia
    ├── utils/               # PDF, QR Code, privacidade e recursos visuais
    ├── assets/images/       # Imagens institucionais
    ├── App.tsx              # Estado e navegação principal
    └── types.ts             # Tipos de dados

## Privacidade e limitação atual

Esta versão é um protótipo acadêmico e não possui banco de dados central. Os registros são mantidos no armazenamento local do navegador utilizado. Por isso, uma consulta aberta em outro dispositivo ou navegador não recupera automaticamente os certificados emitidos.

Para uso institucional em produção, a evolução recomendada é integrar autenticação, banco de dados protegido, controle de acesso, trilha de auditoria e validação pública no servidor.

## Próximas evoluções

- Banco de dados central para consulta pública.
- Login e perfis de acesso.
- Assinatura digital dos responsáveis.
- Histórico de emissões e auditoria.
- Importação de novas turmas e cursos.
- Painel institucional de acompanhamento.

## Referência

O modelo e os campos variáveis foram definidos a partir do certificado institucional fornecido para o projeto.
