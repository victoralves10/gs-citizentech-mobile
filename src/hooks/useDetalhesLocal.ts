import { useEffect, useState } from "react";
import { RespostaPrevisao } from "../models/Previsao";
import { previsaoService } from "../services/previsao/previsaoService";
import { mensagemDeErro } from "../services/api";

export function useDetalhesLocal(localId: number) {
    const [dados, setDados] = useState<RespostaPrevisao | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();

    // ---------- quando a tela abre ----------
    // (os "set" ficam dentro do then/catch/finally: só rodam quando a API responde)
    useEffect(() => {
        previsaoService
            .doLocal(localId)
            .then((resposta) => {
                setDados(resposta);
                setErro(undefined);
            })
            .catch((e) => setErro(mensagemDeErro(e)))
            .finally(() => setCarregando(false));
    }, [localId]);

    // ---------- puxar para atualizar ----------
    async function atualizar() {
        setAtualizando(true);
        try {
            setDados(await previsaoService.doLocal(localId));
            setErro(undefined);
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setAtualizando(false);
        }
    }

    return { dados, carregando, atualizando, erro, atualizar };
}
