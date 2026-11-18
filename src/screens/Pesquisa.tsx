import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import TituloSecao from "../components/TituloSecao";
import Cartao from "../components/Cartao";
import ItemLista from "../components/ItemLista";
import Botao from "../components/Botao";
import Aviso from "../components/Aviso";
import Carregando from "../components/Carregando";
import BuscaDeLugar from "../components/BuscaDeLugar";
import BlocoClima from "../components/BlocoClima";
import ListaHoras from "../components/ListaHoras";
import ListaDias from "../components/ListaDias";
import ListaAlertas from "../components/ListaAlertas";
import { usePesquisa } from "../hooks/usePesquisa";
import { descricaoDoLugar } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Pesquisa: previsão de qualquer lugar, sem precisar salvar
export default function Pesquisa() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const pesquisa = usePesquisa();

    // resultado: um lugar escolhido
    if (pesquisa.escolhido && pesquisa.local) {
        const lugar = pesquisa.escolhido;
        const { previsao } = pesquisa;

        return (
            <TelaBase>
                <View>
                    <Pressable onPress={pesquisa.voltar} hitSlop={10} style={estilos.voltar}>
                        <Ionicons name="arrow-back" size={20} color={cores.primaria} />
                        <Text style={estilos.textoVoltar}>Nova busca</Text>
                    </Pressable>

                    <CabecalhoTela titulo={lugar.nome} subtitulo={descricaoDoLugar(lugar)} />

                    {pesquisa.carregando ? (
                        <Carregando />
                    ) : !previsao?.climaAtual ? (
                        <Aviso
                            icone="cloud-offline-outline"
                            texto={pesquisa.erro ?? "A previsão deste lugar não está disponível."}
                            erro
                        >
                            <Botao
                                texto="Tentar de novo"
                                variante="contorno"
                                onPress={pesquisa.tentarDeNovo}
                            />
                        </Aviso>
                    ) : (
                        <>
                            <View style={estilos.clima}>
                                <BlocoClima
                                    local={pesquisa.local}
                                    clima={previsao.climaAtual}
                                    atualizadoEm={previsao.atualizadoEm}
                                    completo
                                >
                                    <Botao
                                        texto="Salvar como local"
                                        icone="star-outline"
                                        variante="contorno"
                                        onPress={() => navigation.navigate("NovoLocal", { lugar })}
                                    />
                                </BlocoClima>
                            </View>

                            {previsao.alertas.length > 0 && (
                                <>
                                    <TituloSecao titulo="Alertas" />
                                    <ListaAlertas
                                        itens={previsao.alertas.map((alerta) => ({ alerta }))}
                                        mostrarDia
                                    />
                                </>
                            )}

                            {previsao.previsaoPorHora.length > 0 && (
                                <>
                                    <TituloSecao titulo="Próximas horas" />
                                    <ListaHoras horas={previsao.previsaoPorHora} />
                                </>
                            )}

                            {previsao.previsaoDiaria.length > 0 && (
                                <>
                                    <TituloSecao
                                        titulo={`Próximos ${previsao.previsaoDiaria.length} dias`}
                                    />
                                    <ListaDias dias={previsao.previsaoDiaria} />
                                </>
                            )}
                        </>
                    )}
                </View>
            </TelaBase>
        );
    }

    // busca: recentes ou dica antes de digitar
    const antesDeBuscar =
        pesquisa.recentes.length > 0 ? (
            <View>
                <TituloSecao
                    titulo="Buscas recentes"
                    textoAcao="Limpar"
                    onAcao={pesquisa.apagarRecentes}
                />
                <Cartao semEspaco>
                    {pesquisa.recentes.map((lugar, indice) => (
                        <ItemLista
                            key={lugar.id}
                            titulo={lugar.nome}
                            descricao={descricaoDoLugar(lugar)}
                            icone="time-outline"
                            divisor={indice > 0}
                            onPress={() => pesquisa.escolher(lugar)}
                        />
                    ))}
                </Cartao>
            </View>
        ) : (
            <Aviso
                icone="earth-outline"
                texto={
                    'Veja a previsão de qualquer lugar, mesmo sem salvar.\nEx.: "Campinas", "Copacabana"'
                }
                semCartao
            />
        );

    return (
        <TelaBase>
            <View style={estilos.busca}>
                <CabecalhoTela titulo="Pesquisa" subtitulo="Veja o clima de qualquer lugar" />
                <BuscaDeLugar
                    busca={pesquisa.busca}
                    onEscolher={pesquisa.escolher}
                    antesDeBuscar={antesDeBuscar}
                />
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        busca: {
            gap: 16,
        },
        voltar: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            marginBottom: 12,
        },
        textoVoltar: {
            fontSize: 15,
            fontWeight: "700",
            color: cores.primaria,
        },
        clima: {
            marginTop: 16,
        },
    });
}
