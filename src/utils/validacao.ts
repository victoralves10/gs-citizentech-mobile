// confere se o texto tem cara de e-mail: algo@algo.algo
export function emailValido(email: string) {
    return /^\S+@\S+\.\S+$/.test(email.trim());
}

// tamanho mínimo da senha
export const TAMANHO_MINIMO_SENHA = 6;
