import { useState } from "react";
import { Lugar } from "../models/Lugar";
import { locaisService } from "../services/locais/locaisService";
import { mensagemDeErro } from "../services/api";
import { toastSucesso } from "../utils/toast";
import { useBuscaLugares } from "./useBuscaLugares";

export function useNovoLocal(lugarInicial?: Lugar) {
    // ---------- passo 1: busca ----------
    const busca = useBuscaLugares();

    // ---------- passo 2: o lugar escolhido e o formulário ----------
    const [escolhido, setEscolhido] = useState<Lugar | null>(lugarInicial ?? null);
    const [apelido, setApelido] = useState("");
    const [receberAlertas, setReceberAlertas] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState<string>();

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
    // devolve true quando deu certo (a tela então volta para a tela anterior)
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
        ...busca, // busca, mudarBusca, resultados, buscando, erroBusca, buscaCurta
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
