import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Título de seção com selo e ação opcionais ("Ver todos")
type Props = {
    titulo: string;
    selo?: ReactNode;
    textoAcao?: string;
    onAcao?: () => void;
};

export default function TituloSecao({ titulo, selo, textoAcao, onAcao }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.linha}>
            <View style={estilos.esquerda}>
                <Text style={estilos.titulo}>{titulo}</Text>
                {selo}
            </View>

            {textoAcao && onAcao && (
                <Pressable onPress={onAcao} hitSlop={10}>
                    <Text style={estilos.acao}>{textoAcao}</Text>
                </Pressable>
            )}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        linha: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
            marginBottom: 10,
        },
        esquerda: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        titulo: {
            fontSize: 17,
            fontWeight: "700",
            color: cores.texto,
        },
        acao: {
            fontSize: 14,
            fontWeight: "600",
            color: cores.primaria,
        },
    });
}
