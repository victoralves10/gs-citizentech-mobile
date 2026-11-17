import { Compromisso } from "./Compromisso";

// ---------------------------------------------------------------------------
// TIPOS FIXOS (a API manda sempre um destes textos)
// ---------------------------------------------------------------------------

// como está o céu (o app usa para escolher o ícone)
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

// os 6 tipos de alerta (o app usa para escolher o ícone)
export type TipoAlerta = "CHUVA" | "TEMPESTADE" | "CALOR" | "FRIO" | "RAJADA" | "UV";

// gravidade do alerta (o app usa para escolher a cor)
export type GravidadeAlerta = "MEDIA" | "ALTA";

// as 5 dicas do dia (o app usa para escolher o ícone)
export type TipoDica =
    "GUARDA_CHUVA" | "PROTETOR_SOLAR" | "OCULOS_ESCUROS" | "CASACO" | "GARRAFA_AGUA";

// o que fez a previsão mudar ("O que mudou")
export type MotivoMudanca = "ALERTA" | "CEU" | "CHUVA" | "TEMPERATURA";

// ---------------------------------------------------------------------------
// PEDAÇOS DA PREVISÃO
// ---------------------------------------------------------------------------

// o local da previsão (resumido)
export type LocalResumo = {
    id: number;
    apelido: string; // "Casa"
    nome: string; // "Vila Mariana"
    cidade: string; // "São Paulo"
    estado: string; // "São Paulo"
    uf: string | null; // "SP"
    fuso: string; // "America/Sao_Paulo"
};

// um valor com a classificação pronta (ex.: UV 9 "Muito alto")
export type Medida = {
    valor: number | null;
    descricao: string | null;
};

// o clima de agora
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

// uma hora da previsão (lista "próximas horas")
export type PrevisaoHora = {
    hora: string; // "2026-11-17T14:00"
    temperatura: number | null;
    probabilidadeChuva: number | null;
    categoria: CategoriaClima | null;
    ehDia: boolean | null;
};

// um dia da previsão (lista "próximos dias")
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

// um card de alerta (título e descrição já vêm prontos da API)
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

// um chip de dica (o texto já vem pronto da API)
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

// ---------------------------------------------------------------------------
// RESPOSTAS DAS TELAS
// ---------------------------------------------------------------------------

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
