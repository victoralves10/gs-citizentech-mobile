import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { Usuario } from "../models/Usuario";
import { authService } from "../services/auth/authService";
import { apagarSessao, buscarSessao, salvarSessao } from "../storage/sessaoStorage";
import { log } from "../utils/log";

type AuthContextDados = {
    usuario: Usuario | null;
    logado: boolean;
    carregando: boolean;
    entrar: (email: string, senha: string) => Promise<void>;
    cadastrar: (nome: string, email: string, senha: string) => Promise<void>;
    sair: () => Promise<void>;
};

const AuthContext = createContext<AuthContextDados | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);

    // quando o app abre: confere se ficou uma sessão salva
    useEffect(() => {
        buscarSessao().then((sessao) => {
            if (sessao) {
                setUsuario(sessao.usuario);
                log.sessao(`sessão encontrada (${sessao.usuario.email})`);
            } else {
                log.sessao("nenhuma sessão salva");
            }
            setCarregando(false);
        });
    }, []);

    // login: chama o authService, salva a sessão no celular e entra no app.
    // Se der erro (ex.: senha errada), o erro "sobe" para a tela mostrar o toast.
    async function entrar(email: string, senha: string) {
        const sessao = await authService.entrar(email, senha);
        await salvarSessao(sessao);
        setUsuario(sessao.usuario);
        log.sessao(`login feito (${sessao.usuario.email})`);
    }

    // cadastro: igual ao login, mas cria a conta antes
    async function cadastrar(nome: string, email: string, senha: string) {
        const sessao = await authService.cadastrar(nome, email, senha);
        await salvarSessao(sessao);
        setUsuario(sessao.usuario);
        log.sessao(`cadastro feito (${sessao.usuario.email})`);
    }

    // logout: apaga a sessão do celular e volta para o Login
    async function sair() {
        await apagarSessao();
        setUsuario(null);
        log.sessao("logout feito");
    }

    // logado é true quando existe um usuário
    const logado = usuario !== null;

    return (
        <AuthContext.Provider value={{ usuario, logado, carregando, entrar, cadastrar, sair }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const dados = useContext(AuthContext);
    if (!dados) {
        throw new Error("useAuth precisa ser usado dentro do <AuthProvider>.");
    }
    return dados;
}
