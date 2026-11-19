import { Erros, regraDataFutura, regraTexto } from "./regras";

// Criar e editar compromisso

export type CamposCompromisso = { nome: string; data: string };

export function validarCompromisso({
    nome,
    data,
}: CamposCompromisso): Erros<keyof CamposCompromisso> {
    return {
        nome: regraTexto(nome, "o nome", 1, 80),
        data: regraDataFutura(data),
    };
}
