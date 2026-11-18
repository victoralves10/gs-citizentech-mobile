import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import { useTema } from "../theme/TemaContext";

// Cartão de uma linha só: ✓ "Nenhum alerta para hoje."
type Props = {
    texto: string;
    icone?: keyof typeof Ionicons.glyphMap;
};

export default function AvisoLinha({ texto, icone = "checkmark-circle" }: Props) {
    const { cores } = useTema();
    const ok = icone === "checkmark-circle";

    return (
        <Cartao>
            <View style={estilos.linha}>
                <Ionicons name={icone} size={22} color={ok ? cores.sucesso : cores.textoSuave} />
                <Text style={[estilos.texto, { color: cores.textoSecundario }]}>{texto}</Text>
            </View>
        </Cartao>
    );
}

const estilos = StyleSheet.create({
    linha: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    texto: {
        flex: 1,
        fontSize: 14,
    },
});
