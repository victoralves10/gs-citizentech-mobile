import { Erros, regraTexto } from "./regras";

// Apelido do local (criar e trocar apelido)

export function validarApelido(apelido: string): Erros<"apelido"> {
    return { apelido: regraTexto(apelido, "o apelido", 1, 50) };
}
