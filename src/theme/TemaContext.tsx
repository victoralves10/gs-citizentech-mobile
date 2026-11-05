import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cores, coresClaras, coresEscuras } from "./cores";
import { log } from "../utils/log";

// as 3 opções de tema
export type PreferenciaTema = "automatico" | "claro" | "escuro";

// nome da "gaveta" onde a escolha fica salva no celular
const CHAVE_TEMA = "@gs:tema";

// o formato do que o Context entrega para as telas
type TemaContextDados = {
    preferencia: PreferenciaTema;
    escuro: boolean;
    cores: Cores;
    mudarPreferencia: (nova: PreferenciaTema) => void;
};

// cria o Context (começa vazio; quem preenche é o TemaProvider)
const TemaContext = createContext<TemaContextDados | null>(null);

// TemaProvider
export function TemaProvider({ children }: { children: ReactNode }) {
    // tema que o CELULAR está usando agora ("light" ou "dark")
    const temaDoCelular = useColorScheme();

    // escolha do usuário - useState - redesenha a tela quando muda.
    const [preferencia, setPreferencia] = useState<PreferenciaTema>("automatico");

    // useEffect com [] roda UMA vez, quando o app abre:
    // lê a escolha que ficou salva da última vez
    useEffect(() => {
        AsyncStorage.getItem(CHAVE_TEMA).then((salva) => {
            if (salva === "automatico" || salva === "claro" || salva === "escuro") {
                setPreferencia(salva);
                log.tema(`tema salvo encontrado: ${salva}`);
            } else {
                log.tema("nenhum tema salvo, usando automático");
            }
        });
    }, []);

    // troca o tema e salva a escolha no celular
    function mudarPreferencia(nova: PreferenciaTema) {
        setPreferencia(nova);
        AsyncStorage.setItem(CHAVE_TEMA, nova);
        log.tema(`tema trocado para ${nova}`);
    }

    let escuro = false;
    if (preferencia === "automatico") {
        escuro = temaDoCelular === "dark";
    } else {
        escuro = preferencia === "escuro";
    }

    // escolhe a paleta certa
    const cores = escuro ? coresEscuras : coresClaras;

    // entrega tudo para o app
    return (
        <TemaContext.Provider value={{ preferencia, escuro, cores, mudarPreferencia }}>
            {children}
        </TemaContext.Provider>
    );
}

// useTema: é assim que as telas pegam o tema
// Exemplo: const { cores, escuro } = useTema();
export function useTema() {
    const dados = useContext(TemaContext);

    // se alguém usar useTema fora do TemaProvider, avisa com um erro claro
    if (!dados) {
        throw new Error("useTema precisa ser usado dentro do <TemaProvider>.");
    }
    return dados;
}
