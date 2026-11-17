import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Alerta } from "../models/Previsao";
import { corDaGravidade, iconeDoAlerta } from "../utils/clima";
import { dataCurta } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

type Props = {
    alerta: Alerta;
    mostrarDia?: boolean;
    local?: string; // apelido do local, quando a tela mistura locais (aba Alertas)
};

export default function CartaoAlerta({ alerta, mostrarDia = false, local }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const cor = corDaGravidade(alerta.gravidade, cores);

    // em cima do texto: "Casa · Hoje", só "Hoje" ou nada
    const detalhes = [local, mostrarDia ? dataCurta(alerta.dia) : undefined]
        .filter(Boolean)
        .join(" · ");

    return (
        <View
            style={[
                estilos.cartao,
                { borderLeftColor: cor, backgroundColor: transparente(cor, 0.1) },
            ]}
        >
            <View style={[estilos.icone, { backgroundColor: transparente(cor, 0.18) }]}>
                <Ionicons name={iconeDoAlerta(alerta.tipo)} size={20} color={cor} />
            </View>
            <View style={estilos.textos}>
                {detalhes ? <Text style={estilos.detalhes}>{detalhes}</Text> : null}
                <Text style={estilos.titulo}>{alerta.titulo}</Text>
                <Text style={estilos.descricao}>{alerta.descricao}</Text>
            </View>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        cartao: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 14,
            borderRadius: 16,
            borderLeftWidth: 5, // a faixa colorida da esquerda
        },
        icone: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
        },
        textos: {
            flex: 1,
            gap: 2,
        },
        detalhes: {
            fontSize: 12,
            fontWeight: "700",
            color: cores.textoSecundario,
        },
        titulo: {
            fontSize: 15,
            fontWeight: "800",
            color: cores.texto,
        },
        descricao: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
    });
}
