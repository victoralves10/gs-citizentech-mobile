// Tipos da API (CHUVA, ALTA...) → ícone e cor
import { Ionicons } from "@expo/vector-icons";
import { Cores } from "../theme/cores";
import { CategoriaClima, GravidadeAlerta, TipoAlerta, TipoDica } from "../models/Previsao";

type NomeIcone = keyof typeof Ionicons.glyphMap;

// ehDia = false troca o sol pela lua
export function iconeDoClima(
    categoria: CategoriaClima | null | undefined,
    ehDia: boolean | null | undefined = true
): NomeIcone {
    const noite = ehDia === false;

    switch (categoria) {
        case "CEU_LIMPO":
            return noite ? "moon" : "sunny";
        case "PARCIALMENTE_NUBLADO":
            return noite ? "cloudy-night" : "partly-sunny";
        case "NUBLADO":
        case "NEBLINA":
            return "cloudy";
        case "GAROA":
        case "CHUVA":
            return "rainy";
        case "NEVE":
            return "snow";
        case "TEMPESTADE":
            return "thunderstorm";
        default:
            return "help-circle";
    }
}

export function iconeDoAlerta(tipo: TipoAlerta | null | undefined): NomeIcone {
    switch (tipo) {
        case "CHUVA":
            return "rainy";
        case "TEMPESTADE":
            return "thunderstorm";
        case "CALOR":
            return "thermometer";
        case "FRIO":
            return "snow";
        case "RAJADA":
            return "flag";
        case "UV":
            return "sunny";
        default:
            return "warning";
    }
}

// usado no "Novo alerta: ..." do "O que mudou"
export function nomeDoAlerta(tipo: TipoAlerta | null | undefined): string {
    switch (tipo) {
        case "CHUVA":
            return "chuva";
        case "TEMPESTADE":
            return "tempestade";
        case "CALOR":
            return "calor";
        case "FRIO":
            return "frio";
        case "RAJADA":
            return "rajadas de vento";
        case "UV":
            return "índice UV alto";
        default:
            return "clima";
    }
}

export function corDaGravidade(gravidade: GravidadeAlerta | null | undefined, cores: Cores) {
    return gravidade === "ALTA" ? cores.erro : cores.alerta;
}

export function iconeDaDica(tipo: TipoDica): NomeIcone {
    switch (tipo) {
        case "GUARDA_CHUVA":
            return "umbrella";
        case "PROTETOR_SOLAR":
            return "sunny";
        case "OCULOS_ESCUROS":
            return "glasses";
        case "CASACO":
            return "shirt";
        case "GARRAFA_AGUA":
            return "water";
    }
}
