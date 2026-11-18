// Compromissos na API Java
import { api } from "./api";
import { Pagina } from "../models/Local";
import { Compromisso, CriarCompromisso, EditarCompromisso } from "../models/Compromisso";

// GET /locais/{id}/compromissos (de hoje em diante)
async function doLocal(localId: number): Promise<Compromisso[]> {
    const resposta = await api.get<Pagina<Compromisso>>(`/locais/${localId}/compromissos`, {
        params: { pagina: 0, tamanho: 50 },
    });
    return resposta.data.itens;
}

// GET /compromissos (todos os locais, de hoje em diante)
async function todos(): Promise<Compromisso[]> {
    const resposta = await api.get<Pagina<Compromisso>>("/compromissos", {
        params: { pagina: 0, tamanho: 50 },
    });
    return resposta.data.itens;
}

// POST /locais/{id}/compromissos
async function criar(localId: number, dados: CriarCompromisso): Promise<Compromisso> {
    const resposta = await api.post<Compromisso>(`/locais/${localId}/compromissos`, dados);
    return resposta.data;
}

// PUT /compromissos/{id}
async function editar(id: number, dados: EditarCompromisso): Promise<Compromisso> {
    const resposta = await api.put<Compromisso>(`/compromissos/${id}`, dados);
    return resposta.data;
}

// DELETE /compromissos/{id}
async function remover(id: number): Promise<void> {
    await api.delete(`/compromissos/${id}`);
}

export const compromissosService = { doLocal, todos, criar, editar, remover };
