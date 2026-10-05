import {embed} from "./utils/embed.ts";
import {cosineSimilarity} from "./utils/cosineSimilarity.ts";
import { VectorRepository } from "./vectorRepository.ts";

const vectorRepository = new VectorRepository(":memory:");

const doc1 = "The quick brown fox jumps over the lazy dog.";
const doc2 = "A fast, dark-colored fox leaps over a sleepy canine.";
const doc3 = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

vectorRepository.save("faq", doc1, await embed(doc1));
vectorRepository.save("faq", doc2, await embed(doc2));
vectorRepository.save("faq", doc3, await embed(doc3));

const input = await embed("A swift fox jumps over a tired dog.");
const results = vectorRepository.load(input);

results.forEach((result, index) => {
  console.log('-------------------------');
  console.log(`Score: ${result.score.toFixed(2)} Chunk: ${result.chunk}`);
  console.log('-------------------------');
});
