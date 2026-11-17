// Lista, cria, edita e exclui. A mesma janela serve para criar e editar:
// se "editando" tem um compromisso, salvar faz PUT; se não, faz POST.
import { useEffect, useState } from "react";
import { Compromisso } from "../models/Compromisso";
import { compromissosService } from "../services/compromissos/compromissosService";
import { mensagemDeErro } from "../services/api";
import { apiParaCampo, campoParaApi } from "../utils/campoData";
import { toastErro, toastSucesso } from "../utils/toast";

export function useCompromissosLocal(localId: number) {
    const [lista, setLista] = useState<Compromisso[]>([]);
    const [carregando, setCarregando] = useState(true);

    // janela de criar/editar
    const [aberta, setAberta] = useState(false);
    const [editando, setEditando] = useState<Compromisso | null>(null);
    const [nome, setNome] = useState("");
    const [data, setData] = useState(""); // "25/11/2026"
    const [erro, setErro] = useState<string>();
    const [salvando, setSalvando] = useState(false);

    // busca a lista (quando a tela abre e depois de cada mudança)
    function recarregar() {
        return compromissosService
            .doLocal(localId)
            .then(setLista)
            .catch(() => setLista([]))
            .finally(() => setCarregando(false));
    }

    useEffect(() => {
        compromissosService
            .doLocal(localId)
            .then(setLista)
            .catch(() => setLista([]))
            .finally(() => setCarregando(false));
    }, [localId]);

    function abrirNovo() {
        setEditando(null);
        setNome("");
        setData("");
        setErro(undefined);
        setAberta(true);
    }

    function abrirEdicao(compromisso: Compromisso) {
        setEditando(compromisso);
        setNome(compromisso.nome);
        setData(apiParaCampo(compromisso.data));
        setErro(undefined);
        setAberta(true);
    }

    async function salvar() {
        const dataApi = campoParaApi(data);
        if (!nome.trim()) return setErro("Dê um nome ao compromisso.");
        if (!dataApi) return setErro("Data inválida. Use DD/MM/AAAA.");

        setErro(undefined);
        setSalvando(true);
        try {
            if (editando) {
                await compromissosService.editar(editando.id, {
                    nome: nome.trim(),
                    data: dataApi,
                    localId,
                });
                toastSucesso("Compromisso atualizado!");
            } else {
                await compromissosService.criar(localId, { nome: nome.trim(), data: dataApi });
                toastSucesso("Compromisso marcado!");
            }
            setAberta(false);
            recarregar();
        } catch (e) {
            // ex.: "A data do compromisso não pode estar no passado" (vem da API)
            setErro(mensagemDeErro(e));
        } finally {
            setSalvando(false);
        }
    }

    async function excluir(compromisso: Compromisso) {
        try {
            await compromissosService.remover(compromisso.id);
            toastSucesso("Compromisso excluído.");
            recarregar();
        } catch (e) {
            toastErro(mensagemDeErro(e));
        }
    }

    return {
        lista,
        carregando,
        aberta,
        editando,
        nome,
        setNome,
        data,
        setData,
        erro,
        salvando,
        abrirNovo,
        abrirEdicao,
        fechar: () => setAberta(false),
        salvar,
        excluir,
    };
}
