import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { apresentacaoFoiVista, marcarApresentacaoVista } from "../storage/apresentacaoStorage";

type ApresentacaoContextDados = {
    jaViuApresentacao: boolean | null; // null = ainda lendo do celular
    concluirApresentacao: () => Promise<void>;
};

const ApresentacaoContext = createContext<ApresentacaoContextDados | null>(null);

export function ApresentacaoProvider({ children }: { children: ReactNode }) {
    const [jaViuApresentacao, setJaViuApresentacao] = useState<boolean | null>(null);

    // quando o app abre: lê o sinal salvo no celular
    useEffect(() => {
        apresentacaoFoiVista().then(setJaViuApresentacao);
    }, []);

    // salva no celular e avisa o app inteiro
    async function concluirApresentacao() {
        await marcarApresentacaoVista();
        setJaViuApresentacao(true);
    }

    return (
        <ApresentacaoContext.Provider value={{ jaViuApresentacao, concluirApresentacao }}>
            {children}
        </ApresentacaoContext.Provider>
    );
}

export function useApresentacao() {
    const dados = useContext(ApresentacaoContext);
    if (!dados) {
        throw new Error("useApresentacao precisa ser usado dentro do <ApresentacaoProvider>.");
    }
    return dados;
}
