import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Dica } from "../models/Previsao";
import { iconeDaDica } from "../utils/clima";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

// Dicas do dia em pílulas (guarda-chuva, protetor...)
type Props = {
    dicas: Dica[];
};

export default function ChipsDicas({ dicas }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.chips}>
            {dicas.map((dica) => (
                <View key={dica.tipo} style={estilos.chip}>
                    <Ionicons
                        name={iconeDaDica(dica.tipo)}
                        size={16}
                        color={cores.secundariaTexto}
                    />
                    <Text style={estilos.texto}>{dica.texto}</Text>
                </View>
            ))}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        chips: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
        },
        chip: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 999,
            backgroundColor: transparente(cores.secundaria, 0.14),
        },
        texto: {
            fontSize: 14,
            fontWeight: "600",
            color: cores.secundariaTexto,
        },
    });
}
