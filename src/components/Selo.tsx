import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { transparente } from "../theme/cores";

// as cores que o selo aceita
export type CorDoSelo = "primaria" | "secundaria" | "sucesso" | "erro" | "alerta" | "neutro";

type Props = {
    texto: string;
    cor?: CorDoSelo;
    icone?: keyof typeof Ionicons.glyphMap;
};

export default function Selo({ texto, cor = "primaria", icone }: Props) {
    const { cores } = useTema();

    // para cada nome de cor: [cor do fundo, cor do texto]
    // amarelo e secundária usam uma cor de texto mais forte, para dar para ler
    const paleta: Record<CorDoSelo, [string, string]> = {
        primaria: [cores.primaria, cores.primaria],
        secundaria: [cores.secundaria, cores.secundariaTexto],
        sucesso: [cores.sucesso, cores.sucesso],
        erro: [cores.erro, cores.erro],
        alerta: [cores.alerta, cores.alertaTexto],
        neutro: [cores.textoSuave, cores.textoSecundario],
    };
    const [corFundo, corTexto] = paleta[cor];

    return (
        <View style={[estilos.selo, { backgroundColor: transparente(corFundo, 0.15) }]}>
            {icone && <Ionicons name={icone} size={12} color={corTexto} />}
            <Text style={[estilos.texto, { color: corTexto }]}>{texto}</Text>
        </View>
    );
}

// aqui não precisa de criarEstilos(cores): as cores vêm direto no componente
const estilos = StyleSheet.create({
    selo: {
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start", // ocupa só o tamanho do texto, não a linha toda
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 999, // bem arredondado = formato de pílula
    },
    texto: {
        fontSize: 11,
        fontWeight: "700",
    },
});
