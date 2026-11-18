import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Caixa branca com borda e cantos arredondados (tocável se tiver onPress)
type Props = {
    children: ReactNode;
    onPress?: () => void;
    semEspaco?: boolean; // sem espaço interno (para listas)
    style?: StyleProp<ViewStyle>;
};

export default function Cartao({ children, onPress, semEspaco = false, style }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const estiloFinal = [estilos.cartao, semEspaco && estilos.semEspaco, style];

    if (onPress) {
        return (
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [estiloFinal, pressed && estilos.pressionado]}
            >
                {children}
            </Pressable>
        );
    }

    return <View style={estiloFinal}>{children}</View>;
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        cartao: {
            backgroundColor: cores.superficie,
            borderWidth: 1,
            borderColor: cores.borda,
            borderRadius: 16,
            padding: 16,
        },
        semEspaco: {
            padding: 0,
            overflow: "hidden",
        },
        pressionado: {
            opacity: 0.85,
        },
    });
}
