// Login e cadastro na API Java (depois busca o usuário)
import { api } from "./api";
import { RespostaSessao, RespostaToken, Usuario } from "../models/Usuario";

async function buscarUsuario(token: string): Promise<RespostaSessao> {
    const resposta = await api.get<Usuario>("/usuarios/me", {
        headers: { Authorization: `Bearer ${token}` },
    });
    return { token, usuario: resposta.data };
}

async function entrar(email: string, senha: string): Promise<RespostaSessao> {
    const resposta = await api.post<RespostaToken>("/auth/login", { email, senha });
    return buscarUsuario(resposta.data.token);
}

async function cadastrar(nome: string, email: string, senha: string): Promise<RespostaSessao> {
    const resposta = await api.post<RespostaToken>("/auth/cadastro", { nome, email, senha });
    return buscarUsuario(resposta.data.token);
}

export const authService = { entrar, cadastrar };
