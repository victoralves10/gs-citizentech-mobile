import { StyleSheet, Text, View } from "react-native";
import Toast, { ToastConfig } from "react-native-toast-message";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";

// Visual dos toasts com as cores do tema
export default function ToastTema() {
    const { cores } = useTema();

    function modelo(
        cor: string,
        icone: "checkmark-circle" | "close-circle" | "information-circle"
    ) {
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

    const config: ToastConfig = {
        success: modelo(cores.sucesso, "checkmark-circle"),
        error: modelo(cores.erro, "close-circle"),
        info: modelo(cores.primaria, "information-circle"),
    };

    return <Toast config={config} bottomOffset={90} />;
}

const estilos = StyleSheet.create({
    caixa: {
        width: "90%",
        flexDirection: "row",
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
