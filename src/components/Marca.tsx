import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// nome e frase ficam aqui, num lugar só (se o grupo mudar, muda só aqui)
export const NOME_DO_APP = "GaroAvisa";
export const FRASE_DO_APP = "previsão · alertas · dicas";

type Props = {
    variante?: "sobreCor" | "compacta";
};

export default function Marca({ variante = "sobreCor" }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    if (variante === "compacta") {
        return (
            <View style={estilos.linhaCompacta}>
                <LinearGradient
                    colors={[cores.primaria, cores.secundaria]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={estilos.iconeCompacto}
                >
                    <Ionicons name="partly-sunny" size={22} color={cores.textoSobreCor} />
                </LinearGradient>
                <Text style={estilos.nomeCompacto}>
                    Garo<Text style={estilos.destaqueCompacto}>Avisa</Text>
                </Text>
            </View>
        );
    }

    return (
        <View style={estilos.coluna}>
            {/* quadrado "de vidro": branco bem transparente com borda clarinha */}
            <View style={estilos.icone}>
                <Ionicons name="partly-sunny" size={44} color={cores.textoSobreCor} />
            </View>
            <Text style={estilos.nome}>
                Garo<Text style={estilos.nomeForte}>Avisa</Text>
            </Text>
            <Text style={estilos.frase}>{FRASE_DO_APP}</Text>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        // ---- sobreCor ----
        coluna: {
            alignItems: "center",
            gap: 6,
        },
        icone: {
            width: 84,
            height: 84,
            borderRadius: 26,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.18)",
            borderWidth: 1,
            borderColor: "rgba(255, 255, 255, 0.35)",
            marginBottom: 8,
        },
        nome: {
            fontSize: 32,
            fontWeight: "600",
            color: cores.textoSobreCor,
            letterSpacing: 0.5,
        },
        nomeForte: {
            fontWeight: "900", // "Avisa" mais grosso que "Garo"
        },
        frase: {
            fontSize: 11,
            color: cores.textoSobreCor,
            opacity: 0.85,
            letterSpacing: 2.5,
            textTransform: "uppercase", // deixa tudo em maiúsculas
        },

        // ---- compacta ----
        linhaCompacta: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        iconeCompacto: {
            width: 40,
            height: 40,
            borderRadius: 13,
            alignItems: "center",
            justifyContent: "center",
        },
        nomeCompacto: {
            fontSize: 20,
            fontWeight: "600",
            color: cores.texto,
        },
        destaqueCompacto: {
            fontWeight: "900",
            color: cores.primaria,
        },
    });
}
