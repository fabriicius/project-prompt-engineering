import { SyncShare } from "node:stream/iter";
import { openai } from "../client/openia";
import { ContextWindow } from "../context-window";
import { Message } from "../types";
import { generate, generateWithCritique } from "./generateWithCritique";
import { withRetry } from "./withRetry";

async function sumarize(messages: Message[]) 
 : Promise<string> {
    const summaryPrompt = `
        Você é um assistente que resume conversas. 
        Resuma a seguinte conversa em português, destacando os pontos principais e as decisões tomadas:
        Mantenha o resumo conciso, claro e objetivo, sem incluir detalhes irrelevantes
        limite o resumo a 1 parágrafos, e não inclua informações que não estejam na conversa.
    `;

    return await withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: summaryPrompt },
        ...messages
      ],
    });
    return response.choices[0].message?.content ?? "";
  });
}

export { sumarize };