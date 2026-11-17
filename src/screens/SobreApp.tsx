import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Constants from "expo-constants";
import { isRunningInExpoGo } from "expo";
import TelaBase from "../components/TelaBase";
import Marca from "../components/Marca";
import Cartao from "../components/Cartao";
import TituloSecao from "../components/TituloSecao";
import ItemLista from "../components/ItemLista";
import Selo from "../components/Selo";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// integrantes do grupo
const EQUIPE = [
    { nome: "Eduardo Batista Locaspi", rm: "RM561713" },
    { nome: "Enzo Vieira Bernardini", rm: "RM563000" },
    { nome: "Liana Lyumi Morisita Fujisima", rm: "RM565698" },
    { nome: "Victor Alves Lopes", rm: "RM561833" },
];

// tecnologias usadas no projeto (aparecem como selos)
const TECNOLOGIAS = ["React Native", "Expo", "TypeScript", "Java Spring", "Oracle", "Open-Meteo"];

export default function SobreApp() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // dados da configuração do app (o "??" usa o texto da direita se o valor não existir)
    const versao = Constants.expoConfig?.version ?? "-";
    const commit = Constants.expoConfig?.extra?.commit ?? "-";
    const dataBuild = Constants.expoConfig?.extra?.dataBuild ?? "-";
    const noExpoGo = isRunningInExpoGo();

    return (
        <TelaBase comCabecalho>
            {/* View única: o espaço entre as seções fica por conta do TituloSecao */}
            <View>
                {/* ---------- CARTÃO DA MARCA ---------- */}
                <LinearGradient
                    colors={[cores.primaria, cores.primariaForte]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={estilos.cartaoMarca}
                >
                    <View style={[estilos.bolha, estilos.bolhaGrande]} />
                    <View style={[estilos.bolha, estilos.bolhaPequena]} />
                    <Marca />
                    <View style={estilos.versaoMarca}>
                        <Text style={estilos.textoVersaoMarca}>versão {versao}</Text>
                    </View>
                </LinearGradient>

                {/* ---------- O QUE É ---------- */}
                <TituloSecao titulo="O que é" />
                <Cartao>
                    <Text style={estilos.paragrafo}>
                        O GaroAvisa mostra o clima dos lugares que importam para você, hora a hora e
                        para os próximos dias, e avisa quando o tempo pede atenção.
                    </Text>
                </Cartao>

                {/* ---------- INFORMAÇÕES DO BUILD ---------- */}
                <TituloSecao titulo="Informações do build" />
                <Cartao semEspaco>
                    <ItemLista
                        titulo="Versão"
                        icone="pricetag-outline"
                        direita={<Text style={estilos.valor}>{versao}</Text>}
                    />
                    <ItemLista
                        divisor
                        titulo="Commit"
                        icone="git-commit-outline"
                        direita={<Text style={[estilos.valor, estilos.destaque]}>{commit}</Text>}
                    />
                    <ItemLista
                        divisor
                        titulo="Data do build"
                        icone="calendar-outline"
                        direita={<Text style={estilos.valor}>{dataBuild}</Text>}
                    />
                    <ItemLista
                        divisor
                        titulo="Rodando em"
                        icone="phone-portrait-outline"
                        direita={
                            noExpoGo ? (
                                <Selo texto="Expo Go" cor="alerta" icone="construct-outline" />
                            ) : (
                                <Selo
                                    texto="App instalado"
                                    cor="sucesso"
                                    icone="checkmark-circle-outline"
                                />
                            )
                        }
                    />
                </Cartao>

                {/* ---------- EQUIPE ---------- */}
                <TituloSecao titulo="Equipe" />
                <Cartao semEspaco>
                    {EQUIPE.map((pessoa, indice) => (
                        <ItemLista
                            key={pessoa.rm}
                            divisor={indice > 0}
                            titulo={pessoa.nome}
                            descricao={pessoa.rm}
                            icone="person-circle-outline"
                        />
                    ))}
                </Cartao>

                {/* ---------- TECNOLOGIAS ---------- */}
                <TituloSecao titulo="Feito com" />
                <View style={estilos.selos}>
                    {TECNOLOGIAS.map((tecnologia) => (
                        <Selo key={tecnologia} texto={tecnologia} cor="neutro" />
                    ))}
                </View>

                {/* ---------- RODAPÉ ---------- */}
                <Text style={estilos.rodape}>Global Solution 2026/2 · CitizenTech · FIAP</Text>
                {/* a Open-Meteo pede que o app cite a fonte dos dados (licença CC BY 4.0) */}
                <Text style={estilos.fonte}>Dados do clima: Open-Meteo.com</Text>
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        // cartão da marca
        cartaoMarca: {
            alignItems: "center",
            paddingVertical: 28,
            borderRadius: 24,
            overflow: "hidden",
        },
        bolha: {
            position: "absolute",
            backgroundColor: "rgba(255, 255, 255, 0.10)",
        },
        bolhaGrande: {
            width: 200,
            height: 200,
            borderRadius: 100,
            top: -80,
            right: -60,
        },
        bolhaPequena: {
            width: 120,
            height: 120,
            borderRadius: 60,
            bottom: -50,
            left: -40,
        },
        versaoMarca: {
            marginTop: 14,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
        textoVersaoMarca: {
            fontSize: 12,
            fontWeight: "700",
            color: cores.textoSobreCor,
        },

        // textos
        paragrafo: {
            fontSize: 15,
            lineHeight: 22,
            color: cores.textoSecundario,
        },
        valor: {
            fontSize: 14,
            fontWeight: "600",
            color: cores.texto,
        },
        destaque: {
            color: cores.primaria,
        },

        // selos das tecnologias, um do lado do outro, quebrando linha quando não cabe
        selos: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
        },

        // rodapé
        rodape: {
            marginTop: 28,
            textAlign: "center",
            fontSize: 13,
            color: cores.textoSuave,
        },
        fonte: {
            marginTop: 4,
            textAlign: "center",
            fontSize: 12,
            color: cores.textoSuave,
        },
    });
}
