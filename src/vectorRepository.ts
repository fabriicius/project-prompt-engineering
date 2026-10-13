import { DatabaseSync } from "node:sqlite";
import { cosineSimilarity } from "./utils/cosineSimilarity";
import { hybridScore } from "./utils/hybridScore";
import { keywordScore } from "./utils/keywordScore";

export class VectorRepository {
    private db : DatabaseSync;

    constructor(db = "vector_db.db") {
        this.db = new DatabaseSync("vector_db.db");
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                source TEXT NOT NULL,
                chunk TEXT NOT NULL,
                embedding TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    save(source: string, chunk: string, embeddings: number[]): void {
        this.db.prepare(`
            INSERT INTO documents (source, chunk, embedding)
            VALUES (?, ?, ?);
        `).run(source, chunk, JSON.stringify(embeddings));
    }

    load(input:string , inputEmbedding: number[], topK =5  , minScore = 0.7) 
    { 
        const documts = this.db.prepare(`
            SELECT source, chunk, embedding FROM documents;
        `).all() as {chunk : string , embedding : string} [] 


        return documts.map(doc => ({ 
            chunk: doc.chunk,
            score: hybridScore(cosineSimilarity(inputEmbedding, JSON.parse(doc.embedding)), 
            keywordScore(input, doc.chunk)) 
        })).filter(doc => doc.score >= minScore).sort((d1, d2) => d2.score - d1.score)
        .slice( 0, topK) 
    }
}