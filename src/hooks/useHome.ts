import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { RespostaHome } from "../models/Previsao";
import { previsaoService } from "../services/previsao/previsaoService";
import { mensagemDeErro } from "../services/api";

export function useHome() {
    const [dados, setDados] = useState<RespostaHome | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();

    // já carregou alguma vez? (para não mostrar a rodinha grande de novo)
    const jaCarregou = useRef(false);

    const carregar = useCallback(async (puxou: boolean) => {
        if (puxou) setAtualizando(true);
        else if (!jaCarregou.current) setCarregando(true);

        try {
            setDados(await previsaoService.home());
            setErro(undefined);
            jaCarregou.current = true;
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

    // toda vez que a aba aparece
    useFocusEffect(
        useCallback(() => {
            carregar(false);
        }, [carregar])
    );

    return {
        dados,
        carregando,
        atualizando,
        erro,
        atualizar: () => carregar(true),
    };
}
