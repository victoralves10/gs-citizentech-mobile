import { useEffect, useState } from "react";
import { Lugar } from "../models/Lugar";
import { RespostaPesquisa } from "../models/Previsao";
import { previsaoService } from "../services/previsao/previsaoService";
import { mensagemDeErro } from "../services/api";
import { buscarRecentes, limparRecentes, salvarRecente } from "../storage/buscasStorage";
import { useBuscaLugares } from "./useBuscaLugares";

export function usePesquisa() {
    const busca = useBuscaLugares();

    // o lugar escolhido e a previsão dele
    const [escolhido, setEscolhido] = useState<Lugar | null>(null);
    const [previsao, setPrevisao] = useState<RespostaPesquisa | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string>();

    // buscas recentes (lidas do celular quando a tela abre)
    const [recentes, setRecentes] = useState<Lugar[]>([]);
    useEffect(() => {
        buscarRecentes().then(setRecentes);
    }, []);

    // busca a previsão do lugar (usada ao escolher e no "tentar de novo")
    async function carregar(lugar: Lugar) {
        setCarregando(true);
        setErro(undefined);
        try {
            setPrevisao(
                await previsaoService.pesquisar(lugar.latitude, lugar.longitude, lugar.fuso)
            );
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setCarregando(false);
        }
    }

    // tocou num lugar: mostra a previsão e guarda nas recentes
    async function escolher(lugar: Lugar) {
        setEscolhido(lugar);
        setPrevisao(null);
        setRecentes(await salvarRecente(lugar));
        carregar(lugar);
    }

    // volta para a busca
    function voltar() {
        setEscolhido(null);
        setPrevisao(null);
        setErro(undefined);
    }

    async function apagarRecentes() {
        await limparRecentes();
        setRecentes([]);
    }

    return {
        ...busca, // busca, mudarBusca, resultados, buscando, erroBusca, buscaCurta
        recentes,
        apagarRecentes,
        escolhido,
        escolher,
        voltar,
        previsao,
        carregando,
        erro,
        tentarDeNovo: () => escolhido && carregar(escolhido),
    };
}
