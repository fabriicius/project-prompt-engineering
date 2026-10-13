import { openai } from "../client/openia.ts";
import { VectorRepository } from "../vectorRepository.ts";
import { buildRagPrompt } from "./buildRagPrompt.ts";
import { embed } from "./embed.ts";
import { ragAnswer } from "./ragAnswer.ts";

export async function safeRagAnswer(
    question: string,
    repo: VectorRepository,
    blockedSignals: string[]) {

// guarda 1: validar que a pergunta não tente extrair informações fora de escopo
  if (blockedSignals.some(b => question.toLowerCase().includes(b.toLowerCase()))) {
    return "I dont awnsoer that. I am not allowed to provide information about that topic."
  }

  const questionEmbeddings = await embed(question)
  const results = repo.load(
    question,
    questionEmbeddings
  )

  // guarda 2: verifiar se há contexto minimamente relevante antes de chamar o LLM
  if (results.length === 0) {
    return "I dont know."
  }

  return ragAnswer(question, repo)
}