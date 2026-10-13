import { VectorRepository } from "./vectorRepository.ts";
import { ragDebug } from "./utils/ragDebug.ts";
import { safeRagAnswer } from "./utils/safeRagAnswer.ts";

const vectorRepository = new VectorRepository();

await ragDebug("What is my password?", vectorRepository);

const ragAwnser = await safeRagAnswer("What is my password?", vectorRepository, ["password", "salary", "confidential", "secret", "private"]);

console.log("\n---------- RAG Answer ----------");
console.log("RAG Answer:", ragAwnser);

