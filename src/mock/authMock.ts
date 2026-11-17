import AsyncStorage from "@react-native-async-storage/async-storage";
import { RespostaSessao, Usuario } from "../models/Usuario";

// formato de um usuário guardado no "banco falso" (com a senha)
type UsuarioMock = Usuario & { senha: string };

const CHAVE_BANCO_FALSO = "@gs:mock-usuarios";

// usuário que já vem cadastrado
const USUARIO_TESTE: UsuarioMock = {
    id: 1,
    nome: "Usuário Teste",
    email: "teste@gs.com",
    senha: "123456",
};

// espera alguns milissegundos (para parecer uma requisição de verdade)
function esperar(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// lê a lista de usuários do "banco falso"
async function lerUsuarios(): Promise<UsuarioMock[]> {
    const texto = await AsyncStorage.getItem(CHAVE_BANCO_FALSO);
    if (!texto) {
        return [USUARIO_TESTE];
    }
    return JSON.parse(texto);
}

// salva a lista de usuários no "banco falso"
async function salvarUsuarios(usuarios: UsuarioMock[]) {
    await AsyncStorage.setItem(CHAVE_BANCO_FALSO, JSON.stringify(usuarios));
}

// monta a resposta igual à que a API vai mandar (sem a senha!)
function montarResposta(usuario: UsuarioMock): RespostaSessao {
    return {
        token: `token-falso-${usuario.id}-${Date.now()}`,
        usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email },
    };
}

// LOGIN
async function entrar(email: string, senha: string): Promise<RespostaSessao> {
    await esperar(800);

    const usuarios = await lerUsuarios();

    // procura alguém com o mesmo e-mail e a mesma senha
    const encontrado = usuarios.find((u) => u.email === email.toLowerCase() && u.senha === senha);

    if (!encontrado) {
        throw new Error("E-mail ou senha incorretos.");
    }

    return montarResposta(encontrado);
}

// CADASTRO
async function cadastrar(nome: string, email: string, senha: string): Promise<RespostaSessao> {
    await esperar(800);

    const usuarios = await lerUsuarios();

    // não deixa cadastrar o mesmo e-mail 2 vezes
    const jaExiste = usuarios.some((u) => u.email === email.toLowerCase());
    if (jaExiste) {
        throw new Error("Este e-mail já está cadastrado.");
    }

    // cria o usuário novo com o próximo id
    const novo: UsuarioMock = {
        id: usuarios.length + 1,
        nome: nome.trim(),
        email: email.toLowerCase(),
        senha,
    };

    await salvarUsuarios([...usuarios, novo]);

    return montarResposta(novo);
}

export const authMock = { entrar, cadastrar };
