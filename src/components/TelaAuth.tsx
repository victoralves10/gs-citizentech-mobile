import { ReactNode } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import Marca from "./Marca";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Layout do Login e do Cadastro: topo azul + cartão do formulário
type Props = {
    titulo: string;
    subtitulo: string;
    children: ReactNode;
    onVoltar?: () => void; // se vier, aparece a setinha de voltar no topo
};

export default function TelaAuth({ titulo, subtitulo, children, onVoltar }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const insets = useSafeAreaInsets();

    return (
        <View style={estilos.tela}>
            <StatusBar style="light" />

            <KeyboardAvoidingView
                style={estilos.tela}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={[
                        estilos.conteudo,
                        { paddingBottom: insets.bottom + 24 },
                    ]}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Topo azul */}
                    <LinearGradient
                        colors={[cores.primaria, cores.primariaForte]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[estilos.topo, { paddingTop: insets.top + 36 }]}
                    >
                        <View style={[estilos.bolha, estilos.bolhaGrande]} />
                        <View style={[estilos.bolha, estilos.bolhaPequena]} />
                        <Ionicons
                            name="cloud"
                            size={64}
                            color="rgba(255, 255, 255, 0.14)"
                            style={estilos.nuvemEsquerda}
                        />
                        <Ionicons
                            name="cloud"
                            size={40}
                            color="rgba(255, 255, 255, 0.18)"
                            style={estilos.nuvemDireita}
                        />

                        {onVoltar && (
                            <Pressable
                                onPress={onVoltar}
                                hitSlop={10}
                                style={[estilos.voltar, { top: insets.top + 12 }]}
                            >
                                <Ionicons
                                    name="chevron-back"
                                    size={22}
                                    color={cores.textoSobreCor}
                                />
                            </Pressable>
                        )}

                        <Marca />
                    </LinearGradient>

                    {/* Formulário */}
                    <View style={estilos.cartao}>
                        <View style={estilos.textos}>
                            <Text style={estilos.titulo}>{titulo}</Text>
                            <Text style={estilos.subtitulo}>{subtitulo}</Text>
                        </View>
                        {children}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        tela: {
            flex: 1,
            backgroundColor: cores.fundo,
        },
        conteudo: {
            flexGrow: 1,
        },

        topo: {
            flexGrow: 1,
            minHeight: 300,
            justifyContent: "center",
            alignItems: "center",
            paddingBottom: 76, // espaço que o cartão vai "cobrir" ao subir
            borderBottomLeftRadius: 36,
            borderBottomRightRadius: 36,
            overflow: "hidden", // corta as bolhas que passam da borda
        },
        bolha: {
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.10)",
        },
        bolhaGrande: {
            width: 260,
            height: 260,
            borderRadius: 130,
            top: -90,
            right: -80,
        },
        bolhaPequena: {
            width: 160,
            height: 160,
            borderRadius: 80,
            bottom: -60,
            left: -50,
        },
        nuvemEsquerda: {
            position: "absolute",
            left: 24,
            top: "42%",
        },
        nuvemDireita: {
            position: "absolute",
            right: 34,
            bottom: 92,
        },
        voltar: {
            position: "absolute",
            left: 16,
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
        },

        cartao: {
            marginHorizontal: 20,
            marginTop: -52,
            padding: 22,
            gap: 16,
            borderRadius: 28,
            backgroundColor: cores.superficie,
            borderWidth: 1,
            borderColor: cores.borda,
            shadowColor: "#000000",
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 4,
        },
        textos: {
            gap: 4,
            marginBottom: 4,
        },
        titulo: {
            fontSize: 24,
            fontWeight: "800",
            color: cores.texto,
        },
        subtitulo: {
            fontSize: 15,
            color: cores.textoSecundario,
        },
    });
}
