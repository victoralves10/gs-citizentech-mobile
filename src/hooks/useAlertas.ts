// Junta os alertas e as mudanças de todos os locais com "Receber alertas" ligado.
// Busca a previsão de cada local ao mesmo tempo (GET /locais/{id}/previsao).
import { useCallback, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { Alerta, Mudanca } from "../models/Previsao";
import { locaisService } from "../services/locais/locaisService";
import { previsaoService } from "../services/previsao/previsaoService";
import { mensagemDeErro } from "../services/api";

export type AlertaDoLocal = {
    chave: string;
    alerta: Alerta;
    localId: number;
    apelido: string;
};

export type Filtro = "TODOS" | "ALERTAS" | "MUDANCAS";

type Dados = {
    alertas: AlertaDoLocal[];
    mudancas: Mudanca[];
    temLocais: boolean;
    locaisComAlerta: number;
};

export function useAlertas() {
    const [dados, setDados] = useState<Dados | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [atualizando, setAtualizando] = useState(false);
    const [erro, setErro] = useState<string>();
    const [filtro, setFiltro] = useState<Filtro>("TODOS");
    const jaCarregou = useRef(false);

    const carregar = useCallback(async (puxou: boolean) => {
        if (puxou) setAtualizando(true);
        else if (!jaCarregou.current) setCarregando(true);

        try {
            const pagina = await locaisService.listar("", 0, 50);
            const comAlerta = pagina.itens.filter((l) => l.receberAlertas);

            // um local com erro não derruba os outros
            const respostas = await Promise.allSettled(
                comAlerta.map((l) => previsaoService.doLocal(l.id))
            );

            const alertas: AlertaDoLocal[] = [];
            const mudancas: Mudanca[] = [];
            respostas.forEach((r, i) => {
                if (r.status !== "fulfilled") return;
                const local = comAlerta[i];
                r.value.alertas.forEach((alerta, j) =>
                    alertas.push({
                        chave: `${local.id}-${alerta.id ?? j}`,
                        alerta,
                        localId: local.id,
                        apelido: local.apelido,
                    })
                );
                mudancas.push(...r.value.mudancasNaPrevisao);
            });

            // dia mais perto primeiro; no mesmo dia, ALTA antes de MEDIA
            alertas.sort(
                (a, b) =>
                    a.alerta.dia.localeCompare(b.alerta.dia) ||
                    (a.alerta.gravidade === "ALTA" ? -1 : 0) -
                        (b.alerta.gravidade === "ALTA" ? -1 : 0)
            );
            // mudança mais recente primeiro
            mudancas.sort((a, b) => b.registradoEm.localeCompare(a.registradoEm));

            setDados({
                alertas,
                mudancas,
                temLocais: pagina.itens.length > 0,
                locaisComAlerta: comAlerta.length,
            });
            setErro(undefined);
            jaCarregou.current = true;
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setCarregando(false);
            setAtualizando(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            carregar(false);
        }, [carregar])
    );

    return {
        dados,
        carregando,
        atualizando,
        erro,
        filtro,
        setFiltro,
        atualizar: () => carregar(true),
    };
}
