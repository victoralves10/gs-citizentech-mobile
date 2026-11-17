import { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { LocalCard } from "../models/Local";
import { locaisService } from "../services/locais/locaisService";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";

// quantos locais vêm por página
const TAMANHO_PAGINA = 10;

// quanto tempo esperar o usuário parar de digitar (em milissegundos)
const ESPERA_BUSCA = 400;

type Modo = "inicio" | "busca" | "mais" | "puxar";

export function useMeusLocais() {
    // ---------- a lista ----------
    const [locais, setLocais] = useState<LocalCard[]>([]);
    const [pagina, setPagina] = useState(0);
    const [totalPaginas, setTotalPaginas] = useState(0);
    const [totalItens, setTotalItens] = useState(0);
    const [busca, setBusca] = useState("");

    // ---------- estados de carregamento ----------
    const [carregando, setCarregando] = useState(true);
    const [buscando, setBuscando] = useState(false);
    const [carregandoMais, setCarregandoMais] = useState(false);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();

    const ultimoPedido = useRef(0);

    // ---------- buscar uma página na API ----------
    const carregar = useCallback(async (paginaPedida: number, modo: Modo, texto: string) => {
        const pedido = ++ultimoPedido.current;

        if (modo === "inicio") setCarregando(true);
        if (modo === "busca") setBuscando(true);
        if (modo === "mais") setCarregandoMais(true);
        if (modo === "puxar") setAtualizando(true);

        try {
            const resposta = await locaisService.listar(texto, paginaPedida, TAMANHO_PAGINA);
            if (pedido !== ultimoPedido.current) return; // resposta velha: ignora

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

    // ---------- busca com debounce ----------
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

    // ---------- voltou para a tela: atualiza ----------
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

    // ---------- rolagem infinita e "puxar para atualizar" ----------
    function carregarMais() {
        const temMais = pagina + 1 < totalPaginas;
        if (temMais && !carregandoMais && !carregando) {
            carregar(pagina + 1, "mais", busca);
        }
    }

    function atualizar() {
        carregar(0, "puxar", busca);
    }

    // ---------- ações ----------

    // troca um local da lista pelo que a API devolveu
    function trocarNaLista(atualizado: LocalCard) {
        setLocais((atual) => atual.map((l) => (l.id === atualizado.id ? atualizado : l)));
    }

    const alertasEmAndamento = useRef(new Set<number>());

    async function alternarAlertas(local: LocalCard, ligar: boolean) {
        if (alertasEmAndamento.current.has(local.id)) return; // já está salvando
        alertasEmAndamento.current.add(local.id);

        trocarNaLista({ ...local, receberAlertas: ligar });
        try {
            trocarNaLista(await locaisService.alterarAlertas(local.id, ligar));
        } catch (e) {
            trocarNaLista(local); // deu erro: volta como estava
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
            carregar(0, "puxar", busca);
        } catch (e) {
            toastErro(mensagemDeErro(e));
        }
    }

    // trocar o apelido. Se der erro (ex.: apelido repetido), o erro "sobe"
    // para a tela mostrar dentro da janela.
    async function renomear(local: LocalCard, apelido: string) {
        const atualizado = await locaisService.editar(local.id, {
            apelido: apelido.trim(),
            receberAlertas: local.receberAlertas,
            principal: local.principal,
        });
        trocarNaLista(atualizado);
        toastSucesso("Apelido atualizado!");
    }

    // excluir. Recarrega porque, se era o principal, outro vira principal.
    async function excluir(local: LocalCard) {
        try {
            await locaisService.remover(local.id);
            toastSucesso(`${local.apelido} foi excluído.`);
            carregar(0, "puxar", busca);
        } catch (e) {
            toastErro(mensagemDeErro(e));
        }
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
        renomear,
        excluir,
    };
}
