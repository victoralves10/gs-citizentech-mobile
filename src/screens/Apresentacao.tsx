import { useRef, useState } from "react";
import {
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    Pressable,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Marca from "../components/Marca";
import SlideApresentacao from "../components/SlideApresentacao";
import { PAGINAS_APRESENTACAO } from "../data/apresentacao";
import { useApresentacao } from "../context/ApresentacaoContext";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

export default function Apresentacao() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const navigation = useNavigation();
    const { concluirApresentacao } = useApresentacao();

    // largura da tela: cada página ocupa exatamente uma tela de largura
    const { width: largura } = useWindowDimensions();

    // altura do espaço das páginas (medida quando a tela aparece, no onLayout)
    const [alturaPaginas, setAlturaPaginas] = useState(0);

    // em qual página está (0 = primeira)
    const [pagina, setPagina] = useState(0);
    const ultima = pagina === PAGINAS_APRESENTACAO.length - 1;

    // referência para a lista: permite "rolar por código" quando toca na seta
    const lista = useRef<FlatList>(null);

    // quando o dedo solta e a rolagem para, descobre em qual página parou
    function aoTerminarDeRolar(evento: NativeSyntheticEvent<NativeScrollEvent>) {
        const posicao = evento.nativeEvent.contentOffset.x;
        setPagina(Math.round(posicao / largura));
    }

    // seta: vai para a próxima página
    function proxima() {
        const seguinte = pagina + 1;
        lista.current?.scrollToIndex({ index: seguinte, animated: true });
        setPagina(seguinte);
    }

    // "Começar" ou "Pular"
    async function concluir() {
        // veio do Perfil? (dá para voltar) — guarda ANTES de concluir
        const veioDoPerfil = navigation.canGoBack();

        await concluirApresentacao();

        // do Perfil: volta. Na primeira abertura não precisa fazer nada:
        // a navegação tira esta tela da lista e mostra o Login sozinha.
        if (veioDoPerfil) {
            navigation.goBack();
        }
    }

    return (
        <SafeAreaView style={estilos.tela} edges={["top", "bottom"]}>
            {/* ---------- TOPO ---------- */}
            <View style={estilos.topo}>
                <Marca variante="compacta" />
                {/* o "Pular" some na última página (lá já tem o "Começar") */}
                {!ultima && (
                    <Pressable onPress={concluir} hitSlop={12}>
                        <Text style={estilos.pular}>Pular</Text>
                    </Pressable>
                )}
            </View>

            {/* ---------- PÁGINAS ---------- */}
            {/* a View mede o espaço livre (onLayout) e cada página usa essa altura */}
            <View
                style={estilos.areaPaginas}
                onLayout={(evento) => setAlturaPaginas(evento.nativeEvent.layout.height)}
            >
                <FlatList
                    ref={lista}
                    data={PAGINAS_APRESENTACAO}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <SlideApresentacao pagina={item} largura={largura} altura={alturaPaginas} />
                    )}
                    horizontal // lista de lado, em vez de para baixo
                    pagingEnabled // para sempre "certinho" numa página
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    onMomentumScrollEnd={aoTerminarDeRolar}
                    // diz à lista o tamanho de cada página (necessário para o scrollToIndex)
                    getItemLayout={(_, indice) => ({
                        length: largura,
                        offset: largura * indice,
                        index: indice,
                    })}
                />
            </View>

            {/* ---------- RODAPÉ: bolinhas + seta / Começar ---------- */}
            <View style={estilos.rodape}>
                <View style={estilos.bolinhas}>
                    {PAGINAS_APRESENTACAO.map((item, indice) => (
                        <View
                            key={item.id}
                            style={[estilos.bolinha, indice === pagina && estilos.bolinhaAtiva]}
                        />
                    ))}
                </View>

                <Pressable onPress={ultima ? concluir : proxima}>
                    <LinearGradient
                        colors={[cores.primaria, cores.primariaForte]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        // na última página, o botão redondo vira uma pílula com texto
                        style={[estilos.botao, ultima && estilos.botaoComecar]}
                    >
                        {ultima && <Text style={estilos.textoComecar}>Começar</Text>}
                        <Ionicons name="arrow-forward" size={24} color={cores.textoSobreCor} />
                    </LinearGradient>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        tela: {
            flex: 1,
            backgroundColor: cores.fundo,
        },
        topo: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 20,
            paddingTop: 8,
        },
        areaPaginas: {
            flex: 1, // ocupa todo o espaço entre o topo e o rodapé
        },
        pular: {
            fontSize: 15,
            fontWeight: "700",
            color: cores.textoSecundario,
        },
        rodape: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 24,
            paddingBottom: 16,
            minHeight: 80,
        },
        bolinhas: {
            flexDirection: "row",
            gap: 8,
        },
        bolinha: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: cores.borda,
        },
        bolinhaAtiva: {
            width: 24, // a bolinha da página atual vira uma "pílula" mais comprida
            backgroundColor: cores.primaria,
        },
        botao: {
            width: 60,
            height: 60,
            borderRadius: 30,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
        },
        botaoComecar: {
            width: "auto",
            paddingHorizontal: 24,
        },
        textoComecar: {
            fontSize: 16,
            fontWeight: "700",
            color: cores.textoSobreCor,
        },
    });
}
