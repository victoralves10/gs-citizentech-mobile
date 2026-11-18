import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Linha de lista: ícone, título, descrição e algo à direita (ou ›)
type Props = {
    titulo: string;
    descricao?: string;
    icone?: keyof typeof Ionicons.glyphMap;
    direita?: ReactNode;
    onPress?: () => void;
    divisor?: boolean;
    perigo?: boolean;
    desabilitado?: boolean;
};

export default function ItemLista({
    titulo,
    descricao,
    icone,
    direita,
    onPress,
    divisor = false,
    perigo = false,
    desabilitado = false,
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const corTitulo = perigo ? cores.erro : cores.texto;
    const corIcone = perigo ? cores.erro : cores.textoSecundario;

    const mostrarSeta = !!onPress && !direita && !perigo;

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress || desabilitado}
            style={({ pressed }) => [
                estilos.linha,
                divisor && estilos.divisor,
                pressed && estilos.pressionado,
                desabilitado && estilos.desabilitado,
            ]}
        >
            {icone && <Ionicons name={icone} size={22} color={corIcone} />}

            <View style={estilos.textos}>
                <Text style={[estilos.titulo, { color: corTitulo }, perigo && estilos.negrito]}>
                    {titulo}
                </Text>
                {descricao && <Text style={estilos.descricao}>{descricao}</Text>}
            </View>

            {direita}
            {mostrarSeta && <Ionicons name="chevron-forward" size={20} color={cores.textoSuave} />}
        </Pressable>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        linha: {
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            paddingVertical: 14,
            paddingHorizontal: 16,
            minHeight: 54,
        },
        divisor: {
            borderTopWidth: StyleSheet.hairlineWidth,
            borderTopColor: cores.borda,
        },
        pressionado: {
            backgroundColor: cores.fundo,
        },
        desabilitado: {
            opacity: 0.5,
        },
        textos: {
            flex: 1,
            gap: 2,
        },
        titulo: {
            fontSize: 15,
        },
        negrito: {
            fontWeight: "600",
        },
        descricao: {
            fontSize: 12,
            color: cores.textoSecundario,
        },
    });
}
