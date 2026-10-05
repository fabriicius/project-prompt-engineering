import { DatabaseSync } from "node:sqlite";
import { Message } from "./types.ts";

export class MessageRepository {
    private db : DatabaseSync;
    constructor() {
        this.db = new DatabaseSync("project_ia.db");
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session TEXT NOT NULL,
                role TEXT NOT NULL,
                content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
    }

    save(windowId: string, data: Message): void {
        this.db.prepare(`
            INSERT INTO messages (session, role, content)
            VALUES (?, ?, ?);
        `).run(windowId, data.role , data.content);
    }

    load(windowId: string): Message[] {

        const rows = this.db.prepare(`
            SELECT role, content FROM messages
            WHERE session = ?
            ORDER BY created_at ASC;
        `).all(windowId);

        return rows.map((row: any) => ({
            role : row.role,
            content : row.content
        }) as Message);
    }
} 