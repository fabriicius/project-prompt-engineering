import { VectorRepository } from "../vectorRepository.ts";
import { embed } from "./embed.ts";

const MAX_CHUNKS = 150

export async function ragDebug(
  question: string,
  repo: VectorRepository
) {
  const questionEmbeddings = await embed(question)
  const results = repo.load(question, questionEmbeddings)

  console.log("\n---------- Chunks recuperados ----------")
  results.forEach((r, i) => {
    console.log(`\n[${i + 1}] Score: ${r.score.toFixed(2)}`)
    console.log(`${r.chunk.slice(0, MAX_CHUNKS)}${r.chunk.length > MAX_CHUNKS ? "..." : ""}`)
  })
}
