import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    titulo: string;
    subtitulo?: string;
    acima?: string;
    direita?: ReactNode;
};

export default function CabecalhoTela({ titulo, subtitulo, acima, direita }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.linha}>
            {/* textos: flex 1 = ocupam o espaço que sobrar */}
            <View style={estilos.textos}>
                {acima && <Text style={estilos.acima}>{acima}</Text>}
                <Text style={estilos.titulo} numberOfLines={1}>
                    {titulo}
                </Text>
                {subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
            </View>
            {direita}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        linha: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            marginBottom: 8,
        },
        textos: {
            flex: 1,
            gap: 2,
        },
        acima: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
        titulo: {
            fontSize: 26,
            fontWeight: "bold",
            color: cores.texto,
        },
        subtitulo: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
    });
}
