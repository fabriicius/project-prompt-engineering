# Coders University - Pós IA - Módulo 3 - Prompt Engineering

Projeto de estudo sobre engenharia de prompt e construção de agentes conversacionais com a API da OpenAI. O repositório evolui ao longo do módulo explorando técnicas como prompt templates, self-critique, gerenciamento de contexto e persistência de memória entre sessões.

## Funcionalidades

- **Chat interativo via terminal** (`src/chatbot.ts`): loop de pergunta/resposta com streaming da resposta do modelo.
- **Personas com prompt templates** (`src/index.ts`): exemplos de prompts especializados (jurídico, médico, engenheiro) aplicados a um estudo de caso de contrato.
- **Prompt chaining com autocrítica** (`src/utils/generateWithCritique.ts`): gera uma resposta, critica a própria resposta e a reescreve quando necessário.
- **Janela de contexto** (`src/context-window.ts`): mantém o histórico de mensagens da conversa com limite deslizante de mensagens.
- **Persistência de sessão em SQLite** (`src/messageRepository.ts`): salva e recupera o histórico de cada sessão (`windowId`) em `project_ia.db`, permitindo retomar conversas.
- **Compressão automática de contexto** (`src/utils/maybeCompress.ts`): quando o número estimado de tokens ultrapassa o limite, resume as mensagens mais antigas e mantém apenas as recentes.
- **Stitching de contexto** (`src/utils/stitchContext.ts`): combina resumo, perfil do usuário e mensagens recentes antes de enviar ao modelo.
- **Validação de entrada e saída** (`src/utils/validateInput.ts`, `src/utils/validateOutput.ts`): bloqueia dados sensíveis na entrada (CPF, senha, cartão, etc.) e sinais de alucinação na saída.
- **Retry com backoff exponencial** (`src/utils/withRetry.ts`): repete chamadas à API da OpenAI em caso de erros transitórios (rate limit, erros 5xx, timeout).

## Estrutura do projeto

```
src/
  chatbot.ts               # Chat interativo via terminal
  index.ts                 # Exemplos de prompt templates com personas
  context-window.ts        # Gerenciamento da janela de contexto da conversa
  messageRepository.ts     # Persistência de mensagens em SQLite
  types.ts                 # Tipos compartilhados (Message, IRepository)
  client/openia.ts         # Cliente da API da OpenAI
  utils/
    generateWithCritique.ts  # Geração de resposta com e sem autocrítica
    summarizeHistory.ts       # Resumo de histórico de conversa
    maybeCompress.ts          # Compressão condicional do contexto
    stitchContext.ts          # Combinação de resumo + perfil + mensagens
    estimatetokens.ts         # Estimativa simples de tokens
    validateInput.ts          # Validação/bloqueio de entradas sensíveis
    validateOutput.ts         # Validação de sinais de alucinação na saída
    streamResponse.ts         # Streaming da resposta do modelo
    withRetry.ts               # Retry com backoff exponencial
```

## Pré-requisitos

- Node.js 20+ (uso de `node:sqlite`, API nativa ainda em flag experimental em algumas versões)
- Uma chave de API da OpenAI

## Configuração

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Crie o arquivo de variáveis de ambiente a partir do exemplo:
   ```bash
   npm run env:setup
   ```
3. Edite `.env.local` e informe sua chave:
   ```
   OPENAI_API_KEY=sua-chave-aqui
   ```

## Uso

Executar o exemplo de personas (`src/index.ts`):

```bash
npm start
```

Executar o chat interativo (`src/chatbot.ts`), passando opcionalmente um prompt de sistema e um ID de sessão para retomar uma conversa salva:

```bash
npx tsx --env-file=.env.local src/chatbot.ts "Você é um assistente útil e responda em português." <windowId>
```

No VS Code, também é possível usar a configuração de debug **"Depurar arquivo atual"** (tecla F5) definida em `.vscode/launch.json`.

Cada sessão é identificada por um `windowId` (gerado automaticamente ou informado por você). Ao digitar `sair` no chat, o ID da sessão é exibido no terminal para ser reutilizado depois.

## Persistência

As mensagens de cada sessão são armazenadas em `project_ia.db` (SQLite, ignorado pelo Git). Ao reiniciar com o mesmo `windowId`, o histórico é restaurado automaticamente na janela de contexto.
