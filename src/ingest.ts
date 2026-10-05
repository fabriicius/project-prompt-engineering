import { readFileSync } from "node:fs"
import { VectorRepository } from "./vectorRepository.js"
import { ingest } from "./utils/ingest.js";

const vectorRepository = new VectorRepository();

const source1 = "docs/policy-vacation.txt";
const source2 = "docs/policy-new-year.txt";


const doc1 = readFileSync(source1, "utf-8");
const doc2 = readFileSync(source2, "utf-8");

await ingest(source1, doc1, vectorRepository);
await ingest(source2, doc2, vectorRepository); 
