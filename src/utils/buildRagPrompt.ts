import { RagExample } from "../types";


export function buildRagPrompt(
     question: string , 
     chunks: string[],
     examples?: RagExample[] 
    )
     {
        const context = chunks.join("\n\n--\n\n");
        const fewShot = examples?.map(
            ex => `Question: ${ex.q}\nAnswer: ${ex.a}`
           ).join("\n\n") ?? ""

        return `
        [Instructions]
        Reply to the first question using only the provided context.
        First, reason about the main subject and its context.
        Second, generate the final answer.
        If the answer cannot be found in the context, say: "I don't know."
        
        ${fewShot ? `[Exemples]\n\n${fewShot}\n\n` : ""}

        [Context]
        ${context}

        [Question]
        ${question}
        `
     }