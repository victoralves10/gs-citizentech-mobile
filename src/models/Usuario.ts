// Usuário (igual à API Java)

export type Usuario = {
    id: number;
    nome: string;
    email: string;
};

// guardado no celular depois do login
export type RespostaSessao = {
    token: string;
    usuario: Usuario;
};

// POST /auth/login e /auth/cadastro
export type RespostaToken = {
    token: string;
    tipo: string; // "Bearer"
    expiraEm: string; // quando o token vence (ex.: "2026-11-24T15:00:00Z")
};
