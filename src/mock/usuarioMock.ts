// Perfil falso (mock): finge ser o /usuarios/me usando o usuário da sessão salva.
import { Usuario } from "../models/Usuario";
import { buscarSessao } from "../storage/sessaoStorage";
import { copia, esperar } from "./utils";

// o usuário de agora (o que está na sessão salva)
async function usuarioAtual(): Promise<Usuario> {
    const sessao = await buscarSessao();
    if (!sessao) {
        throw new Error("Usuário não encontrado");
    }
    return sessao.usuario;
}

async function buscar(): Promise<Usuario> {
    await esperar();
    return copia(await usuarioAtual());
}

async function alterarNome(nome: string): Promise<Usuario> {
    await esperar();
    if (nome.trim().length < 3) {
        throw new Error("O nome deve ter entre 3 e 100 caracteres");
    }
    return { ...(await usuarioAtual()), nome: nome.trim() };
}

async function alterarSenha(senhaAtual: string, novaSenha: string): Promise<void> {
    await esperar();
    if (novaSenha === senhaAtual) {
        throw new Error("A nova senha deve ser diferente da atual.");
    }
}

async function excluirConta(): Promise<void> {
    await esperar();
}

export const usuarioMock = { buscar, alterarNome, alterarSenha, excluirConta };
