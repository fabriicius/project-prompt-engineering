import { openai }  from "./client/openia.ts";
import { generateWithCritique } from "./utils/generateWithCritique.ts";

const PERSONAS = {
    juridico: "Você é um advogado especializado em direito civil, com vasta experiência em contratos e litígios. Sua abordagem é clara, objetiva e fundamentada na legislação vigente.",
    medico: "Você é um médico experiente, especializado em medicina interna, com amplo conhecimento em diagnóstico e tratamento de doenças complexas. Sua comunicação é clara, empática e baseada em evidências científicas.",
    engenheiro: "Você é um engenheiro civil com vasta experiência em projetos de infraestrutura e construção. Sua abordagem é técnica, detalhada e orientada para soluções práticas e eficientes.",
};

type PromptDetailLevel = "high" | "low" | "medium";
type PromptAudience = "client" | "not-client";

function createPromptTemplate(
    detailLevel: PromptDetailLevel,
    audience: PromptAudience,
    persona: keyof typeof PERSONAS,
    doubt: string,
): string {

    const detailInstructions = {
        high: "Forneça uma resposta altamente detalhada, estruturada em etapas, com contexto, exemplos e ressalvas importantes.",
        medium: "Forneça uma resposta equilibrada, com explicações suficientes, pontos principais e um exemplo quando for útil.",
        low: "Forneça uma resposta curta e objetiva, destacando apenas as informações essenciais.",
    };

    const audienceInstructions = {
        client: "Considere que a pessoa é cliente e precisa de uma orientação clara, prática e acessível, sem substituir uma análise profissional do caso concreto.",
        "not-client": "Considere que a pessoa não é cliente. Forneça apenas informações gerais, deixando claras as limitações da resposta e a necessidade de buscar um profissional quando apropriado.",
    };

    return `
    // 1. Papel : Quem o modelo é !
    ${PERSONAS[persona]}

    // 2. Instruções : Como o modelo deve se comportar !
    ${audienceInstructions[audience]}
    ${detailInstructions[detailLevel]}

    // 3. Dados: Qual é a dúvida apresentada !
    Dúvida apresentada:
    ${doubt}


    // 4. Formato : Qual é o formato da resposta !
    Responda em português, organize a resposta de forma clara e não invente informações.
    `.trim();
}

async function chatWithPersona(persona: string, message: string) {
   const systemPrompt = PERSONAS[persona as keyof typeof PERSONAS];
   const response = await generateWithCritique(systemPrompt, message);
   console.log(`Resposta final do modelo para a persona "${persona}":\n${response}`);
}

await chatWithPersona("juridico", 
    createPromptTemplate("high", "client", 
        "juridico", 
        "Quais são os principais cuidados ao redigir um contrato de prestação de serviços?"));
