// um card da tela Meus Locais (GET /locais, POST /locais, PUT, PATCH)
export type LocalCard = {
    id: number;
    apelido: string; // "Casa", "Trabalho"...
    nome: string; // nome do lugar (bairro): "Vila Mariana"
    cidade: string;
    principal: boolean; // o local que aparece na Home
    receberAlertas: boolean;
};

// o que o app manda para criar um local (POST /locais).
// Os dados do endereço vêm do lugar escolhido na busca (geocoding).
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

// o que o app manda para editar um local (PUT /locais/{id})
export type EditarLocal = {
    apelido: string;
    receberAlertas: boolean;
    principal: boolean;
};

// listas com páginas (GET /locais, GET /compromissos...)
export type Pagina<T> = {
    itens: T[];
    pagina: number; // começa em 0
    totalPaginas: number;
    totalItens: number;
};
