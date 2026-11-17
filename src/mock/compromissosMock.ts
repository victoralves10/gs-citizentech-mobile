// Finge ser a API, com a mesma regra: a data não pode estar no passado.
import { Compromisso, CriarCompromisso, EditarCompromisso } from "../models/Compromisso";
import { copia, diaDaqui, esperar } from "./utils";

let compromissos: Compromisso[] = [
    {
        id: 500,
        nome: "Reunião de alinhamento",
        data: diaDaqui(2),
        localId: 101,
        localApelido: "Trabalho",
    },
    {
        id: 501,
        nome: "Manutenção da internet",
        data: diaDaqui(4),
        localId: 100,
        localApelido: "Casa",
    },
];
let proximoId = 502;

function conferirData(data: string) {
    if (data < diaDaqui(0)) {
        throw new Error("A data do compromisso não pode estar no passado");
    }
}

async function doLocal(localId: number): Promise<Compromisso[]> {
    await esperar();
    return copia(
        compromissos
            .filter((c) => c.localId === localId && c.data >= diaDaqui(0))
            .sort((a, b) => a.data.localeCompare(b.data))
    );
}

async function todos(): Promise<Compromisso[]> {
    await esperar();
    return copia(
        compromissos
            .filter((c) => c.data >= diaDaqui(0))
            .sort((a, b) => a.data.localeCompare(b.data))
    );
}

async function criar(localId: number, dados: CriarCompromisso): Promise<Compromisso> {
    await esperar();
    conferirData(dados.data);
    const novo = { id: proximoId++, ...dados, localId, localApelido: "Local" };
    compromissos.push(novo);
    return copia(novo);
}

async function editar(id: number, dados: EditarCompromisso): Promise<Compromisso> {
    await esperar();
    conferirData(dados.data);
    const atual = compromissos.find((c) => c.id === id);
    if (!atual) throw new Error("Compromisso não encontrado");
    Object.assign(atual, dados);
    return copia(atual);
}

async function remover(id: number): Promise<void> {
    await esperar();
    compromissos = compromissos.filter((c) => c.id !== id);
}

export const compromissosMock = { doLocal, todos, criar, editar, remover };
