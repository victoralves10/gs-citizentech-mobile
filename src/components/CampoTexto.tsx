import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Campo de formulário com rótulo, ícone, erro e olho de senha
type Props = TextInputProps & {
    rotulo: string;
    icone?: keyof typeof Ionicons.glyphMap;
    erro?: string;
    senha?: boolean;
    alto?: boolean; // caixa grande, para texto de várias linhas
};

export default function CampoTexto({
    rotulo,
    icone,
    erro,
    senha = false,
    alto = false,
    ...resto
}: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const corDaBorda = erro ? cores.erro : cores.borda;

    return (
        <View style={estilos.container}>
            <Text style={estilos.rotulo}>{rotulo}</Text>

            <View style={[estilos.caixa, alto && estilos.caixaAlta, { borderColor: corDaBorda }]}>
                {icone && <Ionicons name={icone} size={20} color={cores.textoSuave} />}

                <TextInput
                    style={[estilos.input, alto && estilos.inputAlto]}
                    multiline={alto}
                    placeholderTextColor={cores.textoSuave}
                    secureTextEntry={senha && !senhaVisivel}
                    {...resto}
                />

                {senha && (
                    <Pressable onPress={() => setSenhaVisivel(!senhaVisivel)} hitSlop={10}>
                        <Ionicons
                            name={senhaVisivel ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color={cores.textoSuave}
                        />
                    </Pressable>
                )}
            </View>

            {erro && <Text style={estilos.erro}>{erro}</Text>}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        container: {
            width: "100%",
            gap: 6,
        },
        rotulo: {
            fontSize: 14,
            fontWeight: "600",
            color: cores.texto,
        },
        caixa: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 14,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            backgroundColor: cores.superficie,
        },
        caixaAlta: {
            height: 120,
            alignItems: "flex-start",
            paddingVertical: 12,
        },
        input: {
            flex: 1,
            fontSize: 15,
            color: cores.texto,
        },
        inputAlto: {
            height: "100%",
            textAlignVertical: "top", // no Android, o texto começa em cima (e não no meio)
        },
        erro: {
            fontSize: 13,
            color: cores.erro,
        },
    });
}
