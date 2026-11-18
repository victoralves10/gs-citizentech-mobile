import { useEffect, useState } from "react";
import { Lugar } from "../models/Lugar";
import { LocalResumo, RespostaPesquisa } from "../models/Previsao";
import { previsaoService } from "../services/previsaoService";
import { mensagemDeErro } from "../services/api";
import { buscarRecentes, limparRecentes, salvarRecente } from "../storage/buscasStorage";
import { confirmarExclusao } from "../utils/confirmar";
import { useBuscaLugares } from "./useBuscaLugares";

// Pesquisa: buscar um lugar e ver a previsão dele sem salvar
export function usePesquisa() {
    const busca = useBuscaLugares();

    const [escolhido, setEscolhido] = useState<Lugar | null>(null);
    const [previsao, setPrevisao] = useState<RespostaPesquisa | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string>();

    // buscas recentes guardadas no celular
    const [recentes, setRecentes] = useState<Lugar[]>([]);
    useEffect(() => {
        buscarRecentes().then(setRecentes);
    }, []);

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

    async function escolher(lugar: Lugar) {
        setEscolhido(lugar);
        setPrevisao(null);
        setRecentes(await salvarRecente(lugar));
        carregar(lugar);
    }

    function voltar() {
        setEscolhido(null);
        setPrevisao(null);
        setErro(undefined);
    }

    function apagarRecentes() {
        confirmarExclusao({
            titulo: "Limpar buscas recentes?",
            mensagem: "A lista de lugares pesquisados será apagada.",
            aoConfirmar: async () => {
                await limparRecentes();
                setRecentes([]);
            },
        });
    }

    // o cartão de clima espera um local; o lugar pesquisado ainda não é um local salvo
    const local: LocalResumo | null = escolhido && {
        id: 0,
        apelido: escolhido.nome,
        nome: escolhido.cidade !== escolhido.nome ? escolhido.cidade : escolhido.estado,
        cidade: escolhido.cidade,
        estado: escolhido.estado,
        uf: null,
        fuso: escolhido.fuso,
    };

    return {
        busca,
        recentes,
        apagarRecentes,
        escolhido,
        local,
        escolher,
        voltar,
        previsao,
        carregando,
        erro,
        tentarDeNovo: () => escolhido && carregar(escolhido),
    };
}
