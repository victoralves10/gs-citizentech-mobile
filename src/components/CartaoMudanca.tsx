import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import { Mudanca } from "../models/Previsao";
import { corDaGravidade, iconeDoAlerta, iconeDoClima, nomeDoAlerta } from "../utils/clima";
import { dataCurta, tempoAtras } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Cartão do "O que mudou": antes → agora ou um alerta novo
type Props = {
    mudanca: Mudanca;
    onPress?: () => void;
};

export default function CartaoMudanca({ mudanca, onPress }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <Cartao onPress={onPress}>
            <View style={estilos.topo}>
                <Text style={estilos.local} numberOfLines={1}>
                    {mudanca.localApelido} · {dataCurta(mudanca.dia)}
                </Text>
                <Text style={estilos.quando}>{tempoAtras(mudanca.registradoEm)}</Text>
            </View>

            {mudanca.motivo === "ALERTA" ? (
                // Surgiu um alerta
                <View style={estilos.linha}>
                    <Ionicons
                        name={iconeDoAlerta(mudanca.tipoAlerta)}
                        size={20}
                        color={corDaGravidade(mudanca.gravidadeAlerta, cores)}
                    />
                    <Text style={estilos.texto}>
                        Novo alerta: {nomeDoAlerta(mudanca.tipoAlerta)}
                        {mudanca.gravidadeAlerta === "ALTA" ? " (forte)" : ""}
                    </Text>
                </View>
            ) : (
                // Antes → agora
                <View style={estilos.linha}>
                    <Ionicons
                        name={iconeDoClima(mudanca.categoriaAnterior)}
                        size={18}
                        color={cores.textoSuave}
                    />
                    <Text style={estilos.antes}>{mudanca.anterior}</Text>
                    <Ionicons name="arrow-forward" size={16} color={cores.textoSuave} />
                    <Ionicons
                        name={iconeDoClima(mudanca.categoriaAtual)}
                        size={18}
                        color={cores.primaria}
                    />
                    <Text style={estilos.agora}>{mudanca.atualizada}</Text>
                </View>
            )}
        </Cartao>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        topo: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 8,
        },
        local: {
            flex: 1,
            fontSize: 13,
            fontWeight: "700",
            color: cores.textoSecundario,
        },
        quando: {
            fontSize: 12,
            color: cores.textoSuave,
        },
        linha: {
            flexDirection: "row",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 6,
        },
        texto: {
            flex: 1,
            fontSize: 15,
            fontWeight: "700",
            color: cores.texto,
        },
        antes: {
            fontSize: 15,
            color: cores.textoSecundario,
            textDecorationLine: "line-through", // riscado: era assim, não é mais
        },
        agora: {
            fontSize: 15,
            fontWeight: "800",
            color: cores.texto,
        },
    });
}
