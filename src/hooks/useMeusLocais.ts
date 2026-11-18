import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LocalCard } from "../models/Local";
import { locaisService } from "../services/locaisService";
import { mensagemDeErro } from "../services/api";
import { ESPERA_BUSCA, TAMANHO_PAGINA } from "../config/constantes";
import { confirmarExclusao } from "../utils/confirmar";
import { toastErro, toastSucesso } from "../utils/toast";

type Modo = "inicio" | "busca" | "mais" | "puxar";

// Meus Locais: lista com busca, páginas, alertas, principal, apelido e exclusão
export function useMeusLocais() {
    const [locais, setLocais] = useState<LocalCard[]>([]);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalItens, setTotalItens] = useState(0);
    const [busca, setBusca] = useState("");

    const [carregando, setCarregando] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();

    // janela de trocar apelido
    const [editando, setEditando] = useState<LocalCard | null>(null);
    const [apelido, setApelido] = useState("");
    const [erroApelido, setErroApelido] = useState<string>();
    const [salvando, setSalvando] = useState(false);

    const ultimoPedido = useRef(0);

    // Lista
    const carregar = useCallback(async (paginaPedida: number, modo: Modo, texto: string) => {
        const pedido = ++ultimoPedido.current;

        if (modo === "inicio") setCarregando(true);
        if (modo === "busca") setBuscando(true);
        if (modo === "mais") setCarregandoMais(true);
        if (modo === "puxar") setAtualizando(true);

        try {
            const resposta = await locaisService.listar(texto, paginaPedida, TAMANHO_PAGINA);
            if (pedido !== ultimoPedido.current) return; // resposta velha

            // página 0 troca a lista; as outras juntam no fim
            setLocais((atual) =>
                paginaPedida === 0 ? resposta.itens : [...atual, ...resposta.itens]
            );
            setPagina(resposta.pagina);
            setTotalPaginas(resposta.totalPaginas);
            setTotalItens(resposta.totalItens);
            setErro(undefined);
        } catch (e) {
            if (pedido !== ultimoPedido.current) return;
            setErro(mensagemDeErro(e));
        } finally {
            if (pedido === ultimoPedido.current) {
                setCarregando(false);
                setBuscando(false);
                setCarregandoMais(false);
                setAtualizando(false);
            }
        }
    }, []);

    // busca esperando o usuário parar de digitar
    const jaCarregou = useRef(false);
    useEffect(() => {
        if (!jaCarregou.current) {
            jaCarregou.current = true;
            carregar(0, "inicio", busca);
            return;
        }
        const espera = setTimeout(() => carregar(0, "busca", busca), ESPERA_BUSCA);
        return () => clearTimeout(espera);
    }, [busca, carregar]);

    // voltou para a tela: atualiza
    const primeiraVez = useRef(true);
    useFocusEffect(
        useCallback(() => {
            if (primeiraVez.current) {
                primeiraVez.current = false;
                return;
            }
            carregar(0, "puxar", busca);
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    function carregarMais() {
        const temMais = pagina + 1 < totalPaginas;
        if (temMais && !carregandoMais && !carregando) {
            carregar(pagina + 1, "mais", busca);
        }
    }

    function atualizar() {
        carregar(0, "puxar", busca);
    }

    // Ações
    function trocarNaLista(atualizado: LocalCard) {
        setLocais((atual) => atual.map((l) => (l.id === atualizado.id ? atualizado : l)));
    }

    // evita mandar o mesmo PATCH duas vezes (o Switch do Android dispara repetido)
    const alertasEmAndamento = useRef(new Set<number>());

    async function alternarAlertas(local: LocalCard, ligar: boolean) {
        if (alertasEmAndamento.current.has(local.id)) return;
        alertasEmAndamento.current.add(local.id);

        trocarNaLista({ ...local, receberAlertas: ligar });
        try {
            trocarNaLista(await locaisService.alterarAlertas(local.id, ligar));
        } catch (e) {
            trocarNaLista(local);
            toastErro(mensagemDeErro(e));
        } finally {
            alertasEmAndamento.current.delete(local.id);
        }
    }

    async function mudarPrincipal(local: LocalCard) {
        try {
            await locaisService.editar(local.id, {
                apelido: local.apelido,
                receberAlertas: local.receberAlertas,
                principal: !local.principal,
            });
            toastSucesso(
                local.principal
                    ? `${local.apelido} não é mais o principal.`
                    : `${local.apelido} agora aparece na Home.`
            );
            atualizar();
        } catch (e) {
            toastErro(mensagemDeErro(e));
        }
    }

    function abrirApelido(local: LocalCard) {
        setEditando(local);
        setApelido(local.apelido);
        setErroApelido(undefined);
    }

    async function salvarApelido() {
        if (!editando) return;
        if (!apelido.trim()) return setErroApelido("Informe o apelido.");

        setSalvando(true);
        try {
            trocarNaLista(
                await locaisService.editar(editando.id, {
                    apelido: apelido.trim(),
                    receberAlertas: editando.receberAlertas,
                    principal: editando.principal,
                })
            );
            toastSucesso("Apelido atualizado!");
            setEditando(null);
        } catch (e) {
            setErroApelido(mensagemDeErro(e));
        } finally {
            setSalvando(false);
        }
    }

    function excluir(local: LocalCard) {
        confirmarExclusao({
            titulo: `Excluir ${local.apelido}?`,
            mensagem: "Os compromissos deste local também serão apagados.",
            aoConfirmar: async () => {
                try {
                    await locaisService.remover(local.id);
                    toastSucesso(`${local.apelido} foi excluído.`);
                    atualizar(); // se era o principal, outro vira principal
                } catch (e) {
                    toastErro(mensagemDeErro(e));
                }
            },
        });
    }

    return {
        locais,
        totalItens,
        busca,
        setBusca,
        carregando,
        buscando,
        carregandoMais,
        atualizando,
        erro,
        carregarMais,
        atualizar,
        alternarAlertas,
        mudarPrincipal,
        excluir,
        apelidoJanela: {
            aberta: editando !== null,
            apelido,
            setApelido,
            erro: erroApelido,
            salvando,
            abrir: abrirApelido,
            fechar: () => setEditando(null),
            salvar: salvarApelido,
        },
    };
}
