import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { mensagemDeErro } from "../services/api";

// Busca dados da API sempre que a tela aparece.
// Só a 1ª vez mostra a rodinha; depois atualiza sem apagar a tela.
export function useCarregar<T>(buscar: () => Promise<T>) {
    const [dados, setDados] = useState<T | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();

    const funcao = useRef(buscar);
    useEffect(() => {
        funcao.current = buscar;
    });

    const carregar = useCallback(async (puxou: boolean) => {
        if (puxou) setAtualizando(true);
        try {
            setDados(await funcao.current());
            setErro(undefined);
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

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
        atualizar: () => carregar(true), // puxar para atualizar
        recarregar: () => carregar(false), // depois de salvar algo
    };
}
