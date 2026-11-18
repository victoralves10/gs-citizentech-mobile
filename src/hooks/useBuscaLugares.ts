import { useEffect, useRef, useState } from "react";
import { Lugar } from "../models/Lugar";
import { lugaresService } from "../services/lugaresService";
import { mensagemDeErro } from "../services/api";
import { ESPERA_BUSCA, MINIMO_LETRAS_BUSCA } from "../config/constantes";

// Busca de lugares por nome, esperando o usuário parar de digitar
export function useBuscaLugares() {
    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState<Lugar[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [erroBusca, setErroBusca] = useState<string>();

    // número da última busca, para ignorar respostas velhas
    const ultimoPedido = useRef(0);

    function mudarBusca(texto: string) {
        setBusca(texto);
        setBuscando(texto.trim().length >= MINIMO_LETRAS_BUSCA);
    }

    useEffect(() => {
        const texto = busca.trim();
        if (texto.length < MINIMO_LETRAS_BUSCA) {
            ultimoPedido.current++;
            return;
        }

        const espera = setTimeout(async () => {
            const pedido = ++ultimoPedido.current;
            try {
                const lugares = await lugaresService.buscar(texto);
                if (pedido !== ultimoPedido.current) return;
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

    return {
        busca,
        mudarBusca,
        resultados,
        buscando,
        erroBusca,
        buscaCurta: busca.trim().length < MINIMO_LETRAS_BUSCA,
    };
}

export type BuscaLugares = ReturnType<typeof useBuscaLugares>;
