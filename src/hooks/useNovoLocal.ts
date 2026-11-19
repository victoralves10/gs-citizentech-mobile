import { useState } from "react";
import { Lugar } from "../models/Lugar";
import { locaisService } from "../services/locaisService";
import { mensagemDeErro } from "../services/api";
import { toastSucesso } from "../utils/toast";
import { useBuscaLugares } from "./useBuscaLugares";
import { Erros, temErros } from "../validacoes/regras";
import { validarApelido } from "../validacoes/localValidacoes";

// Novo local: 1) buscar o lugar  2) dar um apelido e salvar
export function useNovoLocal(lugarInicial?: Lugar) {
    const busca = useBuscaLugares();

    const [escolhido, setEscolhido] = useState<Lugar | null>(lugarInicial ?? null);
    const [apelido, setApelido] = useState("");
    const [receberAlertas, setReceberAlertas] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [erros, setErros] = useState<Erros<"apelido">>({});
    const [erro, setErro] = useState<string>(); // erro que veio da API

    function escolher(lugar: Lugar) {
        setEscolhido(lugar);
        setErro(undefined);
    }

    function trocarLugar() {
        setEscolhido(null);
        setErro(undefined);
    }

    // devolve true quando salvou (a tela então volta)
    async function salvar(): Promise<boolean> {
        if (!escolhido) return false;
        const novosErros = validarApelido(apelido);
        setErros(novosErros);
        if (temErros(novosErros)) return false;

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
            setErro(mensagemDeErro(e));
            return false;
        } finally {
            setSalvando(false);
        }
    }

    return {
        busca,
        escolhido,
        escolher,
        trocarLugar,
        apelido,
        setApelido,
        receberAlertas,
        setReceberAlertas,
        salvando,
        erros,
        erro,
        salvar,
    };
}
