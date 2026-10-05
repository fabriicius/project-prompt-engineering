import { openai } from "../client/openia.ts";
import { VectorRepository } from "../vectorRepository";
import { buildRagPrompt } from "./buildRagPrompt";
import { embed } from "./embed";

export async function ragAnswer(
    question: string,
    repo: VectorRepository) {

  // 1. embeds the question
   const questionEmbedding = await embed(question);

  // 2. retrieves the most relevant chunks from the vector repository
  const result  = await repo.load(questionEmbedding);
  const chunks = result.map((r: any) => r.chunk);

  // 3. builds a prompt with the question and the retrieved chunks
  const prompt = buildRagPrompt(question, chunks);

  // 4. sends the prompt to the LLM and returns the answer
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{role: "system", content: prompt}]
  })

     return response.choices[0].message?.content ?? "I don't know." ; 
}