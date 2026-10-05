export type Message = {
    role: "system" | "user" | "assistant";
    content: string;            
}

export type RagExample = {
    q: string;
    a: string;
}
