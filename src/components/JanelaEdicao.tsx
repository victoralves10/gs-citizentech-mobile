import { ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Botao from "./Botao";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Janela que sobe de baixo com campos e os botões Cancelar/Salvar
type Props = {
    visivel: boolean;
    titulo: string;
    children: ReactNode;
    onFechar: () => void;
    onSalvar: () => void;
    erro?: string; // mensagem vermelha embaixo dos campos
    salvando?: boolean; // mostra a rodinha no botão Salvar
    textoSalvar?: string; // padrão: "Salvar"
};

export default function JanelaEdicao({
    visivel,
    titulo,
    children,
    onFechar,
    onSalvar,
    erro,
    salvando = false,
    textoSalvar = "Salvar",
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const { bottom } = useSafeAreaInsets();

    return (
        <Modal
            visible={visivel}
            transparent
            animationType="slide"
            onRequestClose={onFechar} // botão "voltar" do Android
        >
            <KeyboardAvoidingView style={estilos.fundo} behavior="padding">
                <Pressable style={estilos.areaFora} onPress={salvando ? undefined : onFechar} />

                <View style={[estilos.gaveta, { paddingBottom: 20 + bottom }]}>
                    <View style={estilos.puxador} />
                    <Text style={estilos.titulo}>{titulo}</Text>

                    <View style={estilos.campos}>{children}</View>

                    {erro && <Text style={estilos.erro}>{erro}</Text>}

                    <View style={estilos.botoes}>
                        <View style={estilos.botao}>
                            <Botao
                                texto="Cancelar"
                                variante="contorno"
                                onPress={onFechar}
                                desabilitado={salvando}
                            />
                        </View>
                        <View style={estilos.botao}>
                            <Botao texto={textoSalvar} onPress={onSalvar} carregando={salvando} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        fundo: {
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.45)",
        },
        areaFora: {
            flex: 1,
        },
        gaveta: {
            backgroundColor: cores.fundo,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            paddingHorizontal: 20,
            paddingTop: 10,
            gap: 16,
        },
        puxador: {
            alignSelf: "center",
            width: 40,
            height: 5,
            borderRadius: 3,
            backgroundColor: cores.borda,
        },
        titulo: {
            fontSize: 20,
            fontWeight: "800",
            color: cores.texto,
        },
        campos: {
            gap: 14,
        },
        erro: {
            fontSize: 14,
            color: cores.erro,
        },
        botoes: {
            flexDirection: "row",
            gap: 12,
        },
        botao: {
            flex: 1,
        },
    });
}
