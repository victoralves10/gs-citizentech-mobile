import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { transparente } from "../theme/cores";

export type CorDoSelo = "primaria" | "secundaria" | "sucesso" | "erro" | "alerta" | "neutro";

// Pílula pequena colorida ("Principal", "Expo Go"...)
type Props = {
    texto: string;
    cor?: CorDoSelo;
    icone?: keyof typeof Ionicons.glyphMap;
    centralizado?: boolean;
};

export default function Selo({ texto, cor = "primaria", icone, centralizado = false }: Props) {
    const { cores } = useTema();

    // [fundo, texto] de cada cor
    const paleta: Record<CorDoSelo, [string, string]> = {
        primaria: [cores.primaria, cores.primaria],
        secundaria: [cores.secundaria, cores.secundariaTexto],
        sucesso: [cores.sucesso, cores.sucesso],
        erro: [cores.erro, cores.erro],
        alerta: [cores.alerta, cores.alertaTexto],
        neutro: [cores.textoSuave, cores.textoSecundario],
    };
    const [corFundo, corTexto] = paleta[cor];

    return (
        <View
            style={[
                estilos.selo,
                centralizado && estilos.centralizado,
                { backgroundColor: transparente(corFundo, 0.15) },
            ]}
        >
            {icone && <Ionicons name={icone} size={12} color={corTexto} />}
            <Text style={[estilos.texto, { color: corTexto }]}>{texto}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    selo: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999,
    },
    centralizado: {
        alignSelf: "center",
    },
    texto: {
        fontSize: 11,
        fontWeight: "700",
    },
});
