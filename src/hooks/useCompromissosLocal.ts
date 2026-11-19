import { useState } from "react";
import { Compromisso } from "../models/Compromisso";
import { compromissosService } from "../services/compromissosService";
import { mensagemDeErro } from "../services/api";
import { confirmarExclusao } from "../utils/confirmar";
import { toastErro, toastSucesso } from "../utils/toast";
import { useCarregar } from "./useCarregar";
import { Erros, temErros } from "../validacoes/regras";
import { CamposCompromisso, validarCompromisso } from "../validacoes/compromissoValidacoes";

// Compromissos de um local: listar, criar, editar e excluir.
// A mesma janela cria (POST) e edita (PUT).
export function useCompromissosLocal(localId: number) {
    const { dados, carregando, recarregar } = useCarregar(() =>
        compromissosService.doLocal(localId)
    );

    // janela de criar/editar
    const [aberta, setAberta] = useState(false);
    const [editando, setEditando] = useState<Compromisso | null>(null);
    const [nome, setNome] = useState("");
    const [data, setData] = useState(""); // "2026-11-25"
    const [erros, setErros] = useState<Erros<keyof CamposCompromisso>>({});
    const [erro, setErro] = useState<string>(); // erro que veio da API
    const [salvando, setSalvando] = useState(false);

    function abrir(compromisso: Compromisso | null) {
        setEditando(compromisso);
        setNome(compromisso?.nome ?? "");
        setData(compromisso?.data.slice(0, 10) ?? "");
        setErros({});
        setErro(undefined);
        setAberta(true);
    }

    async function salvar() {
        const novosErros = validarCompromisso({ nome, data });
        setErros(novosErros);
        if (temErros(novosErros)) return;

        setErro(undefined);
        setSalvando(true);
        try {
            if (editando) {
                await compromissosService.editar(editando.id, { nome: nome.trim(), data, localId });
                toastSucesso("Compromisso atualizado!");
            } else {
                await compromissosService.criar(localId, { nome: nome.trim(), data });
                toastSucesso("Compromisso marcado!");
            }
            setAberta(false);
            recarregar();
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setSalvando(false);
        }
    }

    function excluir(compromisso: Compromisso) {
        confirmarExclusao({
            titulo: `Excluir "${compromisso.nome}"?`,
            mensagem: "O compromisso será apagado.",
            aoConfirmar: async () => {
                try {
                    await compromissosService.remover(compromisso.id);
                    toastSucesso("Compromisso excluído.");
                    recarregar();
                } catch (e) {
                    toastErro(mensagemDeErro(e));
                }
            },
        });
    }

    return {
        lista: dados ?? [],
        carregando,
        aberta,
        editando,
        nome,
        setNome,
        data,
        setData,
        erros,
        erro,
        salvando,
        abrirNovo: () => abrir(null),
        abrirEdicao: abrir,
        fechar: () => setAberta(false),
        salvar,
        excluir,
    };
}

export type CompromissosDoLocal = ReturnType<typeof useCompromissosLocal>;
