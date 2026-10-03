import { ContextWindow } from "../context-window";
import { Message } from "../types";
import { estimateTokens } from "./estimatetokens";
import { sumarize } from "./summarizeHistory";

const MAX_TOKENS = 4096;

export async function maybeCompress(contextWindow: ContextWindow): Promise<Message[]> {
     const currentTokenCount = estimateTokens(contextWindow);
     if(currentTokenCount < MAX_TOKENS) {
        return contextWindow.getMessages();
     }

     const half = Math.floor(contextWindow.getMessages().length / 2);
     const messagesToKeep = contextWindow.getMessages().slice(half);
     const messagesToSummarize = contextWindow.getMessages().slice(0, half);


     const summart = await sumarize(messagesToSummarize);

     return [
        {role : "user", content: `Resumo das conversas anteriores:\n${summart}` },
        {role : "assistant", content: "Entendido , vou continuar a partir desse ponto" },
        ...messagesToKeep];
}