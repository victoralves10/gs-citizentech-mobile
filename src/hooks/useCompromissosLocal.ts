// Lista, cria, edita e exclui os compromissos de um local (usado nos Detalhes).
// A mesma janela serve para criar e editar: com "editando" faz PUT, sem faz POST.
import { useEffect, useState } from "react";
import { Compromisso } from "../models/Compromisso";
import { compromissosService } from "../services/compromissos/compromissosService";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";

export function useCompromissosLocal(localId: number) {
    const [lista, setLista] = useState<Compromisso[]>([]);
    const [carregando, setCarregando] = useState(true);

    // janela de criar/editar
    const [aberta, setAberta] = useState(false);
    const [editando, setEditando] = useState<Compromisso | null>(null);
    const [nome, setNome] = useState("");
    const [data, setData] = useState(""); // formato da API: "2026-11-25"
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
        setData(compromisso.data.slice(0, 10)); // "2026-11-25T00:00:00" → "2026-11-25"
        setErro(undefined);
        setAberta(true);
    }

    async function salvar() {
        if (!nome.trim()) return setErro("Dê um nome ao compromisso.");
        if (!data) return setErro("Escolha a data do compromisso.");

        setErro(undefined);
        setSalvando(true);
        try {
            if (editando) {
                await compromissosService.editar(editando.id, {
                    nome: nome.trim(),
                    data,
                    localId,
                });
                toastSucesso("Compromisso atualizado!");
            } else {
                await compromissosService.criar(localId, { nome: nome.trim(), data });
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

// o tipo do que o hook devolve (a SecaoCompromissos recebe isso pronto)
export type CompromissosDoLocal = ReturnType<typeof useCompromissosLocal>;
