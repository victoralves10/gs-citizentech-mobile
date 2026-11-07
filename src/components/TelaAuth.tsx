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

type Props = {
    titulo: string;
    subtitulo: string;
    children: ReactNode; // o conteúdo do cartão (campos, botão, link)
    rodape?: ReactNode; // algo para mostrar embaixo do cartão
    onVoltar?: () => void; // se vier, aparece a setinha de voltar no topo
};

export default function TelaAuth({ titulo, subtitulo, children, rodape, onVoltar }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // "insets" = o tamanho das áreas que o celular ocupa (relógio, câmera, barra de baixo).
    // Aqui a gente usa para o topo azul ir até em cima, mas o conteúdo não ficar embaixo do relógio.
    const insets = useSafeAreaInsets();

    return (
        <View style={estilos.tela}>
            {/* em cima do azul, os ícones do relógio/bateria ficam brancos */}
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
                    {/* ---------- TOPO AZUL ---------- */}
                    <LinearGradient
                        colors={[cores.primaria, cores.primariaForte]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[estilos.topo, { paddingTop: insets.top + 36 }]}
                    >
                        {/* enfeites: "bolhas de luz" e nuvens (só decoração) */}
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

                        {/* setinha de voltar (só no Cadastro) */}
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

                    {/* ---------- CARTÃO DO FORMULÁRIO ---------- */}
                    <View style={estilos.cartao}>
                        <View style={estilos.textos}>
                            <Text style={estilos.titulo}>{titulo}</Text>
                            <Text style={estilos.subtitulo}>{subtitulo}</Text>
                        </View>
                        {children}
                    </View>

                    {/* ---------- RODAPÉ ---------- */}
                    {rodape && <View style={estilos.rodape}>{rodape}</View>}
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

        // topo azul
        topo: {
            flexGrow: 1, // o topo "estica" e ocupa o espaço que sobrar: nada de buraco embaixo
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

        // cartão do formulário
        cartao: {
            marginHorizontal: 20,
            marginTop: -52, // número negativo = sobe por cima do topo azul
            padding: 22,
            gap: 16,
            borderRadius: 28,
            backgroundColor: cores.superficie,
            borderWidth: 1,
            borderColor: cores.borda,
            // sombra (iPhone usa shadow*, Android usa elevation)
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
        rodape: {
            paddingTop: 20,
            alignItems: "center",
        },
    });
}
