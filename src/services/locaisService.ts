// Locais na API Java
import { api } from "./api";
import { CriarLocal, EditarLocal, LocalCard, Pagina } from "../models/Local";

async function listar(busca: string, pagina: number, tamanho: number): Promise<Pagina<LocalCard>> {
    const resposta = await api.get<Pagina<LocalCard>>("/locais", {
        params: { busca: busca.trim() || undefined, pagina, tamanho },
    });
    return resposta.data;
}

async function criar(dados: CriarLocal): Promise<LocalCard> {
    const resposta = await api.post<LocalCard>("/locais", dados);
    return resposta.data;
}

async function editar(id: number, dados: EditarLocal): Promise<LocalCard> {
    const resposta = await api.put<LocalCard>(`/locais/${id}`, dados);
    return resposta.data;
}

async function remover(id: number): Promise<void> {
    await api.delete(`/locais/${id}`);
}

async function alterarAlertas(id: number, receberAlertas: boolean): Promise<LocalCard> {
    const resposta = await api.patch<LocalCard>(`/locais/${id}/alertas`, { receberAlertas });
    return resposta.data;
}

export const locaisService = { listar, criar, editar, remover, alterarAlertas };
