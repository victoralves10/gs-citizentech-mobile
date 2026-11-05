// um usuário do app
export type Usuario = {
    id: number;
    nome: string;
    email: string;
};

// o que o login e o cadastro devolvem
export type RespostaSessao = {
    token: string; // (JWT)
    usuario: Usuario;
};
