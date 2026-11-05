import AsyncStorage from "@react-native-async-storage/async-storage";
import { RespostaSessao } from "../models/Usuario";

const CHAVE_SESSAO = "@gs:sessao";

// salva o token e o usuário
export async function salvarSessao(sessao: RespostaSessao) {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

// busca a sessão salva (ou null se não tiver nenhuma)
export async function buscarSessao(): Promise<RespostaSessao | null> {
    const texto = await AsyncStorage.getItem(CHAVE_SESSAO);
    if (!texto) {
        return null;
    }
    return JSON.parse(texto);
}

// apaga a sessão (logout)
export async function apagarSessao() {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
}

// só o token (usado pelo api.ts para mandar em cada requisição)
export async function buscarToken(): Promise<string | null> {
    const sessao = await buscarSessao();
    return sessao ? sessao.token : null;
}
