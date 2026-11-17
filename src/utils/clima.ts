// ============================================================================
// CLIMA (tipos da API → ícone e cor)
// A API manda o "tipo" das coisas (CHUVA, CALOR, ALTA...). O app só escolhe
// o ícone e a cor de cada tipo. Todas as telas usam estas funções, então
// para trocar um ícone é só mexer aqui.
//
// Exemplos:
//   iconeDoClima("CHUVA", true)        → "rainy"
//   iconeDoClima("CEU_LIMPO", false)   → "moon"     (de noite)
//   iconeDoAlerta("CALOR")             → "thermometer"
//   corDaGravidade("ALTA", cores)      → cores.erro (vermelho)
//   nomeDoAlerta("RAJADA")             → "rajadas de vento"
//   iconeDaDica("GUARDA_CHUVA")        → "umbrella"
// ============================================================================
import { Ionicons } from "@expo/vector-icons";
import { Cores } from "../theme/cores";
import { CategoriaClima, GravidadeAlerta, TipoAlerta, TipoDica } from "../models/Previsao";

type NomeIcone = keyof typeof Ionicons.glyphMap;

// ícone do céu. ehDia = false troca o sol pela lua.
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
            // DESCONHECIDA ou sem dado
            return "help-circle";
    }
}

// ícone de cada tipo de alerta
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

// nome de cada tipo de alerta, para o "Novo alerta: ..." do "O que mudou"
// (os cards de alerta não precisam: o título deles já vem pronto da API)
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

// cor de cada gravidade: ALTA = vermelho, MEDIA = amarelo
export function corDaGravidade(gravidade: GravidadeAlerta | null | undefined, cores: Cores) {
    return gravidade === "ALTA" ? cores.erro : cores.alerta;
}

// ícone de cada dica
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
