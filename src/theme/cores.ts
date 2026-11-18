export type Cores = {
    fundo: string; // fundo da tela
    superficie: string; // fundo dos cartões e campos
    borda: string; // linhas e contornos

    texto: string; // texto principal
    textoSecundario: string; // texto de apoio (descrições)
    textoSuave: string; // dicas, placeholders
    textoSobreCor: string; // texto em cima de um botão colorido

    primaria: string; // cor principal (botões, destaques)
    primariaForte: string; // versão mais escura da principal (gradiente)
    secundaria: string; // cor de apoio

    sucesso: string;
    erro: string;
    alerta: string;

    alertaTexto: string; // texto em cima de um fundo amarelo (o amarelo puro fica ilegível)
    secundariaTexto: string; // texto em cima de um fundo da cor secundária
    fundoSegmentado: string; // fundo da barrinha de opções (Automático / Claro / Escuro)
};

// Tema claro
export const coresClaras: Cores = {
    fundo: "#F2F6FB",
    superficie: "#FFFFFF",
    borda: "#DCE4EE",

    texto: "#0F1B2D",
    textoSecundario: "#4A5A70",
    textoSuave: "#8C9AAD",
    textoSobreCor: "#FFFFFF",

    primaria: "#1E88E5",
    primariaForte: "#1565C0",
    secundaria: "#00ACC1",

    sucesso: "#2E9D5B",
    erro: "#E5484D",
    alerta: "#F5A524",

    alertaTexto: "#9A6700",
    secundariaTexto: "#00838F",
    fundoSegmentado: "#E3EAF3",
};

// Tema escuro
export const coresEscuras: Cores = {
    fundo: "#0B1220",
    superficie: "#152033",
    borda: "#24324A",

    texto: "#EAF1FB",
    textoSecundario: "#A7B4C8",
    textoSuave: "#6B7A92",
    textoSobreCor: "#FFFFFF",

    primaria: "#4DA3FF",
    primariaForte: "#1E88E5",
    secundaria: "#26C6DA",

    sucesso: "#4CC38A",
    erro: "#FF6B6B",
    alerta: "#FFC53D",

    alertaTexto: "#FFC53D",
    secundariaTexto: "#26C6DA",
    fundoSegmentado: "#1B2940",
};

export function transparente(cor: string, opacidade: number) {
    const alfa = Math.round(opacidade * 255)
        .toString(16)
        .padStart(2, "0");
    return cor + alfa;
}
