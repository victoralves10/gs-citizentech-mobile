import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { transparente } from "../theme/cores";

type NomeIcone = keyof typeof Ionicons.glyphMap;

type Props = {
    tamanho: number; // largura e altura da área (é sempre um quadrado)
    icone: NomeIcone;
    iconesExtras: [NomeIcone, NomeIcone, NomeIcone];
};

export default function IlustracaoClima({ tamanho, icone, iconesExtras }: Props) {
    const { cores } = useTema();

    // ---------- animação de "flutuar" ----------
    // useState com função cria o valor animado UMA vez só (não recria a cada desenho da tela).
    // Os colchetes [flutuar] pegam só o valor (sem o "set": quem muda o valor é a animação).
    const [flutuar] = useState(() => new Animated.Value(0));

    useEffect(() => {
        // loop: vai de 0 a 1 e volta, para sempre
        const animacao = Animated.loop(
            Animated.sequence([
                Animated.timing(flutuar, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true, // a animação roda no "lado nativo" (mais leve)
                }),
                Animated.timing(flutuar, {
                    toValue: 0,
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        );
        animacao.start();
        return () => animacao.stop(); // para a animação quando a tela some
    }, [flutuar]);

    // 0 → 1 vira 0 → -8 (sobe 8 pixels)
    const deslocamento = flutuar.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

    // ---------- medidas (tudo proporcional ao tamanho) ----------
    const anel = tamanho * 0.8;
    const centro = tamanho * 0.52;
    const bolinha = tamanho * 0.2;

    // cor de cada bolinha pequena (azul, ciano e amarelo)
    const coresExtras = [cores.primaria, cores.secundaria, cores.alerta];

    // posição de cada bolinha em volta (em cima à direita, à esquerda, embaixo à direita)
    const posicoes = [
        { top: tamanho * 0.06, right: tamanho * 0.1 },
        { top: tamanho * 0.44, left: 0 },
        { bottom: tamanho * 0.04, right: tamanho * 0.16 },
    ];

    return (
        <View style={{ width: tamanho, height: tamanho }}>
            {/* fundo: círculo bem clarinho do tamanho todo */}
            <View
                style={[
                    estilos.circulo,
                    {
                        width: tamanho,
                        height: tamanho,
                        borderRadius: tamanho / 2,
                        backgroundColor: transparente(cores.primaria, 0.06),
                    },
                ]}
            />

            {/* anel do meio */}
            <View
                style={[
                    estilos.circulo,
                    estilos.centralizado,
                    {
                        width: anel,
                        height: anel,
                        borderRadius: anel / 2,
                        top: (tamanho - anel) / 2,
                        left: (tamanho - anel) / 2,
                        backgroundColor: transparente(cores.primaria, 0.1),
                    },
                ]}
            />

            {/* círculo principal em degradê, flutuando */}
            <Animated.View
                style={[
                    estilos.circulo,
                    {
                        top: (tamanho - centro) / 2,
                        left: (tamanho - centro) / 2,
                        transform: [{ translateY: deslocamento }],
                    },
                ]}
            >
                <LinearGradient
                    colors={[cores.primaria, cores.primariaForte]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[
                        estilos.centralizado,
                        { width: centro, height: centro, borderRadius: centro / 2 },
                    ]}
                >
                    <Ionicons name={icone} size={centro * 0.46} color={cores.textoSobreCor} />
                </LinearGradient>
            </Animated.View>

            {/* as 3 bolinhas com ícones pequenos */}
            {iconesExtras.map((nome, indice) => (
                <View
                    key={nome}
                    style={[
                        estilos.circulo,
                        estilos.centralizado,
                        posicoes[indice],
                        {
                            width: bolinha,
                            height: bolinha,
                            borderRadius: bolinha / 2,
                            backgroundColor: cores.superficie,
                            borderWidth: 1,
                            borderColor: cores.borda,
                        },
                    ]}
                >
                    <Ionicons name={nome} size={bolinha * 0.48} color={coresExtras[indice]} />
                </View>
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    circulo: {
        position: "absolute", // todas as formas ficam empilhadas no mesmo quadrado
    },
    centralizado: {
        alignItems: "center",
        justifyContent: "center",
    },
});
