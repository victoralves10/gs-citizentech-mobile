import { Compromisso } from "./Compromisso";

// Tipos fixos

export type CategoriaClima =
    | "CEU_LIMPO"
    | "PARCIALMENTE_NUBLADO"
    | "NUBLADO"
    | "NEBLINA"
    | "GAROA"
    | "CHUVA"
    | "NEVE"
    | "TEMPESTADE"
    | "DESCONHECIDA";

export type TipoAlerta = "CHUVA" | "TEMPESTADE" | "CALOR" | "FRIO" | "RAJADA" | "UV";

export type GravidadeAlerta = "MEDIA" | "ALTA";

export type TipoDica =
    "GUARDA_CHUVA" | "PROTETOR_SOLAR" | "OCULOS_ESCUROS" | "CASACO" | "GARRAFA_AGUA";

export type MotivoMudanca = "ALERTA" | "CEU" | "CHUVA" | "TEMPERATURA";

// Partes da previsão

export type LocalResumo = {
    id: number;
    apelido: string; // "Casa"
    nome: string; // "Vila Mariana"
    cidade: string; // "São Paulo"
    estado: string; // "São Paulo"
    uf: string | null; // "SP"
    fuso: string; // "America/Sao_Paulo"
};

// valor + classificação pronta (UV 9 "Muito alto")
export type Medida = {
    valor: number | null;
    descricao: string | null;
};

export type ClimaAtual = {
    temperatura: number | null;
    condicao: string | null; // texto pronto: "Parcialmente nublado"
    categoria: CategoriaClima | null;
    ehDia: boolean | null; // true de dia, false de noite (muda o ícone)
    sensacaoTermica: number | null;
    temperaturaMaxima: number | null;
    temperaturaMinima: number | null;
    umidade: number | null; // em %
    vento: { velocidade: number | null; direcao: string | null } | null;
    rajada: Medida | null;
    indiceUV: Medida | null;
    probabilidadeChuva: number | null; // em %
    sol: { nascer: string | null; por: string | null } | null; // "2026-11-17T05:12"
};

export type PrevisaoHora = {
    hora: string; // "2026-11-17T14:00"
    temperatura: number | null;
    probabilidadeChuva: number | null;
    categoria: CategoriaClima | null;
    ehDia: boolean | null;
};

export type PrevisaoDia = {
    data: string; // "2026-11-18"
    temperaturaMinima: number | null;
    temperaturaMaxima: number | null;
    categoria: CategoriaClima | null;
    condicao: string | null;
    probabilidadeChuva: number | null;
    volumeChuva: number | null; // em mm
    previsaoIncerta: boolean | null; // dias muito distantes
};

export type Alerta = {
    id: number | null; // null na Pesquisa (alerta calculado na hora)
    tipo: TipoAlerta;
    gravidade: GravidadeAlerta;
    dia: string; // "2026-11-17"
    titulo: string; // "Chuva forte à tarde"
    descricao: string; // "Chance de chuva de 92%, a partir das 15h."
    valor: number | null;
    primeiraHora: number | null;
};

export type Dica = {
    tipo: TipoDica;
    texto: string; // "Leve guarda-chuva"
};

export type Mudanca = {
    id: number;
    localId: number;
    localApelido: string;
    dia: string; // o dia que mudou: "2026-11-18"
    registradoEm: string; // quando a mudança foi vista: "2026-11-17T13:00:00Z"
    motivo: MotivoMudanca;
    anterior: string | null;
    categoriaAnterior: CategoriaClima | null;
    atualizada: string | null;
    categoriaAtual: CategoriaClima | null;
    tipoAlerta: TipoAlerta | null;
    gravidadeAlerta: GravidadeAlerta | null;
};

// Respostas

// GET /home
export type RespostaHome = {
    temLocais: boolean; // false: convida a cadastrar o 1º local
    local: LocalResumo | null; // null: o usuário não tem local principal
    atualizadoEm: string | null;
    climaAtual: ClimaAtual | null;
    previsaoPorHora: PrevisaoHora[];
    alertas: Alerta[];
    dicas: Dica[];
    mudancasNaPrevisao: Mudanca[];
    compromissos: Compromisso[];
};

// GET /locais/{id}/previsao
export type RespostaPrevisao = {
    local: LocalResumo;
    atualizadoEm: string | null; // null: a previsão ainda está chegando
    climaAtual: ClimaAtual | null;
    previsaoPorHora: PrevisaoHora[];
    previsaoDiaria: PrevisaoDia[];
    alertas: Alerta[];
    mudancasNaPrevisao: Mudanca[];
};

// GET /previsao?latitude=&longitude=&fuso=
export type RespostaPesquisa = {
    atualizadoEm: string | null;
    climaAtual: ClimaAtual | null;
    previsaoPorHora: PrevisaoHora[];
    previsaoDiaria: PrevisaoDia[];
    alertas: Alerta[];
};
