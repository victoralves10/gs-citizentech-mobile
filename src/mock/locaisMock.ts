import { CriarLocal, EditarLocal, LocalCard, Pagina } from "../models/Local";
import { copia, esperar } from "./utils";

// o "banco falso" (começa com 3 locais)
let locais: LocalCard[] = [
    {
        id: 100,
        apelido: "Casa",
        nome: "Vila Mariana",
        cidade: "São Paulo",
        principal: true,
        receberAlertas: true,
    },
    {
        id: 101,
        apelido: "Trabalho",
        nome: "Tatuapé",
        cidade: "São Paulo",
        principal: false,
        receberAlertas: true,
    },
    {
        id: 102,
        apelido: "Praia",
        nome: "Copacabana",
        cidade: "Rio de Janeiro",
        principal: false,
        receberAlertas: false,
    },
];
let proximoId = 103;

// procura o local ou dá o mesmo erro da API (404)
function buscarPorId(id: number): LocalCard {
    const local = locais.find((l) => l.id === id);
    if (!local) {
        throw new Error("Local não encontrado");
    }
    return local;
}

// apelido repetido dá o mesmo erro da API (409)
function conferirApelido(apelido: string, ignorarId?: number) {
    const repetido = locais.some(
        (l) => l.id !== ignorarId && l.apelido.toLowerCase() === apelido.trim().toLowerCase()
    );
    if (repetido) {
        throw new Error("Já existe um local com este apelido");
    }
}

async function listar(busca: string, pagina: number, tamanho: number): Promise<Pagina<LocalCard>> {
    await esperar();

    // filtra pelo apelido ou pelo nome do lugar (igual à API)
    const texto = busca.trim().toLowerCase();
    const filtrados = locais
        .filter(
            (l) =>
                !texto ||
                l.apelido.toLowerCase().includes(texto) ||
                l.nome.toLowerCase().includes(texto)
        )
        // principal primeiro, depois ordem alfabética
        .sort(
            (a, b) =>
                Number(b.principal) - Number(a.principal) || a.apelido.localeCompare(b.apelido)
        );

    // corta só a página pedida
    const inicio = pagina * tamanho;
    return copia({
        itens: filtrados.slice(inicio, inicio + tamanho),
        pagina,
        totalPaginas: Math.ceil(filtrados.length / tamanho),
        totalItens: filtrados.length,
    });
}

async function criar(dados: CriarLocal): Promise<LocalCard> {
    await esperar();
    conferirApelido(dados.apelido);

    const novo: LocalCard = {
        id: proximoId++,
        apelido: dados.apelido.trim(),
        nome: dados.nome,
        cidade: dados.cidade,
        principal: locais.length === 0, // o primeiro vira principal
        receberAlertas: dados.receberAlertas ?? true,
    };
    locais.push(novo);
    return copia(novo);
}

async function editar(id: number, dados: EditarLocal): Promise<LocalCard> {
    await esperar();
    const local = buscarPorId(id);
    conferirApelido(dados.apelido, id);

    // virou principal: desmarca o antigo
    if (dados.principal) {
        locais.forEach((l) => (l.principal = false));
    }
    local.apelido = dados.apelido.trim();
    local.receberAlertas = dados.receberAlertas;
    local.principal = dados.principal;
    return copia(local);
}

async function remover(id: number): Promise<void> {
    await esperar();
    const local = buscarPorId(id);
    locais = locais.filter((l) => l.id !== id);

    // apagou o principal: o mais antigo (menor id) vira o principal
    if (local.principal && locais.length > 0) {
        const maisAntigo = locais.reduce((a, b) => (a.id < b.id ? a : b));
        maisAntigo.principal = true;
    }
}

async function alterarAlertas(id: number, receberAlertas: boolean): Promise<LocalCard> {
    await esperar(300);
    const local = buscarPorId(id);
    local.receberAlertas = receberAlertas;
    return copia(local);
}

export const locaisMock = { listar, criar, editar, remover, alterarAlertas };
