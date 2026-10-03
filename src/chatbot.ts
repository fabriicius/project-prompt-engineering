import * as readline from "node:readline/promises";
import * as crypto from "node:crypto";
import { Message } from "./types.ts";
import { streamResponse } from "./utils/streamResponse.ts";
import { ContextWindow } from "./context-window.ts";
import { MessageRepository } from "./messageRepository.ts";
import { maybeCompress } from "./utils/maybeCompress.ts";
import { stitchContext } from "./utils/stitchContext.ts";
import { validateInput } from "./utils/validateInput.ts";
import { validateOutput } from "./utils/validateOutput.ts";

const systemPrompt = process.argv[2];
const windowId = process.argv[3] || crypto.randomUUID();
const rl = readline.createInterface({ input : process.stdin, output : process.stdout });

const history: Message[] = [];
const contextWindow = new ContextWindow();
const messageRepository = new MessageRepository();

const initalMessages = messageRepository.load(windowId);
if (initalMessages.length > 0) {
  console.log(`Restaurando histórico de mensagens para a janela de contexto com ID: ${windowId}`);
  initalMessages.forEach((msg) => {
    contextWindow.restore(msg.role, msg.content);
  });
}

while(true) {
  const userPrompt = await rl.question(
    "Voce (digite sua pergunta ou sair para encerrar): ");
 
  if (userPrompt.toLowerCase() === "sair") {
    console.log(`O id da sua sessão é : ${windowId}`);
    break;
  }
  
  const validationInput  = validateInput(userPrompt, ["senha"  , "pix", "cartao", "cpf", "cnh", "rg", "telefone", "email"]);
  if(!validationInput.isValid) {
    console.log(`Entrada inválida: ${validationInput.errors}`);
    continue;
  }

  messageRepository.save(windowId, contextWindow.addUserMessage(userPrompt));

  const compressed = await maybeCompress(contextWindow)
  const stitchedMessages = stitchContext({recentMessages: compressed});

  process.stdout.write("Gerando resposta do modelo...\n");

  const fullResponse = await streamResponse(
           stitchedMessages, 
           systemPrompt);

   const validationOutput = validateOutput(fullResponse, 
    ["voce deve fazer", "eu acho que voce deveria fazer",
     "voce deve fazer" , "o meu conselho pra voce é"]);
  if(!validationOutput.isValid) {
    console.log(`Saída inválida: ${validationOutput.errors}`);
    continue;
  }

  messageRepository.save(windowId, contextWindow.addAssistantMessage(fullResponse));
}


rl.close();

        
