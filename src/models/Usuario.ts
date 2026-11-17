// um usuário do app (GET /usuarios/me)
export type Usuario = {
    id: number;
    nome: string;
    email: string;
    perfilIa?: string | null; // o "Sobre mim" (null quando está vazio)
};

// o que o app guarda no celular depois do login/cadastro
export type RespostaSessao = {
    token: string; // a "chave" que prova que o usuário está logado (JWT)
    usuario: Usuario;
};

// o que o POST /auth/login e o POST /auth/cadastro devolvem
export type RespostaToken = {
    token: string;
    tipo: string; // "Bearer"
    expiraEm: string; // quando o token vence (ex.: "2026-11-24T15:00:00Z")
};
