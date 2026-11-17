// Mostra os alertas e as mudanças na previsão de todos os locais com alertas ligados.
// Toda a lógica está no hook useAlertas.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import Segmentado from "../components/Segmentado";
import TituloSecao from "../components/TituloSecao";
import Cartao from "../components/Cartao";
import Botao from "../components/Botao";
import Selo from "../components/Selo";
import CartaoAlerta from "../components/CartaoAlerta";
import CartaoMudanca from "../components/CartaoMudanca";
import { useAlertas } from "../hooks/useAlertas";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

export default function Alertas() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { dados, carregando, atualizando, erro, filtro, setFiltro, atualizar } = useAlertas();

    const mostrarAlertas = filtro !== "MUDANCAS";
    const mostrarMudancas = filtro !== "ALERTAS";

    function subtitulo() {
        if (!dados) return undefined;
        const n = dados.alertas.length;
        if (n === 0) return "Nenhum alerta por enquanto";
        return n === 1 ? "1 alerta nos próximos dias" : `${n} alertas nos próximos dias`;
    }

    function aviso(
        icone: keyof typeof Ionicons.glyphMap,
        titulo: string,
        texto: string,
        botao?: { texto: string; onPress: () => void }
    ) {
        return (
            <Cartao>
                <View style={estilos.aviso}>
                    <Ionicons name={icone} size={40} color={cores.primaria} />
                    <Text style={estilos.tituloAviso}>{titulo}</Text>
                    <Text style={estilos.textoAviso}>{texto}</Text>
                    {botao && <Botao texto={botao.texto} onPress={botao.onPress} />}
                </View>
            </Cartao>
        );
    }

    function vazio(texto: string) {
        return (
            <Cartao>
                <View style={estilos.linhaVazia}>
                    <Ionicons name="checkmark-circle" size={22} color={cores.sucesso} />
                    <Text style={estilos.textoVazio}>{texto}</Text>
                </View>
            </Cartao>
        );
    }

    function conteudo() {
        if (carregando) {
            return (
                <ActivityIndicator size="large" color={cores.primaria} style={estilos.rodinha} />
            );
        }
        if (!dados) {
            return aviso("cloud-offline-outline", "Não deu para carregar", erro ?? "", {
                texto: "Tentar de novo",
                onPress: atualizar,
            });
        }
        if (!dados.temLocais) {
            return aviso(
                "location-outline",
                "Nenhum local salvo",
                "Cadastre um local para receber alertas de chuva, calor, vento e mais.",
                { texto: "Adicionar local", onPress: () => navigation.navigate("NovoLocal") }
            );
        }
        if (dados.locaisComAlerta === 0) {
            return aviso(
                "notifications-off-outline",
                "Alertas desligados",
                'Ligue "Receber alertas" em pelo menos um local para ver os avisos aqui.',
                { texto: "Ir para Meus Locais", onPress: () => navigation.navigate("MeusLocais") }
            );
        }

        return (
            <>
                {mostrarAlertas && (
                    <>
                        <TituloSecao
                            titulo="Alertas"
                            selo={
                                dados.alertas.length > 0 ? (
                                    <Selo texto={String(dados.alertas.length)} cor="erro" />
                                ) : undefined
                            }
                        />
                        {dados.alertas.length > 0 ? (
                            <View style={estilos.lista}>
                                {dados.alertas.map((item) => (
                                    <Pressable
                                        key={item.chave}
                                        onPress={() =>
                                            navigation.navigate("DetalhesLocal", {
                                                localId: item.localId,
                                                apelido: item.apelido,
                                            })
                                        }
                                    >
                                        <CartaoAlerta
                                            alerta={item.alerta}
                                            local={item.apelido}
                                            mostrarDia
                                        />
                                    </Pressable>
                                ))}
                            </View>
                        ) : (
                            vazio("Nenhum alerta nos próximos dias.")
                        )}
                    </>
                )}

                {mostrarMudancas && (
                    <>
                        <TituloSecao titulo="O que mudou na previsão" />
                        {dados.mudancas.length > 0 ? (
                            <View style={estilos.lista}>
                                {dados.mudancas.map((mudanca) => (
                                    <Pressable
                                        key={`${mudanca.id}-${mudanca.localId}`}
                                        onPress={() =>
                                            navigation.navigate("DetalhesLocal", {
                                                localId: mudanca.localId,
                                                apelido: mudanca.localApelido,
                                            })
                                        }
                                    >
                                        <CartaoMudanca mudanca={mudanca} />
                                    </Pressable>
                                ))}
                            </View>
                        ) : (
                            vazio("A previsão não mudou nas últimas horas.")
                        )}
                    </>
                )}
            </>
        );
    }

    return (
        <TelaBase aoAtualizar={atualizar} atualizando={atualizando}>
            <View>
                <CabecalhoTela titulo="Alertas" subtitulo={subtitulo()} />

                <Segmentado
                    opcoes={[
                        { valor: "TODOS", rotulo: "Todos" },
                        { valor: "ALERTAS", rotulo: "Alertas" },
                        { valor: "MUDANCAS", rotulo: "Mudanças" },
                    ]}
                    valor={filtro}
                    onMudar={setFiltro}
                />

                <View style={estilos.corpo}>{conteudo()}</View>
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        corpo: {
            marginTop: 8,
        },
        rodinha: {
            marginTop: 48,
        },
        lista: {
            gap: 10,
        },
        aviso: {
            alignItems: "center",
            gap: 10,
            paddingVertical: 8,
        },
        tituloAviso: {
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
            color: cores.texto,
        },
        textoAviso: {
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: cores.textoSecundario,
            marginBottom: 6,
        },
        linhaVazia: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        textoVazio: {
            flex: 1,
            fontSize: 14,
            color: cores.textoSecundario,
        },
    });
}
