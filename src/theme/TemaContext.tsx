import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cores, coresClaras, coresEscuras } from "./cores";
import { log } from "../utils/log";

export type PreferenciaTema = "automatico" | "claro" | "escuro";

const CHAVE_TEMA = "@gs:tema";

type TemaContextDados = {
    preferencia: PreferenciaTema;
    escuro: boolean;
    cores: Cores;
    mudarPreferencia: (nova: PreferenciaTema) => void;
};

const TemaContext = createContext<TemaContextDados | null>(null);

// Tema claro/escuro, salvo no celular
export function TemaProvider({ children }: { children: ReactNode }) {
    const temaDoCelular = useColorScheme();

    const [preferencia, setPreferencia] = useState<PreferenciaTema>("automatico");

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

    const cores = escuro ? coresEscuras : coresClaras;

    return (
        <TemaContext.Provider value={{ preferencia, escuro, cores, mudarPreferencia }}>
            {children}
        </TemaContext.Provider>
    );
}

export function useTema() {
    const dados = useContext(TemaContext);

    if (!dados) {
        throw new Error("useTema precisa ser usado dentro do <TemaProvider>.");
    }
    return dados;
}
