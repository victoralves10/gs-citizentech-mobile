import { Lugar } from "../models/Lugar";
import { copia, esperar } from "./utils";

const LUGARES: Lugar[] = [
    {
        id: 1,
        nome: "Pinheiros",
        cidade: "São Paulo",
        estado: "São Paulo",
        pais: "Brasil",
        latitude: -23.5667,
        longitude: -46.7019,
        fuso: "America/Sao_Paulo",
    },
    {
        id: 2,
        nome: "Vila Mariana",
        cidade: "São Paulo",
        estado: "São Paulo",
        pais: "Brasil",
        latitude: -23.5883,
        longitude: -46.6346,
        fuso: "America/Sao_Paulo",
    },
    {
        id: 3,
        nome: "São Paulo",
        cidade: "São Paulo",
        estado: "São Paulo",
        pais: "Brasil",
        latitude: -23.5475,
        longitude: -46.6361,
        fuso: "America/Sao_Paulo",
    },
    {
        id: 4,
        nome: "Campinas",
        cidade: "Campinas",
        estado: "São Paulo",
        pais: "Brasil",
        latitude: -22.9056,
        longitude: -47.0608,
        fuso: "America/Sao_Paulo",
    },
    {
        id: 5,
        nome: "Copacabana",
        cidade: "Rio de Janeiro",
        estado: "Rio de Janeiro",
        pais: "Brasil",
        latitude: -22.9711,
        longitude: -43.1822,
        fuso: "America/Sao_Paulo",
    },
    {
        id: 6,
        nome: "Curitiba",
        cidade: "Curitiba",
        estado: "Paraná",
        pais: "Brasil",
        latitude: -25.4278,
        longitude: -49.2731,
        fuso: "America/Sao_Paulo",
    },
];
const ACENTOS = new RegExp("[\\u0300-\\u036f]", "g");

function simplificar(texto: string) {
    return texto.normalize("NFD").replace(ACENTOS, "").toLowerCase().trim();
}

async function buscar(texto: string): Promise<Lugar[]> {
    await esperar(400);
    const procurado = simplificar(texto);
    return copia(LUGARES.filter((l) => simplificar(l.nome).startsWith(procurado)));
}

export const lugaresMock = { buscar };
