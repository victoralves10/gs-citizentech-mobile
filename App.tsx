import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { TemaProvider, useTema, PreferenciaTema } from "./src/theme/TemaContext";
import { Cores } from "./src/theme/cores";

export default function App() {
    return (
        <TemaProvider>
            <TesteTema />
        </TemaProvider>
    );
}

// as 3 opções que aparecem nos botões
const OPCOES: PreferenciaTema[] = ["automatico", "claro", "escuro"];

// tela de teste do tema
function TesteTema() {
    // pega o tema atual do Context
    const { cores, escuro, preferencia, mudarPreferencia } = useTema();

    // monta os estilos com as cores do tema atual
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Teste do tema</Text>
            <Text style={estilos.texto}>Agora o app está {escuro ? "escuro" : "claro"}.</Text>

            {/* um botão para cada opção. map() = repete o bloco para cada item da lista */}
            {OPCOES.map((opcao) => (
                <Pressable
                    key={opcao}
                    style={[estilos.botao, preferencia === opcao && estilos.botaoAtivo]}
                    onPress={() => mudarPreferencia(opcao)}
                >
                    <Text style={[estilos.textoBotao, preferencia === opcao && estilos.textoAtivo]}>
                        {opcao}
                    </Text>
                </Pressable>
            ))}

            {/* barra de cima do celular: texto claro no tema escuro e escuro no claro */}
            <StatusBar style={escuro ? "light" : "dark"} />
        </View>
    );
}

// os estilos recebem as cores- assim eles mudam quando o tema muda
function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: cores.fundo,
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
        },
        titulo: {
            fontSize: 22,
            fontWeight: "bold",
            color: cores.texto,
        },
        texto: {
            color: cores.textoSecundario,
        },
        botao: {
            width: 200,
            padding: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
            alignItems: "center",
        },
        botaoAtivo: {
            backgroundColor: cores.primaria,
            borderColor: cores.primaria,
        },
        textoBotao: {
            color: cores.texto,
            fontWeight: "600",
        },
        textoAtivo: {
            color: cores.textoSobreCor,
        },
    });
}
