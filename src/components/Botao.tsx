import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Botão do app: principal (degradê) ou contorno; "pequeno" vira uma pílula
type Props = {
    texto: string;
    onPress: () => void;
    variante?: "principal" | "contorno";
    pequeno?: boolean;
    carregando?: boolean;
    desabilitado?: boolean;
    icone?: keyof typeof Ionicons.glyphMap;
};

export default function Botao({
    texto,
    onPress,
    variante = "principal",
    pequeno = false,
    carregando = false,
    desabilitado = false,
    icone,
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const bloqueado = carregando || desabilitado;
    const corDoTexto = variante === "principal" ? cores.textoSobreCor : cores.primaria;
    const tamanho = pequeno ? estilos.pequeno : estilos.normal;

    const conteudo = carregando ? (
        <ActivityIndicator color={corDoTexto} />
    ) : (
        <View style={estilos.linha}>
            {icone && <Ionicons name={icone} size={pequeno ? 18 : 20} color={corDoTexto} />}
            <Text style={[pequeno ? estilos.textoPequeno : estilos.texto, { color: corDoTexto }]}>
                {texto}
            </Text>
        </View>
    );

    if (variante === "contorno") {
        return (
            <Pressable
                onPress={onPress}
                disabled={bloqueado}
                style={[estilos.base, tamanho, estilos.contorno, bloqueado && estilos.bloqueado]}
            >
                {conteudo}
            </Pressable>
        );
    }

    return (
        <Pressable onPress={onPress} disabled={bloqueado} style={bloqueado && estilos.bloqueado}>
            <LinearGradient
                colors={[cores.primaria, cores.primariaForte]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[estilos.base, tamanho]}
            >
                {conteudo}
            </LinearGradient>
        </Pressable>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        base: {
            alignItems: "center",
            justifyContent: "center",
        },
        normal: {
            height: 52,
            borderRadius: 14,
            paddingHorizontal: 20,
        },
        pequeno: {
            height: 38,
            borderRadius: 999,
            paddingHorizontal: 14,
        },
        contorno: {
            borderWidth: 1.5,
            borderColor: cores.primaria,
        },
        bloqueado: {
            opacity: 0.6,
        },
        linha: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        texto: {
            fontSize: 16,
            fontWeight: "700",
        },
        textoPequeno: {
            fontSize: 13,
            fontWeight: "700",
        },
    });
}
