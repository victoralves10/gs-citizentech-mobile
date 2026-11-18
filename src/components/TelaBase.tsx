import { ReactNode, Ref } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    ScrollView,
    ScrollViewInstance,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTema } from "../theme/TemaContext";

// Base de toda tela: área segura, rolagem, teclado e puxar para atualizar
type Props = {
    children: ReactNode;
    rolar?: boolean;
    comCabecalho?: boolean;
    semEspaco?: boolean; // tira o espaço das bordas (só quando rolar = false)
    aoAtualizar?: () => void; // com isso, puxar a tela para baixo atualiza
    atualizando?: boolean; // mostra a rodinha do "puxar para atualizar"
    refRolagem?: Ref<ScrollViewInstance>; // deixa a tela rolar até uma seção (ex.: Detalhes)
};

export default function TelaBase({
    children,
    rolar = true,
    comCabecalho = false,
    semEspaco = false,
    aoAtualizar,
    atualizando = false,
    refRolagem,
}: Props) {
    const { cores } = useTema();

    return (
        <SafeAreaView
            edges={comCabecalho ? [] : ["top"]}
            style={[estilos.tela, { backgroundColor: cores.fundo }]}
        >
            <KeyboardAvoidingView
                style={estilos.tela}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {rolar ? (
                    <ScrollView
                        ref={refRolagem}
                        contentContainerStyle={estilos.conteudo}
                        keyboardShouldPersistTaps="handled"
                        refreshControl={
                            aoAtualizar ? (
                                <RefreshControl
                                    refreshing={atualizando}
                                    onRefresh={aoAtualizar}
                                    colors={[cores.primaria]}
                                    tintColor={cores.primaria}
                                />
                            ) : undefined
                        }
                    >
                        {children}
                    </ScrollView>
                ) : (
                    <View style={[estilos.tela, !semEspaco && estilos.conteudo]}>{children}</View>
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
