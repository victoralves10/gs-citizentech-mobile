// Fileira de botões de atalho (ícone + texto)
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

export type Atalho = {
    rotulo: string;
    icone: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
};

type Props = {
    itens: Atalho[];
};

export default function Atalhos({ itens }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.linha}>
            {itens.map((item) => (
                <Pressable
                    key={item.rotulo}
                    onPress={item.onPress}
                    style={({ pressed }) => [estilos.botao, pressed && estilos.apertado]}
                >
                    <View style={estilos.circulo}>
                        <Ionicons name={item.icone} size={22} color={cores.primaria} />
                    </View>
                    <Text style={estilos.rotulo} numberOfLines={1}>
                        {item.rotulo}
                    </Text>
                </Pressable>
            ))}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        linha: {
            flexDirection: "row",
            gap: 10,
        },
        botao: {
            flex: 1,
            alignItems: "center",
            gap: 6,
            paddingVertical: 12,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        apertado: {
            opacity: 0.6,
        },
        circulo: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        rotulo: {
            fontSize: 12,
            fontWeight: "600",
            color: cores.texto,
        },
    });
}
