import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";

type Props = {
    texto?: string;
};

export default function Carregando({ texto = "Carregando..." }: Props) {
    const { cores } = useTema();

    return (
        <View style={[estilos.container, { backgroundColor: cores.fundo }]}>
            <ActivityIndicator size="large" color={cores.primaria} />
            <Text style={{ color: cores.textoSecundario }}>{texto}</Text>
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
});
