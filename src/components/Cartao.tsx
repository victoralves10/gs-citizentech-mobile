import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    children: ReactNode;
    onPress?: () => void;
    semEspaco?: boolean; // tira o espaço interno (útil para listas, que já têm o próprio espaço)
    style?: StyleProp<ViewStyle>; // estilos extras, se a tela precisar
};

export default function Cartao({ children, onPress, semEspaco = false, style }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // junta os estilos: o básico + sem espaço (se pedido) + o que veio da tela
    const estiloFinal = [estilos.cartao, semEspaco && estilos.semEspaco, style];

    // com onPress: Pressable (dá para tocar). "pressed" = o dedo está em cima.
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

    // sem onPress: uma View comum
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
            overflow: "hidden", // garante que o conteúdo respeite os cantos arredondados
        },
        pressionado: {
            opacity: 0.85, // dá um retorno visual quando o usuário toca
        },
    });
}
