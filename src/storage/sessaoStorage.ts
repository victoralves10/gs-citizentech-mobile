// Sessão (token + usuário) guardada no celular
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RespostaSessao } from "../models/Usuario";

const CHAVE_SESSAO = "@gs:sessao";

export async function salvarSessao(sessao: RespostaSessao) {
    await AsyncStorage.setItem(CHAVE_SESSAO, JSON.stringify(sessao));
}

export async function buscarSessao(): Promise<RespostaSessao | null> {
    const texto = await AsyncStorage.getItem(CHAVE_SESSAO);
    if (!texto) {
        return null;
    }
    return JSON.parse(texto);
}

export async function apagarSessao() {
    await AsyncStorage.removeItem(CHAVE_SESSAO);
}

export async function buscarToken(): Promise<string | null> {
    const sessao = await buscarSessao();
    return sessao ? sessao.token : null;
}
