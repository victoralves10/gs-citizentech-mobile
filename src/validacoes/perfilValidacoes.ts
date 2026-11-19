import { Erros, regraConfirmacao, regraSenha, regraTexto } from "./regras";

// Editar nome e trocar senha

export function validarNome(nome: string): Erros<"nome"> {
    return { nome: regraTexto(nome, "o nome", 3, 100) };
}

export type CamposSenha = { senhaAtual: string; novaSenha: string; confirmacao: string };

export function validarTrocaDeSenha(campos: CamposSenha): Erros<keyof CamposSenha> {
    const novaSenha =
        regraSenha(campos.novaSenha, "a nova senha") ??
        (campos.novaSenha === campos.senhaAtual
            ? "A nova senha deve ser diferente da atual."
            : undefined);

    return {
        senhaAtual: campos.senhaAtual ? undefined : "Informe a senha atual.",
        novaSenha,
        confirmacao: regraConfirmacao(campos.novaSenha, campos.confirmacao),
    };
}
