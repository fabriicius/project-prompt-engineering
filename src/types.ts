export type Message = {
    role: "system" | "user" | "assistant";
    content: string;            
}

export type IRepository<T> = {
    save(session: string, data: T): void;
    load(session: string): T[];
}