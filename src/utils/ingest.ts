import { VectorRepository } from "../vectorRepository";
import { chunkText } from "./chunkText.ts";
import { embed } from "./embed";

export async  function ingest(source: string, 
    text: string, 
    repo: VectorRepository) 
{
    const chunks = chunkText(text);
    
    for (const chunk of chunks) {
        const embedding = await embed(chunk);
        repo.save(source, chunk, embedding);
    }  

    console.log(` ${chunks.length} chunks ingested for source: ${source}`); 
}