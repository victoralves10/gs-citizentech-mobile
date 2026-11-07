import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Opcao<T extends string> = {
    valor: T; // o que o código usa ("claro")
    rotulo: string; // o que o usuário lê ("Claro")
};

type Props<T extends string> = {
    opcoes: Opcao<T>[];
    valor: T;
    onMudar: (novo: T) => void;
};

export default function Segmentado<T extends string>({ opcoes, valor, onMudar }: Props<T>) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.barra}>
            {opcoes.map((opcao) => {
                const marcada = opcao.valor === valor;
                return (
                    <Pressable
                        key={opcao.valor}
                        onPress={() => onMudar(opcao.valor)}
                        style={[estilos.opcao, marcada && estilos.opcaoMarcada]}
                    >
                        <Text style={[estilos.texto, marcada && estilos.textoMarcado]}>
                            {opcao.rotulo}
                        </Text>
                    </Pressable>
                );
            })}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        barra: {
            flexDirection: "row",
            backgroundColor: cores.fundoSegmentado,
            borderRadius: 12,
            padding: 4,
        },
        opcao: {
            flex: 1, // todas as opções com a mesma largura
            alignItems: "center",
            paddingVertical: 9,
            borderRadius: 9,
        },
        opcaoMarcada: {
            backgroundColor: cores.superficie,
        },
        texto: {
            fontSize: 14,
            fontWeight: "500",
            color: cores.textoSecundario,
        },
        textoMarcado: {
            fontWeight: "700",
            color: cores.texto,
        },
    });
}
