import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    titulo: string;
    selo?: ReactNode; // ReactNode = qualquer coisa que dá para desenhar (um <Selo />, por ex.)
    textoAcao?: string;
    onAcao?: () => void;
};

export default function TituloSecao({ titulo, selo, textoAcao, onAcao }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.linha}>
            {/* lado esquerdo: título + selo */}
            <View style={estilos.esquerda}>
                <Text style={estilos.titulo}>{titulo}</Text>
                {selo}
            </View>

            {/* lado direito: a ação (só aparece se as duas props vierem) */}
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
            marginTop: 24, // separa da seção de cima
            marginBottom: 10, // separa do conteúdo de baixo
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
