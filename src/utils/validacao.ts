export const TAMANHO_MINIMO_SENHA = 6;

// Mensagem de erro do campo de e-mail (undefined quando está certo)
export function erroDoEmail(email: string): string | undefined {
    if (!email.trim()) return "Informe o e-mail.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return "E-mail inválido.";
    return undefined;
}

export function semErros(erros: object): boolean {
    return Object.values(erros).every((erro) => !erro);
}
