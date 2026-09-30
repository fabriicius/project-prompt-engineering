import * as readline from "node:readline/promises";
import { Message } from "./types.ts";
import { streamResponse } from "./utils/streamResponse.ts";

const systemPrompt = process.argv[2];

const rl = readline.createInterface({ 
    input : process.stdin, 
    output : process.stdout 
 });

 const history: Message[] = [];

while(true) {
  const userPrompt = await rl.question(
    "Voce (digite sua pergunta ou sair para encerrar): ");
  if (userPrompt.toLowerCase() === "sair") {
    break;
  }

  history.push({ role: "user", content: userPrompt });
  process.stdout.write("Gerando resposta do modelo...\n");

  const fullResponse = await streamResponse(history, systemPrompt);
  history.push({ role: "assistant", content: fullResponse });
    
  rl.close();
}


    