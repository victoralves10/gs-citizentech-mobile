import { Pressable, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    texto: string;
    onPress: () => void;
    icone?: keyof typeof Ionicons.glyphMap;
    contorno?: boolean; // true = só a borda azul (ação secundária)
};

export default function BotaoPilula({ texto, onPress, icone, contorno = false }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const corTexto = contorno ? cores.primaria : cores.textoSobreCor;
    const conteudo = (
        <>
            {icone && <Ionicons name={icone} size={18} color={corTexto} />}
            <Text style={[estilos.texto, { color: corTexto }]}>{texto}</Text>
        </>
    );

    if (contorno) {
        return (
            <Pressable onPress={onPress} style={[estilos.base, estilos.contorno]}>
                {conteudo}
            </Pressable>
        );
    }

    return (
        <Pressable onPress={onPress}>
            <LinearGradient
                colors={[cores.primaria, cores.primariaForte]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={estilos.base}
            >
                {conteudo}
            </LinearGradient>
        </Pressable>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        base: {
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            paddingHorizontal: 14,
            height: 38,
            borderRadius: 999,
        },
        contorno: {
            borderWidth: 1.5,
            borderColor: cores.primaria,
        },
        texto: {
            fontSize: 13,
            fontWeight: "700",
        },
    });
}
