import { useEffect, useState } from "react";
import { Animated, Easing, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { transparente } from "../theme/cores";

type NomeIcone = keyof typeof Ionicons.glyphMap;

// Ilustração animada das páginas da apresentação
type Props = {
    tamanho: number;
    icone: NomeIcone;
    iconesExtras: [NomeIcone, NomeIcone, NomeIcone];
};

export default function IlustracaoClima({ tamanho, icone, iconesExtras }: Props) {
    const { cores } = useTema();

    // Animação de flutuar
    const [flutuar] = useState(() => new Animated.Value(0));

    useEffect(() => {
        const animacao = Animated.loop(
            Animated.sequence([
                Animated.timing(flutuar, {
                    toValue: 1,
                    duration: 1800,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
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
        return () => animacao.stop();
    }, [flutuar]);

    const deslocamento = flutuar.interpolate({ inputRange: [0, 1], outputRange: [0, -8] });

    // Medidas
    const anel = tamanho * 0.8;
    const centro = tamanho * 0.52;
    const bolinha = tamanho * 0.2;

    const coresExtras = [cores.primaria, cores.secundaria, cores.alerta];

    const posicoes = [
        { top: tamanho * 0.06, right: tamanho * 0.1 },
        { top: tamanho * 0.44, left: 0 },
        { bottom: tamanho * 0.04, right: tamanho * 0.16 },
    ];

    return (
        <View style={{ width: tamanho, height: tamanho }}>
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
        position: "absolute",
    },
    centralizado: {
        alignItems: "center",
        justifyContent: "center",
    },
});
