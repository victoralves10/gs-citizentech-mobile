import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import CartaoClimaAgora from "./CartaoClimaAgora";
import Indicadores from "./Indicadores";
import { ClimaAtual, LocalResumo } from "../models/Previsao";

// Cartão azul do clima de agora + indicadores (Home, Detalhes e Pesquisa)
type Props = {
    local: LocalResumo;
    clima: ClimaAtual;
    atualizadoEm: string | null;
    completo?: boolean; // mostra todos os indicadores
    children?: ReactNode; // botão entre o cartão e os indicadores
};

export default function BlocoClima({ local, clima, atualizadoEm, completo, children }: Props) {
    return (
        <View style={estilos.bloco}>
            <CartaoClimaAgora local={local} clima={clima} atualizadoEm={atualizadoEm} />
            {children}
            <Indicadores clima={clima} completo={completo} />
        </View>
    );
}

const estilos = StyleSheet.create({
    bloco: {
        gap: 12,
    },
});
