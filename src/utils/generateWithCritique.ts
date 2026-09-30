import {  openai } from "../client/openia.ts"
import {  ContextWindow } from "../context-window.ts";
import { withRetry } from "./withRetry.ts";


//essa funcao será uma normal pois a critique consome muitos tokens 
export async function generate(
  system: string,
  prompt : ContextWindow,
): Promise<string> {
  
    return await withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        ...prompt.getMessages()
      ],
    });
    return response.choices[0].message?.content ?? "";
  });

};


// esta função é uma tecnica de prompt chaining, onde a resposta inicial é gerada, depois uma crítica é feita sobre essa resposta, e finalmente uma nova resposta é gerada com base na crítica recebida. Isso ajuda a melhorar a qualidade da resposta final.
export async function generateWithCritique(
  system: string,
  prompt : ContextWindow,
): Promise<string> {
  // Step 1: Generate initial response
  const draft = await withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        ...prompt.getMessages()
      ],
    });
    return response.choices[0].message?.content ?? "";
  });

  // Step 2: Generate critique
  const critique = await withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Identifique em 1 frase pontos de melhorias e críticas na resposta. Se estiver boa diga somente "approved", se não diga o que pode/deve ser melhorado baseado na sua análise e críticas.` },
        { role: "user", content: draft },
      ],
    });
    return response.choices[0].message?.content ?? "";
  });

  // Step 3: Generate final response based on critique
  if (critique.toLowerCase() === "approved") {
    return draft;
  }

  return await withRetry(async () => {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: `Reescreva a resposta anterior considerando as críticas e/ou melhorias recebidas.` },
        { role: "user", content: `Resposta anterior: ${draft}\n\nCríticas/Melhorias: ${critique}` },
      ],
    });
    return response.choices[0].message?.content ?? "";
  });
}
