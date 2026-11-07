import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    texto: string;
    onPress: () => void;
    variante?: "principal" | "contorno";
    carregando?: boolean;
    desabilitado?: boolean;
    icone?: keyof typeof Ionicons.glyphMap; // ícone opcional ao lado do texto
};

export default function Botao({
    texto,
    onPress,
    variante = "principal",
    carregando = false,
    desabilitado = false,
    icone,
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // o botão não responde enquanto carrega ou se estiver desabilitado
    const bloqueado = carregando || desabilitado;

    // cor da rodinha e do texto: branco no principal, cor do tema no contorno
    const corDoTexto = variante === "principal" ? cores.textoSobreCor : cores.primaria;

    // o que aparece dentro do botão: rodinha ou (ícone +) texto
    const conteudo = carregando ? (
        <ActivityIndicator color={corDoTexto} />
    ) : (
        <View style={estilos.linha}>
            {icone && <Ionicons name={icone} size={20} color={corDoTexto} />}
            <Text style={[estilos.texto, { color: corDoTexto }]}>{texto}</Text>
        </View>
    );

    // botão de contorno: sem degradê
    if (variante === "contorno") {
        return (
            <Pressable
                onPress={onPress}
                disabled={bloqueado}
                style={[estilos.base, estilos.contorno, bloqueado && estilos.bloqueado]}
            >
                {conteudo}
            </Pressable>
        );
    }

    // botão principal: com degradê da cor primária para a primária forte
    return (
        <Pressable onPress={onPress} disabled={bloqueado} style={bloqueado && estilos.bloqueado}>
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
            height: 52,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
        },
        contorno: {
            borderWidth: 1.5,
            borderColor: cores.primaria,
        },
        bloqueado: {
            opacity: 0.6, // fica meio apagado
        },
        linha: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        texto: {
            fontSize: 16,
            fontWeight: "700",
        },
    });
}
