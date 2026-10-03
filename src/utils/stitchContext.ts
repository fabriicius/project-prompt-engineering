import { Message } from "../types";



export function stitchContext(
    params: {
        sumary?:string,
        userProfile?:string;
        recentMessages: Message[];
    }
){

    const stiteched : Message[] = [];

    if(params.sumary){
        stiteched.push({role:"user", content: `Resumo da conversa até agora: ${params.sumary}`});
        stiteched.push({role:"system", content: `Entendido, vou continuar a partir desse ponto`});
    }

    if(params.userProfile){
        stiteched.push({role:"system", content:`Perfil do usuário: ${params.userProfile}`});
        stiteched.push({role:"system", content: `Entendido`});
    }

    return [...stiteched, ...params.recentMessages];
}
