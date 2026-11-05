// CORES DO APP
// Todas as cores ficam aqui. Nenhuma tela escreve uma cor "na mão"
export type Cores = {
    // fundos
    fundo: string; // fundo da tela
    superficie: string; // fundo dos cartões e campos
    borda: string; // linhas e contornos

    // textos
    texto: string; // texto principal
    textoSecundario: string; // texto de apoio (descrições)
    textoSuave: string; // dicas, placeholders
    textoSobreCor: string; // texto em cima de um botão colorido

    // cores da marca
    primaria: string; // cor principal (botões, destaques)
    primariaForte: string; // versão mais escura da principal (gradiente)
    secundaria: string; // cor de apoio

    // cores de aviso
    sucesso: string;
    erro: string;
    alerta: string;
};

// Tema claro (tons de céu de dia)
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
};

// Tema escuro (tons de céu de noite)
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
};
