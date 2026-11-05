import { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../theme/TemaContext";

type Props = {
    children: ReactNode;
    rolar?: boolean;
};

export default function TelaBase({ children, rolar = true }: Props) {
    const { cores } = useTema();

    return (
        // SafeAreaView: deixa o conteúdo fora do relógio/câmera do celular
        <SafeAreaView style={[estilos.tela, { backgroundColor: cores.fundo }]}>
            {/* KeyboardAvoidingView: empurra o conteúdo para cima quando o teclado abre (iPhone) */}
            <KeyboardAvoidingView
                style={estilos.tela}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {rolar ? (
                    <ScrollView
                        contentContainerStyle={estilos.conteudo}
                        // deixa tocar nos botões mesmo com o teclado aberto
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View style={[estilos.tela, estilos.conteudo]}>{children}</View>
                )}
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    tela: {
        flex: 1,
    },
    conteudo: {
        flexGrow: 1,
        padding: 20,
        gap: 16,
    },
});
