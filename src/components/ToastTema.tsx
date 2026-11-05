import { StyleSheet, Text, View } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";

export default function ToastTema() {
    const { cores } = useTema();

    // desenha um toast com a cor e o ícone de cada tipo
    function modelo(
        cor: string,
        icone: "checkmark-circle" | "close-circle" | "information-circle"
    ) {
        // a biblioteca chama esta função passando o texto do toast (text1)
        return function ToastModelo({ text1 }: { text1?: string }) {
            return (
                <View
                    style={[
                        estilos.caixa,
                        { backgroundColor: cores.superficie, borderColor: cores.borda },
                    ]}
                >
                    <Ionicons name={icone} size={22} color={cor} />
                    <Text style={[estilos.texto, { color: cores.texto }]}>{text1}</Text>
                </View>
            );
        };
    }

    // um modelo para cada tipo: success (verde), error (vermelho), info (azul)
    const config: ToastConfig = {
        success: modelo(cores.sucesso, "checkmark-circle"),
        error: modelo(cores.erro, "close-circle"),
        info: modelo(cores.primaria, "information-circle"),
    };

    return <Toast config={config} bottomOffset={90} />;
}

// estes estilos não dependem do tema (as cores entram direto no style lá em cima)
const estilos = StyleSheet.create({
    caixa: {
        width: "90%",
        flexDirection: "row", // ícone e texto lado a lado
        alignItems: "center",
        gap: 10,
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        elevation: 4, // sombra no Android
    },
    texto: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
    },
});
