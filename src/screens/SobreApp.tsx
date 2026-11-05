import { StyleSheet, Text, View } from "react-native";
import Constants from "expo-constants";
import TelaBase from "../components/TelaBase";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// integrantes do grupo
const EQUIPE = [
    "Eduardo Batista Locaspi - RM561713",
    "Enzo Vieira Bernardini - RM563000",
    "Liana Lyumi Morisita Fujisima - RM565698",
    "Victor Alves Lopes - RM561833",
];

export default function SobreApp() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // dados da configuração do app (o "??" usa o texto da direita se o valor não existir)
    const versao = Constants.expoConfig?.version ?? "-";
    const commit = Constants.expoConfig?.extra?.commit ?? "-";
    const dataBuild = Constants.expoConfig?.extra?.dataBuild ?? "-";
    const ambiente =
        Constants.executionEnvironment === "storeClient"
            ? "Expo Go (desenvolvimento)"
            : "App instalado";

    return (
        <TelaBase comCabecalho>
            <View style={estilos.cartao}>
                <Linha rotulo="Versão" valor={versao} estilos={estilos} />
                <Linha rotulo="Commit" valor={commit} estilos={estilos} destaque />
                <Linha rotulo="Data do build" valor={dataBuild} estilos={estilos} />
                <Linha rotulo="Rodando em" valor={ambiente} estilos={estilos} />
            </View>

            <Text style={estilos.secao}>Equipe</Text>
            <View style={estilos.cartao}>
                {EQUIPE.map((pessoa) => (
                    <Text key={pessoa} style={estilos.pessoa}>
                        {pessoa}
                    </Text>
                ))}
            </View>

            <Text style={estilos.rodape}>Global Solution 2026/2 · FIAP</Text>
        </TelaBase>
    );
}

// uma linha "rótulo ........ valor" (componente usado só nesta tela)
function Linha({
    rotulo,
    valor,
    estilos,
    destaque = false,
}: {
    rotulo: string;
    valor: string;
    estilos: ReturnType<typeof criarEstilos>;
    destaque?: boolean;
}) {
    return (
        <View style={estilos.linha}>
            <Text style={estilos.rotulo}>{rotulo}</Text>
            <Text style={[estilos.valor, destaque && estilos.destaque]}>{valor}</Text>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        cartao: {
            gap: 12,
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        linha: {
            flexDirection: "row",
            justifyContent: "space-between", // rótulo na esquerda, valor na direita
            gap: 12,
        },
        rotulo: {
            fontSize: 15,
            color: cores.textoSecundario,
        },
        valor: {
            flexShrink: 1,
            fontSize: 15,
            fontWeight: "600",
            textAlign: "right",
            color: cores.texto,
        },
        destaque: {
            color: cores.primaria,
        },
        secao: {
            fontSize: 14,
            fontWeight: "700",
            color: cores.textoSecundario,
        },
        pessoa: {
            fontSize: 15,
            color: cores.texto,
        },
        rodape: {
            textAlign: "center",
            fontSize: 13,
            color: cores.textoSuave,
        },
    });
}
