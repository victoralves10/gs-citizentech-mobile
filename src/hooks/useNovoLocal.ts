import { useEffect, useRef, useState } from "react";
import { Lugar } from "../models/Lugar";
import { lugaresService } from "../services/lugares/lugaresService";
import { locaisService } from "../services/locais/locaisService";
import { mensagemDeErro } from "../services/api";
import { toastSucesso } from "../utils/toast";

// espera o usuário parar de digitar (em milissegundos)
const ESPERA_BUSCA = 400;

// a Open-Meteo só procura com 2 letras ou mais
const MINIMO_LETRAS = 2;

export function useNovoLocal(lugarInicial?: Lugar) {
    // ---------- passo 1: busca ----------
    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState<Lugar[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [erroBusca, setErroBusca] = useState<string>();

    // ---------- passo 2: o lugar escolhido e o formulário ----------
    const [escolhido, setEscolhido] = useState<Lugar | null>(lugarInicial ?? null);
    const [apelido, setApelido] = useState("");
    const [receberAlertas, setReceberAlertas] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string>();

    // número da última busca (para ignorar uma resposta velha que chegue depois)
    const ultimoPedido = useRef(0);

    // ---------- digitar na busca ----------
    // a rodinha já aparece ao digitar (antes mesmo da espera do debounce)
    function mudarBusca(texto: string) {
        setBusca(texto);
        setBuscando(texto.trim().length >= MINIMO_LETRAS);
    }

    // ---------- busca com debounce ----------
    // toda vez que "busca" muda, espera 400 ms. Se mudar de novo antes disso,
    // o "return" cancela a espera anterior (clearTimeout) e começa outra.
    useEffect(() => {
        const texto = busca.trim();

        // menos de 2 letras: nem chama a API (a tela mostra só a dica)
        if (texto.length < MINIMO_LETRAS) {
            ultimoPedido.current++; // descarta uma busca que ainda esteja chegando
            return;
        }

        const espera = setTimeout(async () => {
            const pedido = ++ultimoPedido.current;
            try {
                const lugares = await lugaresService.buscar(texto);
                if (pedido !== ultimoPedido.current) return; // resposta velha: ignora
                setResultados(lugares);
                setErroBusca(undefined);
            } catch (e) {
                if (pedido !== ultimoPedido.current) return;
                setErroBusca(mensagemDeErro(e));
            } finally {
                if (pedido === ultimoPedido.current) setBuscando(false);
            }
        }, ESPERA_BUSCA);

        return () => clearTimeout(espera);
    }, [busca]);

    // ---------- escolher e trocar o lugar ----------
    function escolher(lugar: Lugar) {
        setEscolhido(lugar);
        setErro(undefined);
    }

    function trocarLugar() {
        setEscolhido(null);
        setErro(undefined);
    }

    // ---------- salvar (POST /locais) ----------
    // devolve true quando deu certo (a tela então volta para Meus Locais)
    async function salvar(): Promise<boolean> {
        if (!escolhido) return false;
        if (!apelido.trim()) {
            setErro("Dê um apelido para o local. Ex.: Casa, Trabalho.");
            return false;
        }

        setErro(undefined);
        setSalvando(true);
        try {
            await locaisService.criar({
                apelido: apelido.trim(),
                receberAlertas,
                nome: escolhido.nome,
                cidade: escolhido.cidade,
                estado: escolhido.estado,
                pais: escolhido.pais,
                latitude: escolhido.latitude,
                longitude: escolhido.longitude,
                fuso: escolhido.fuso,
            });
            toastSucesso(`${apelido.trim()} foi salvo!`);
            return true;
        } catch (e) {
            // ex.: "Já existe um local com este apelido" (vem da API)
            setErro(mensagemDeErro(e));
            return false;
        } finally {
            setSalvando(false);
        }
    }

    return {
        busca,
        mudarBusca,
        resultados,
        buscando,
        erroBusca,
        buscaCurta: busca.trim().length < MINIMO_LETRAS,
        escolhido,
        escolher,
        trocarLugar,
        apelido,
        setApelido,
        receberAlertas,
        setReceberAlertas,
        salvando,
        erro,
        salvar,
    };
}
