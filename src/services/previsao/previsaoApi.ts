import { api } from "../api";
import { RespostaHome, RespostaPesquisa, RespostaPrevisao } from "../../models/Previsao";

async function home(): Promise<RespostaHome> {
    const resposta = await api.get<RespostaHome>("/home");
    return resposta.data;
}

async function doLocal(localId: number): Promise<RespostaPrevisao> {
    const resposta = await api.get<RespostaPrevisao>(`/locais/${localId}/previsao`);
    return resposta.data;
}

async function pesquisar(
    latitude: number,
    longitude: number,
    fuso: string
): Promise<RespostaPesquisa> {
    const resposta = await api.get<RespostaPesquisa>("/previsao", {
        params: { latitude, longitude, fuso },
    });
    return resposta.data;
}

export const previsaoApi = { home, doLocal, pesquisar };
