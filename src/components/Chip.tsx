import { Pressable, StyleSheet, Text } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

// Pílula tocável que fica azul quando escolhida ("Casa", "Amanhã 18/11"...)
type Props = {
    texto: string;
    subtexto?: string;
    ativo: boolean;
    onPress: () => void;
};

export default function Chip({ texto, subtexto, ativo, onPress }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <Pressable onPress={onPress} style={[estilos.chip, ativo && estilos.chipAtivo]}>
            <Text style={[estilos.texto, ativo && estilos.textoAtivo]}>{texto}</Text>
            {subtexto && (
                <Text style={[estilos.subtexto, ativo && estilos.textoAtivo]}>{subtexto}</Text>
            )}
        </Pressable>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        chip: {
            alignItems: "center",
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        chipAtivo: {
            borderColor: cores.primaria,
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        texto: {
            fontSize: 14,
            fontWeight: "700",
            color: cores.texto,
        },
        subtexto: {
            fontSize: 12,
            color: cores.textoSecundario,
        },
        textoAtivo: {
            color: cores.primaria,
        },
    });
}
