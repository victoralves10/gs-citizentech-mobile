import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = TextInputProps & {
    rotulo: string;
    icone?: keyof typeof Ionicons.glyphMap; // o "?" quer dizer que é opcional
    erro?: string;
    senha?: boolean;
};

export default function CampoTexto({ rotulo, icone, erro, senha = false, ...resto }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // controla se a senha está visível. Começa escondida.
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    // a borda fica vermelha quando tem erro
    const corDaBorda = erro ? cores.erro : cores.borda;

    return (
        <View style={estilos.container}>
            <Text style={estilos.rotulo}>{rotulo}</Text>

            <View style={[estilos.caixa, { borderColor: corDaBorda }]}>
                {/* ícone da esquerda (só aparece se foi passado) */}
                {icone && <Ionicons name={icone} size={20} color={cores.textoSuave} />}

                <TextInput
                    style={estilos.input}
                    placeholderTextColor={cores.textoSuave}
                    // se for senha e não estiver visível, mostra bolinhas
                    secureTextEntry={senha && !senhaVisivel}
                    // "...resto" repassa todas as outras props (value, onChangeText...)
                    {...resto}
                />

                {/* olho para mostrar/esconder (só em campo de senha) */}
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

            {/* mensagem de erro (só aparece se existir) */}
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
        input: {
            flex: 1, // ocupa todo o espaço que sobra entre os ícones
            fontSize: 15,
            color: cores.texto,
        },
        erro: {
            fontSize: 13,
            color: cores.erro,
        },
    });
}
