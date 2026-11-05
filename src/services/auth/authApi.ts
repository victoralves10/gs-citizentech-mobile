import { api } from "../api";
import { RespostaSessao } from "../../models/Usuario";

async function entrar(email: string, senha: string): Promise<RespostaSessao> {
    const resposta = await api.post("/auth/login", { email, senha });
    return resposta.data;
}

async function cadastrar(nome: string, email: string, senha: string): Promise<RespostaSessao> {
    const resposta = await api.post("/auth/cadastro", { nome, email, senha });
    return resposta.data;
}

export const authApi = { entrar, cadastrar };
