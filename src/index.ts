import * as crypto from "node:crypto";
import { generate, generateWithCritique } from "./utils/generateWithCritique.ts";
import { ContextWindow } from "./context-window.ts";
import { sumarize } from "./utils/summarizeHistory.ts";
import { MessageRepository } from "./messageRepository.ts";


const windowId =  process.argv[2] || crypto.randomUUID(); // You can change this to a unique identifier for different sessions
const contextWindow = new ContextWindow();
const messageRepository = new MessageRepository();

console.log(`----------- Sessão iniciada com ID: ${windowId} ----------------------------------`);


const initalMessages = messageRepository.load(windowId);
if(initalMessages.length > 0) {
    console.log(`Restaurando histórico de mensagens para a janela de contexto com ID: ${windowId}`);
    initalMessages.forEach((msg) => {contextWindow.restore(msg.role, msg.content);});

}

const PERSONAS = {
    juridico: "Você é um advogado especializado em direito civil, com vasta experiência em contratos e litígios. Sua abordagem é clara, objetiva e fundamentada na legislação vigente.",
    medico: "Você é um médico experiente, especializado em medicina interna, com amplo conhecimento em diagnóstico e tratamento de doenças complexas. Sua comunicação é clara, empática e baseada em evidências científicas.",
    engenheiro: "Você é um engenheiro civil com vasta experiência em projetos de infraestrutura e construção. Sua abordagem é técnica, detalhada e orientada para soluções práticas e eficientes.",
};

const subjectAdv = `
    Elaborar um contrato de matrícula para um curso preparatório contendo 3 cláusulas principais:
    pagamento, cancelamento e obrigações do aluno.

    CONTRATO DE MATRÍCULA EM CURSO PREPARATÓRIO

    Pelo presente instrumento particular, de um lado, [NOME DA INSTITUIÇÃO],
    inscrita no CNPJ nº [CNPJ], com sede em [ENDEREÇO], doravante denominada
    CONTRATADA, e, de outro lado, [NOME DO ALUNO], inscrito(a) no CPF nº [CPF],
    residente em [ENDEREÇO], doravante denominado(a) CONTRATANTE, resolvem
    celebrar o presente Contrato de Matrícula em Curso Preparatório, mediante
    as seguintes condições:

    CLÁUSULA 1ª — DO PAGAMENTO

    O CONTRATANTE efetuará o pagamento do curso preparatório no valor total
    de R$ [VALOR], podendo ser pago à vista ou parcelado em [QUANTIDADE]
    parcelas de R$ [VALOR], com vencimento no dia [DIA] de cada mês.

    O atraso no pagamento poderá acarretar a incidência de multa e juros,
    conforme os limites previstos na legislação aplicável.

    CLÁUSULA 2ª — DO CANCELAMENTO

    O CONTRATANTE poderá solicitar o cancelamento da matrícula mediante
    comunicação formal à CONTRATADA.

    Caso o cancelamento ocorra após o início do curso, eventuais valores
    devidos ou a restituição de valores já pagos serão calculados de acordo
    com os serviços efetivamente disponibilizados e com as disposições
    previstas na legislação de proteção ao consumidor.

    Quando aplicável, será assegurado ao CONTRATANTE o direito de
    arrependimento previsto na legislação vigente para contratações
    realizadas fora do estabelecimento comercial.

    CLÁUSULA 3ª — DAS OBRIGAÇÕES DO ALUNO

    O CONTRATANTE compromete-se a:

    a) cumprir as regras acadêmicas e administrativas estabelecidas pela CONTRATADA;

    b) utilizar materiais, aulas, gravações e conteúdos disponibilizados
    exclusivamente para fins pessoais, sendo proibida sua reprodução,
    distribuição ou compartilhamento não autorizado;

    c) manter seus dados cadastrais atualizados;

    d) respeitar professores, funcionários e demais alunos durante as
    atividades presenciais ou realizadas em ambiente virtual.

    E, por estarem de acordo com as condições estabelecidas, as partes
    firmam o presente contrato.

    [CIDADE], [DATA].

    ____________________________________
    [NOME DA INSTITUIÇÃO]
    CONTRATADA

    ____________________________________
    [NOME DO ALUNO]
    CONTRATANTE
        `.trim();

type PromptDetailLevel = "high" | "low" | "medium";
type PromptAudience = "client" | "not-client";

function createPromptTemplateJurico(
    contract: string,
    detailLevel: PromptDetailLevel,
    audience: PromptAudience,
    ) : string {

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
    Voce recberá um contrato de cliente ${PERSONAS["juridico"]}

    ${audienceInstructions[audience]}
    ${detailInstructions[detailLevel]}

    Assunto: ${contract}

    Responda em português, organize a resposta de forma clara e não invente informações.
    `.trim();
}

const promptMessage = createPromptTemplateJurico(subjectAdv, "low", "client",);

async function chatWithPersona(persona: string, message: string) {
    const systemPrompt = PERSONAS[persona as keyof typeof PERSONAS];

    // save context window message user in the database and memory
    const userMenssage = contextWindow.addUserMessage(message);
    messageRepository.save(windowId, userMenssage);

    // generate response from the model
    const response = await generate(systemPrompt, contextWindow);

    //save context window message assistant in the database and memory
    const assistantMessage = contextWindow.addAssistantMessage(response);
    messageRepository.save(windowId, assistantMessage);

    console.log(
        `Resposta final do modelo para a persona "${persona}":\n${response}`
    );
}

console.log("------------------------Iniciando prompt template com a persona 'juridico'------------------------");
await chatWithPersona("juridico", promptMessage);
console.log("-------------------------------------------------");
await chatWithPersona("juridico", "Quantas clausas principais existem no contrato de matrícula?");
// console.log("-------------------------------------------------");
// await chatWithPersona("juridico", "Existe multa no contrato de matrícula? Se sim, qual é o valor da multa?");
// console.log("-------------------------------------------------");
// await chatWithPersona("juridico", "O Contrato pode ser encerrado a qualquer momento? Se sim, quais são as condições para o encerramento do contrato?");
// console.log("-------------------------------------------------");
// await chatWithPersona("juridico", "Qual foi minha primeira pergunta para você?");
console.log("-------------------------------------------------");
console.log(await sumarize(contextWindow));


console.log(`----------- Para resumir a sessão ultize o ID: ${windowId} ----------------------------------`);

