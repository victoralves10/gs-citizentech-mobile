import {
    Alerta,
    CategoriaClima,
    ClimaAtual,
    LocalResumo,
    Mudanca,
    PrevisaoDia,
    PrevisaoHora,
    RespostaHome,
    RespostaPesquisa,
    RespostaPrevisao,
} from "../models/Previsao";
import { copia, diaDaqui, esperar, horaDaqui } from "./utils";

// ---------- o local principal do mock ----------
const CASA: LocalResumo = {
    id: 100,
    apelido: "Casa",
    nome: "Vila Mariana",
    cidade: "São Paulo",
    estado: "São Paulo",
    uf: "SP",
    fuso: "America/Sao_Paulo",
};

// ---------- clima de agora ----------
const CLIMA_AGORA: ClimaAtual = {
    temperatura: 24.3,
    condicao: "Parcialmente nublado",
    categoria: "PARCIALMENTE_NUBLADO",
    ehDia: true,
    sensacaoTermica: 26.1,
    temperaturaMaxima: 28.4,
    temperaturaMinima: 18.2,
    umidade: 68,
    vento: { velocidade: 14.2, direcao: "SE" },
    rajada: { valor: 32, descricao: "Moderadas" },
    indiceUV: { valor: 9, descricao: "Muito alto" },
    probabilidadeChuva: 40,
    sol: { nascer: `${diaDaqui(0)}T05:12`, por: `${diaDaqui(0)}T18:31` },
};

// ---------- próximas 48 horas ----------
// a chuva aparece à tarde (das 15h às 19h), como numa tarde de verão em SP
function gerarHoras(): PrevisaoHora[] {
    return Array.from({ length: 48 }, (_, i) => {
        const hora = horaDaqui(i);
        const h = Number(hora.slice(11, 13));
        const ehDia = h >= 6 && h < 19;
        const chuvoso = h >= 15 && h <= 19;
        const categoria: CategoriaClima = chuvoso
            ? "CHUVA"
            : ehDia
              ? "PARCIALMENTE_NUBLADO"
              : "CEU_LIMPO";
        // temperatura sobe até as 14h e cai de noite
        const temperatura = 19 + 9 * Math.sin((Math.PI * Math.max(0, h - 5)) / 18);
        return {
            hora,
            temperatura: Math.round(temperatura * 10) / 10,
            probabilidadeChuva: chuvoso ? 70 + (h % 3) * 8 : 10,
            categoria,
            ehDia,
        };
    });
}

// ---------- próximos 16 dias ----------
const CEUS: { categoria: CategoriaClima; condicao: string; chuva: number }[] = [
    { categoria: "CHUVA", condicao: "Chuva à tarde", chuva: 92 },
    { categoria: "PARCIALMENTE_NUBLADO", condicao: "Parcialmente nublado", chuva: 20 },
    { categoria: "CEU_LIMPO", condicao: "Céu limpo", chuva: 5 },
    { categoria: "TEMPESTADE", condicao: "Tempestade", chuva: 85 },
    { categoria: "NUBLADO", condicao: "Nublado", chuva: 30 },
    { categoria: "GAROA", condicao: "Garoa", chuva: 55 },
];

function gerarDias(): PrevisaoDia[] {
    return Array.from({ length: 16 }, (_, i) => {
        const ceu = CEUS[i % CEUS.length];
        return {
            data: diaDaqui(i),
            temperaturaMinima: 17 + (i % 4),
            temperaturaMaxima: 26 + (i % 5),
            categoria: ceu.categoria,
            condicao: ceu.condicao,
            probabilidadeChuva: ceu.chuva,
            volumeChuva: ceu.chuva > 50 ? 4.2 + i : 0,
            previsaoIncerta: i >= 10, // dias muito longe: previsão incerta
        };
    });
}

// ---------- alertas (o título e a descrição vêm prontos, como na API) ----------
const ALERTAS: Alerta[] = [
    {
        id: 1,
        tipo: "CHUVA",
        gravidade: "ALTA",
        dia: diaDaqui(0),
        titulo: "Chuva forte à tarde",
        descricao: "Chance de chuva de 92%, a partir das 15h.",
        valor: 92,
        primeiraHora: 15,
    },
    {
        id: 2,
        tipo: "UV",
        gravidade: "MEDIA",
        dia: diaDaqui(0),
        titulo: "Índice UV extremo",
        descricao: "Índice UV de 11.",
        valor: 11,
        primeiraHora: null,
    },
    {
        id: 3,
        tipo: "TEMPESTADE",
        gravidade: "ALTA",
        dia: diaDaqui(3),
        titulo: "Tempestade à noite",
        descricao: "Raios e rajadas previstos, a partir das 20h.",
        valor: null,
        primeiraHora: 20,
    },
];

// ---------- "O que mudou" ----------
const MUDANCAS: Mudanca[] = [
    {
        id: 1,
        localId: 100,
        localApelido: "Casa",
        dia: diaDaqui(1),
        registradoEm: new Date(Date.now() - 2 * 3600000).toISOString(),
        motivo: "CEU",
        anterior: "27° e sol",
        categoriaAnterior: "CEU_LIMPO",
        atualizada: "24° e chuva",
        categoriaAtual: "CHUVA",
        tipoAlerta: null,
        gravidadeAlerta: null,
    },
    {
        id: 2,
        localId: 101,
        localApelido: "Trabalho",
        dia: diaDaqui(3),
        registradoEm: new Date(Date.now() - 40 * 60000).toISOString(),
        motivo: "ALERTA",
        anterior: null,
        categoriaAnterior: null,
        atualizada: null,
        categoriaAtual: null,
        tipoAlerta: "TEMPESTADE",
        gravidadeAlerta: "ALTA",
    },
];

// ---------- as 3 rotas ----------

async function home(): Promise<RespostaHome> {
    await esperar(800);
    const hoje = diaDaqui(0);
    return copia({
        temLocais: true,
        local: CASA,
        atualizadoEm: new Date(Date.now() - 12 * 60000).toISOString(),
        climaAtual: CLIMA_AGORA,
        previsaoPorHora: gerarHoras().slice(0, 24), // a Home mostra só 24 horas
        alertas: ALERTAS.filter((a) => a.dia === hoje), // a Home mostra só os de hoje
        dicas: [
            { tipo: "GUARDA_CHUVA", texto: "Leve guarda-chuva" },
            { tipo: "PROTETOR_SOLAR", texto: "Use protetor solar" },
            { tipo: "GARRAFA_AGUA", texto: "Leve uma garrafa de água" },
        ],
        mudancasNaPrevisao: MUDANCAS,
        compromissos: [
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
        ],
    });
}

async function doLocal(localId: number): Promise<RespostaPrevisao> {
    await esperar(800);
    return copia({
        local: { ...CASA, id: localId },
        atualizadoEm: new Date(Date.now() - 12 * 60000).toISOString(),
        climaAtual: CLIMA_AGORA,
        previsaoPorHora: gerarHoras(),
        previsaoDiaria: gerarDias(),
        alertas: ALERTAS,
        mudancasNaPrevisao: MUDANCAS.filter((m) => m.localId === localId),
    });
}

async function pesquisar(): Promise<RespostaPesquisa> {
    await esperar(800);
    return copia({
        atualizadoEm: new Date().toISOString(),
        climaAtual: CLIMA_AGORA,
        previsaoPorHora: gerarHoras(),
        previsaoDiaria: gerarDias(),
        alertas: ALERTAS,
    });
}

export const previsaoMock = { home, doLocal, pesquisar };
