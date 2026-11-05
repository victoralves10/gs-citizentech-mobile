// SESSÃO (VERSÃO TEMPORÁRIA)
// Guarda se o usuário está "logado" ou não.
// Quando logado = true, a navegação mostra as telas de DENTRO do app.
// Quando logado = false, mostra as telas de FORA (Login e Cadastro).
// Por enquanto é só um interruptor: entrar() liga e sair() desliga.
import { createContext, ReactNode, useContext, useState } from "react";
import { log } from "../utils/log";

type AuthContextDados = {
    logado: boolean;
    entrar: () => void;
    sair: () => void;
};

const AuthContext = createContext<AuthContextDados | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [logado, setLogado] = useState(false);

    function entrar() {
        setLogado(true);
        log.sessao("entrou no app (teste, sem login de verdade)");
    }

    function sair() {
        setLogado(false);
        log.sessao("saiu do app");
    }

    return <AuthContext.Provider value={{ logado, entrar, sair }}>{children}</AuthContext.Provider>;
}

// as telas usam assim: const { entrar, sair } = useAuth();
export function useAuth() {
    const dados = useContext(AuthContext);
    if (!dados) {
        throw new Error("useAuth precisa ser usado dentro do <AuthProvider>.");
    }
    return dados;
}
