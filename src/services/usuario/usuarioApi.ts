// Perfil na API Java (/usuarios/me): buscar, trocar nome, trocar senha e excluir conta.
// A API descobre quem é o usuário pelo token, então nenhuma rota precisa do id.
import { api } from "../api";
import { Usuario } from "../../models/Usuario";

async function buscar(): Promise<Usuario> {
    const resposta = await api.get<Usuario>("/usuarios/me");
    return resposta.data;
}

async function alterarNome(nome: string): Promise<Usuario> {
    const resposta = await api.patch<Usuario>("/usuarios/me/nome", { nome });
    return resposta.data;
}

async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    await api.patch("/usuarios/me/senha", { senhaAtual, novaSenha });
}

async function excluirConta(): Promise<void> {
    await api.delete("/usuarios/me");
}

export const usuarioApi = { buscar, alterarNome, alterarSenha, excluirConta };
