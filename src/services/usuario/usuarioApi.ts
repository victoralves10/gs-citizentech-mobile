//GET    /usuarios/me             dados do usuário
//PATCH  /usuarios/me/nome        troca o nome
//PATCH  /usuarios/me/perfil-ia   troca o "Sobre mim" ("" apaga)
//PATCH  /usuarios/me/senha       troca a senha (204, sem resposta)
//DELETE /usuarios/me             exclui a conta (204, sem resposta)

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

async function alterarSobreMim(perfilIa: string): Promise<Usuario> {
    const resposta = await api.patch<Usuario>("/usuarios/me/perfil-ia", { perfilIa });
    return resposta.data;
}

async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    await api.patch("/usuarios/me/senha", { senhaAtual, novaSenha });
}

async function excluirConta(): Promise<void> {
    await api.delete("/usuarios/me");
}

export const usuarioApi = { buscar, alterarNome, alterarSobreMim, alterarSenha, excluirConta };
