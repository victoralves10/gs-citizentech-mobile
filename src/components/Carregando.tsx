import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";

// Rodinha de carregando: no meio da tela inteira ou dentro de uma tela
type Props = {
    texto?: string;
    telaCheia?: boolean;
};

export default function Carregando({ texto, telaCheia = false }: Props) {
    const { cores } = useTema();

    return (
        <View
            style={[
                telaCheia ? estilos.telaCheia : estilos.dentro,
                telaCheia && { backgroundColor: cores.fundo },
            ]}
        >
            <ActivityIndicator size="large" color={cores.primaria} />
            {texto && <Text style={{ color: cores.textoSecundario }}>{texto}</Text>}
        </View>
    );
}

const estilos = StyleSheet.create({
    telaCheia: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
    },
    dentro: {
        alignItems: "center",
        gap: 12,
        marginTop: 48,
    },
});
