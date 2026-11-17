// Busca os próximos compromissos de todos os locais (GET /compromissos).
// Atualiza toda vez que a tela aparece e ao puxar a tela para baixo.
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Compromisso } from "../models/Compromisso";
import { compromissosService } from "../services/compromissos/compromissosService";
import { mensagemDeErro } from "../services/api";

export function useMeusCompromissos() {
    const [lista, setLista] = useState<Compromisso[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();

    const carregar = useCallback(async (puxou: boolean) => {
        if (puxou) setAtualizando(true);
        try {
            setLista(await compromissosService.todos());
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

    return { lista, carregando, atualizando, erro, atualizar: () => carregar(true) };
}
