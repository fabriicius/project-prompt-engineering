import { History } from "../types.ts";
import { openai } from "../client/openia.ts";


export async function streamResponse(history: History[], systemContent?: string): Promise<string> {
    let fullResponse = "";

    const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [ 
        {
            role : "system", 
            content: systemContent || "Você é um assistente útil e prestativo."
        }, 
        ...history],
    stream: true,
   });


    for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      process.stdout.write(delta);
      fullResponse += delta;
    }
  }

  console.log("\n")
  return fullResponse;

}
