import { Message } from "./types.ts";


export class ContextWindow {
    private history: Message[] = [];
    private readonly maxMessages: number;

    constructor(maxMessages: number = 100) {
        this.maxMessages = maxMessages;
    }

    getMessages () {
        return this.history;
    }

    addUserMessage(message: string): Message {
        const msg = { role: "user", content: message };
        this.history.push(msg as Message);
        this.slideWindow();
        return msg as Message;
    }

    addAssistantMessage(message: string): Message {
        const msg = { role: "assistant", content: message };
        this.history.push(msg as Message);
        this.slideWindow();
        return msg as Message;
    }

    clearHistory(): void {
        this.history = [];
    }

    restore(role : Message["role"] , content : string) {
        this.history.push({role , content});
    }

    private slideWindow() {
        const limit = this.maxMessages * 2;
        if(this.history.length > limit) {
            this.history = this.history.slice(-limit);
            //mantem o registro na memoria 
            //return this.history.slice(-limit);
        }
        return this.history;
    }

}