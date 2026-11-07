import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

type Props = {
    titulo: string;
    descricao?: string;
    icone?: keyof typeof Ionicons.glyphMap;
    altura?: number; // altura da caixa (padrão 96)
};

export default function BlocoVazio({
    titulo,
    descricao = "Em breve",
    icone = "construct-outline",
    altura = 96,
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={[estilos.bloco, { minHeight: altura }]}>
            <Ionicons name={icone} size={24} color={cores.primaria} />
            <Text style={estilos.titulo}>{titulo}</Text>
            <Text style={estilos.descricao}>{descricao}</Text>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        bloco: {
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            padding: 16,
            borderRadius: 16,
            borderWidth: 1.5,
            borderStyle: "dashed", // borda tracejada = "ainda vai ter algo aqui"
            borderColor: transparente(cores.primaria, 0.35),
            backgroundColor: transparente(cores.primaria, 0.05),
        },
        titulo: {
            fontSize: 14,
            fontWeight: "700",
            color: cores.texto,
            textAlign: "center",
        },
        descricao: {
            fontSize: 12,
            color: cores.textoSuave,
        },
    });
}
