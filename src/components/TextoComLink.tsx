import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Texto com um link no fim ("Não tem conta? Cadastre-se")
type Props = {
    texto: string;
    link: string;
    onPress: () => void;
};

export default function TextoComLink({ texto, link, onPress }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.linha}>
            <Text style={estilos.texto}>{texto}</Text>
            <Pressable onPress={onPress} hitSlop={10}>
                <Text style={estilos.link}>{link}</Text>
            </Pressable>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        linha: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            gap: 6,
        },
        texto: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
        link: {
            fontSize: 14,
            fontWeight: "700",
            color: cores.primaria,
        },
    });
}
