import { diaDeHoje } from "../utils/datas";

// Regras usadas pelos formulários. Cada uma devolve a mensagem de erro ou undefined.
// Os limites são os mesmos da API Java.

export type Erros<Campo extends string> = Partial<Record<Campo, string>>;

export function temErros(erros: object): boolean {
    return Object.values(erros).some(Boolean);
}

// texto obrigatório com tamanho mínimo e máximo ("o nome", "o apelido"...)
export function regraTexto(valor: string, campo: string, minimo: number, maximo: number) {
    const texto = valor.trim();
    const Campo = campo.charAt(0).toUpperCase() + campo.slice(1);

    if (!texto) return `Informe ${campo}.`;
    if (texto.length < minimo) return `${Campo} deve ter pelo menos ${minimo} caracteres.`;
    if (texto.length > maximo) return `${Campo} deve ter no máximo ${maximo} caracteres.`;
    return undefined;
}

export function regraEmail(valor: string) {
    const email = valor.trim();
    if (!email) return "Informe o e-mail.";
    if (email.length > 100) return "O e-mail deve ter no máximo 100 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "E-mail inválido. Ex.: nome@email.com";
    return undefined;
}

// senha nova: 6 a 72 caracteres (sem trim: espaço também conta)
export function regraSenha(valor: string, campo = "a senha") {
    const Campo = campo.charAt(0).toUpperCase() + campo.slice(1);
    if (!valor) return `Informe ${campo}.`;
    if (valor.length < 6) return `${Campo} deve ter pelo menos 6 caracteres.`;
    if (valor.length > 72) return `${Campo} deve ter no máximo 72 caracteres.`;
    return undefined;
}

export function regraConfirmacao(senha: string, confirmacao: string) {
    if (!confirmacao) return "Confirme a senha.";
    if (confirmacao !== senha) return "As senhas não são iguais.";
    return undefined;
}

// data no formato da API ("2026-11-25"), de hoje em diante
export function regraDataFutura(data: string) {
    if (!data) return "Escolha a data.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) return "Data inválida.";
    if (data < diaDeHoje()) return "A data não pode estar no passado.";
    return undefined;
}
