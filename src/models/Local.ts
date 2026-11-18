// Locais (iguais à API Java)
export type LocalCard = {
    id: number;
    apelido: string; // "Casa", "Trabalho"...
    nome: string; // nome do lugar (bairro): "Vila Mariana"
    cidade: string;
    principal: boolean; // o local que aparece na Home
    receberAlertas: boolean;
};

// POST /locais (endereço vem do lugar escolhido na busca)
export type CriarLocal = {
    apelido: string;
    receberAlertas?: boolean;
    nome: string;
    cidade: string;
    estado: string;
    pais: string;
    latitude: number;
    longitude: number;
    fuso: string; // ex.: "America/Sao_Paulo"
};

// PUT /locais/{id}
export type EditarLocal = {
    apelido: string;
    receberAlertas: boolean;
    principal: boolean;
};

// lista paginada
export type Pagina<T> = {
    itens: T[];
    pagina: number; // começa em 0
    totalPaginas: number;
    totalItens: number;
};
