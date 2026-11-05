import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    titulo: string;
    descricao?: string;
};

export default function EmBreve({
    titulo,
    descricao = "Conteúdo desta tela em construção.",
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.container}>
            <View style={estilos.icone}>
                <Ionicons name="construct-outline" size={34} color={cores.primaria} />
            </View>
            <Text style={estilos.titulo}>{titulo}</Text>
            <Text style={estilos.descricao}>{descricao}</Text>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            padding: 24,
        },
        icone: {
            width: 72,
            height: 72,
            borderRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: cores.superficie,
            borderWidth: 1,
            borderColor: cores.borda,
        },
        titulo: {
            fontSize: 22,
            fontWeight: "bold",
            color: cores.texto,
        },
        descricao: {
            fontSize: 15,
            textAlign: "center",
            color: cores.textoSecundario,
        },
    });
}
