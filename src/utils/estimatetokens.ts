import { ContextWindow } from "../context-window";

export function estimateTokens(contextoWindow: ContextWindow): number {
   const averageCharsPerToken = 3; // Estimativa de caracteres por token
   return contextoWindow.getMessages().reduce((totalTokens, msg) => {
        const messageLength = msg.content.length;
    const estimatedTokens = Math.ceil(messageLength / averageCharsPerToken);
    return totalTokens + estimatedTokens;
    }, 0);

}