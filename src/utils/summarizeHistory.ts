import { openai } from "../client/openia";
import { ContextWindow } from "../context-window";
import { generate, generateWithCritique } from "./generateWithCritique";
import { withRetry } from "./withRetry";

async function sumarize(contextWindow: ContextWindow) 
 : Promise<string> {
    const summaryPrompt = `
        Você é um assistente que resume conversas. 
        Resuma a seguinte conversa em português, destacando os pontos principais e as decisões tomadas:
        Mantenha o resumo conciso, claro e objetivo, sem incluir detalhes irrelevantes
        limite o resumo a 1 parágrafos, e não inclua informações que não estejam na conversa.
    `;

    const summary = await generate(summaryPrompt, contextWindow);
      
    return summary;
}

export { sumarize };