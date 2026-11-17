import { useEffect, useRef, useState } from "react";
import { Lugar } from "../models/Lugar";
import { lugaresService } from "../services/lugares/lugaresService";
import { mensagemDeErro } from "../services/api";

const ESPERA_BUSCA = 400; // milissegundos
const MINIMO_LETRAS = 2; // a busca só funciona com 2 letras ou mais

export function useBuscaLugares() {
    const [busca, setBusca] = useState("");
    const [resultados, setResultados] = useState<Lugar[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [erroBusca, setErroBusca] = useState<string>();

    // número da última busca (para ignorar uma resposta velha)
    const ultimoPedido = useRef(0);

    // a rodinha já aparece ao digitar (antes mesmo da espera do debounce)
    function mudarBusca(texto: string) {
        setBusca(texto);
        setBuscando(texto.trim().length >= MINIMO_LETRAS);
    }

    // toda vez que "busca" muda, espera 400 ms. Se mudar de novo antes,
    // o "return" cancela a espera anterior (clearTimeout) e começa outra.
    useEffect(() => {
        const texto = busca.trim();

        // menos de 2 letras: nem chama a busca
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

    return {
        busca,
        mudarBusca,
        resultados,
        buscando,
        erroBusca,
        buscaCurta: busca.trim().length < MINIMO_LETRAS,
    };
}
