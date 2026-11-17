import { create } from "axios";
import { Lugar } from "../../models/Lugar";

// conexão só para a Open-Meteo (sem token)
const openMeteo = create({
    baseURL: "https://geocoding-api.open-meteo.com/v1",
    timeout: 15000,
});

// o formato que a Open-Meteo devolve (só os campos que o app usa).
// admin1 = estado, admin2 = cidade (no Brasil). Podem não vir.
type ResultadoOpenMeteo = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    timezone?: string;
    country?: string;
    admin1?: string;
    admin2?: string;
    admin3?: string;
};

// a Open-Meteo devolve { results: [...] }. Quando não acha nada,
// o "results" nem vem (por isso o "?" e o "?? []" lá embaixo).
type RespostaOpenMeteo = {
    results?: ResultadoOpenMeteo[];
};

// texto vazio ("") conta como "não veio"
function primeiroPreenchido(...textos: (string | undefined)[]): string {
    return textos.find((t) => t && t.trim())?.trim() ?? "";
}

// transforma o resultado da Open-Meteo no nosso Lugar
function paraLugar(r: ResultadoOpenMeteo): Lugar {
    const pais = primeiroPreenchido(r.country, "Brasil");
    return {
        id: r.id,
        nome: r.name.slice(0, 60), // a API Java aceita até 60 letras
        cidade: primeiroPreenchido(r.admin2, r.admin3, r.name).slice(0, 60),
        estado: primeiroPreenchido(r.admin1, pais).slice(0, 50),
        pais: pais.slice(0, 50),
        latitude: r.latitude,
        longitude: r.longitude,
        fuso: primeiroPreenchido(r.timezone, "America/Sao_Paulo"),
    };
}

async function buscar(texto: string): Promise<Lugar[]> {
    const resposta = await openMeteo.get<RespostaOpenMeteo>("/search", {
        params: { name: texto.trim(), count: 10, language: "pt", format: "json" },
    });
    return (resposta.data.results ?? []).map(paraLugar);
}

export const lugaresApi = { buscar };
