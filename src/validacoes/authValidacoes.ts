import { Erros, regraConfirmacao, regraEmail, regraSenha, regraTexto } from "./regras";

// Login e cadastro

export type CamposLogin = { email: string; senha: string };

export function validarLogin({ email, senha }: CamposLogin): Erros<keyof CamposLogin> {
    return {
        email: regraEmail(email),
        senha: senha ? undefined : "Informe a senha.",
    };
}

export type CamposCadastro = {
    nome: string;
    email: string;
    senha: string;
    confirmarSenha: string;
};

export function validarCadastro(campos: CamposCadastro): Erros<keyof CamposCadastro> {
    return {
        nome: regraTexto(campos.nome, "o nome", 3, 100),
        email: regraEmail(campos.email),
        senha: regraSenha(campos.senha),
        confirmarSenha: regraConfirmacao(campos.senha, campos.confirmarSenha),
    };
}
