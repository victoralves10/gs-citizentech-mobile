import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Ícone grande + título + texto + botões (lista vazia, erro, convite...)
type Props = {
    icone: keyof typeof Ionicons.glyphMap;
    titulo?: string;
    texto?: string;
    erro?: boolean; // ícone cinza em vez de azul
    semCartao?: boolean;
    children?: ReactNode; // botões
};

export default function Aviso({ icone, titulo, texto, erro, semCartao, children }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const conteudo = (
        <View style={estilos.aviso}>
            <Ionicons name={icone} size={40} color={erro ? cores.textoSuave : cores.primaria} />
            {titulo && <Text style={estilos.titulo}>{titulo}</Text>}
            {texto && <Text style={estilos.texto}>{texto}</Text>}
            {children && <View style={estilos.botoes}>{children}</View>}
        </View>
    );

    return semCartao ? conteudo : <Cartao>{conteudo}</Cartao>;
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        aviso: {
            alignItems: "center",
            gap: 10,
            paddingVertical: 8,
        },
        titulo: {
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
            color: cores.texto,
        },
        texto: {
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: cores.textoSecundario,
        },
        botoes: {
            alignSelf: "stretch",
            gap: 10,
            marginTop: 6,
        },
    });
}
