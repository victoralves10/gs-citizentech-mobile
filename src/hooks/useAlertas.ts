import { useState } from "react";
import { Mudanca } from "../models/Previsao";
import { ItemAlerta } from "../components/ListaAlertas";
import { locaisService } from "../services/locaisService";
import { previsaoService } from "../services/previsaoService";
import { useCarregar } from "./useCarregar";

export type Filtro = "TODOS" | "ALERTAS" | "MUDANCAS";

// Junta os alertas e as mudanças de todos os locais com "Receber alertas" ligado
async function buscarAlertas() {
    const pagina = await locaisService.listar("", 0, 50);
    const comAlerta = pagina.itens.filter((local) => local.receberAlertas);

    // um local com erro não derruba os outros
    const respostas = await Promise.allSettled(
        comAlerta.map((local) => previsaoService.doLocal(local.id))
    );

    const alertas: ItemAlerta[] = [];
    const mudancas: Mudanca[] = [];
    respostas.forEach((resposta, i) => {
        if (resposta.status !== "fulfilled") return;
        const { id, apelido } = comAlerta[i];
        resposta.value.alertas.forEach((alerta) =>
            alertas.push({ alerta, local: { id, apelido } })
        );
        mudancas.push(...resposta.value.mudancasNaPrevisao);
    });

    // dia mais perto primeiro; no mesmo dia, ALTA antes de MEDIA
    const peso = (item: ItemAlerta) => (item.alerta.gravidade === "ALTA" ? 0 : 1);
    alertas.sort((a, b) => a.alerta.dia.localeCompare(b.alerta.dia) || peso(a) - peso(b));
    mudancas.sort((a, b) => b.registradoEm.localeCompare(a.registradoEm));

    return {
        alertas,
        mudancas,
        temLocais: pagina.itens.length > 0,
        locaisComAlerta: comAlerta.length,
    };
}

export function useAlertas() {
    const [filtro, setFiltro] = useState<Filtro>("TODOS");
    return { ...useCarregar(buscarAlertas), filtro, setFiltro };
}
