import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Cartao from "./Cartao";
import ItemLista from "./ItemLista";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

export type Opcao = {
    titulo: string;
    icone: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
    perigo?: boolean;
};

type Props = {
    visivel: boolean;
    titulo: string;
    subtitulo?: string;
    opcoes: Opcao[];
    onFechar: () => void;
};

export default function MenuOpcoes({ visivel, titulo, subtitulo, opcoes, onFechar }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const { bottom } = useSafeAreaInsets();

    // fecha o menu e DEPOIS roda a ação (assim um Alert ou outra janela
    // não abre por cima do menu que ainda está fechando)
    function escolher(opcao: Opcao) {
        onFechar();
        setTimeout(opcao.onPress, 250);
    }

    return (
        <Modal visible={visivel} transparent animationType="slide" onRequestClose={onFechar}>
            <View style={estilos.fundo}>
                <Pressable style={estilos.areaFora} onPress={onFechar} />

                <View style={[estilos.gaveta, { paddingBottom: 20 + bottom }]}>
                    <View style={estilos.puxador} />
                    <View>
                        <Text style={estilos.titulo}>{titulo}</Text>
                        {subtitulo && <Text style={estilos.subtitulo}>{subtitulo}</Text>}
                    </View>

                    <Cartao semEspaco>
                        {opcoes.map((opcao, indice) => (
                            <ItemLista
                                key={opcao.titulo}
                                titulo={opcao.titulo}
                                icone={opcao.icone}
                                perigo={opcao.perigo}
                                divisor={indice > 0}
                                onPress={() => escolher(opcao)}
                            />
                        ))}
                    </Cartao>
                </View>
            </View>
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
        subtitulo: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
    });
}
