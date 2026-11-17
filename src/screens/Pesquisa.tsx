import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import TituloSecao from "../components/TituloSecao";
import Cartao from "../components/Cartao";
import ItemLista from "../components/ItemLista";
import Botao from "../components/Botao";
import CampoBusca from "../components/CampoBusca";
import CartaoClimaAgora from "../components/CartaoClimaAgora";
import Indicadores from "../components/Indicadores";
import ListaHoras from "../components/ListaHoras";
import ListaDias from "../components/ListaDias";
import CartaoAlerta from "../components/CartaoAlerta";
import { usePesquisa } from "../hooks/usePesquisa";
import { LocalResumo } from "../models/Previsao";
import { descricaoDoLugar } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

export default function Pesquisa() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const pesquisa = usePesquisa();

    // ======================= RESULTADO: um lugar escolhido =======================
    if (pesquisa.escolhido) {
        const lugar = pesquisa.escolhido;
        const { previsao } = pesquisa;

        // o cartão azul espera um "local"; aqui o lugar ainda não é um local salvo
        const comoLocal: LocalResumo = {
            id: 0,
            apelido: lugar.nome,
            // "Campinas · São Paulo" (e não "Campinas · Campinas")
            nome: lugar.cidade !== lugar.nome ? lugar.cidade : lugar.estado,
            cidade: lugar.cidade,
            estado: lugar.estado,
            uf: null,
            fuso: lugar.fuso,
        };

        return (
            <TelaBase>
                <View>
                    <Pressable onPress={pesquisa.voltar} hitSlop={10} style={estilos.voltar}>
                        <Ionicons name="arrow-back" size={20} color={cores.primaria} />
                        <Text style={estilos.textoVoltar}>Nova busca</Text>
                    </Pressable>

                    <CabecalhoTela titulo={lugar.nome} subtitulo={descricaoDoLugar(lugar)} />

                    {pesquisa.carregando ? (
                        <ActivityIndicator
                            size="large"
                            color={cores.primaria}
                            style={estilos.rodinha}
                        />
                    ) : pesquisa.erro || !previsao?.climaAtual ? (
                        // erro (ex.: Serviço de Clima fora do ar → 503)
                        <View style={estilos.vazio}>
                            <Ionicons
                                name="cloud-offline-outline"
                                size={40}
                                color={cores.textoSuave}
                            />
                            <Text style={estilos.textoVazio}>
                                {pesquisa.erro ?? "A previsão deste lugar não está disponível."}
                            </Text>
                            <Botao
                                texto="Tentar de novo"
                                variante="contorno"
                                onPress={pesquisa.tentarDeNovo}
                            />
                        </View>
                    ) : (
                        <>
                            <View style={estilos.bloco}>
                                <CartaoClimaAgora
                                    local={comoLocal}
                                    clima={previsao.climaAtual}
                                    atualizadoEm={previsao.atualizadoEm}
                                />
                                <Botao
                                    texto="Salvar como local"
                                    icone="star-outline"
                                    variante="contorno"
                                    onPress={() => navigation.navigate("NovoLocal", { lugar })}
                                />
                                <Indicadores clima={previsao.climaAtual} completo />
                            </View>

                            {previsao.alertas.length > 0 && (
                                <>
                                    <TituloSecao titulo="Alertas" />
                                    <View style={estilos.lista}>
                                        {previsao.alertas.map((alerta, indice) => (
                                            <CartaoAlerta key={indice} alerta={alerta} mostrarDia />
                                        ))}
                                    </View>
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

    // ======================= BUSCA =======================
    return (
        <TelaBase>
            <View style={estilos.busca}>
                <CabecalhoTela titulo="Pesquisa" subtitulo="Veja o clima de qualquer lugar" />

                <CampoBusca
                    valor={pesquisa.busca}
                    onMudar={pesquisa.mudarBusca}
                    placeholder="Digite um bairro ou cidade"
                    buscando={pesquisa.buscando}
                />

                {pesquisa.buscaCurta ? (
                    // ---------- sem texto: buscas recentes ou dica ----------
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
                        <View style={estilos.vazio}>
                            <Ionicons name="earth-outline" size={40} color={cores.primaria} />
                            <Text style={estilos.textoVazio}>
                                Veja a previsão de qualquer lugar, mesmo sem salvar.{"\n"}Ex.:
                                &quot;Campinas&quot;, &quot;Copacabana&quot;
                            </Text>
                        </View>
                    )
                ) : pesquisa.erroBusca ? (
                    <View style={estilos.vazio}>
                        <Ionicons name="cloud-offline-outline" size={40} color={cores.textoSuave} />
                        <Text style={estilos.textoVazio}>{pesquisa.erroBusca}</Text>
                    </View>
                ) : pesquisa.resultados.length === 0 ? (
                    pesquisa.buscando ? (
                        <ActivityIndicator color={cores.primaria} style={estilos.rodinha} />
                    ) : (
                        <View style={estilos.vazio}>
                            <Ionicons name="search-outline" size={40} color={cores.textoSuave} />
                            <Text style={estilos.textoVazio}>
                                Nenhum lugar encontrado. Tente outro nome.
                            </Text>
                        </View>
                    )
                ) : (
                    // ---------- resultados da busca ----------
                    <Cartao semEspaco>
                        {pesquisa.resultados.map((lugar, indice) => (
                            <ItemLista
                                key={lugar.id}
                                titulo={lugar.nome}
                                descricao={descricaoDoLugar(lugar)}
                                icone="location-outline"
                                divisor={indice > 0}
                                onPress={() => pesquisa.escolher(lugar)}
                            />
                        ))}
                    </Cartao>
                )}
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
        rodinha: {
            marginTop: 40,
        },
        bloco: {
            gap: 12,
            marginTop: 16,
        },
        lista: {
            gap: 10,
        },
        vazio: {
            alignItems: "center",
            gap: 10,
            marginTop: 32,
            paddingHorizontal: 20,
        },
        textoVazio: {
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: cores.textoSecundario,
        },
    });
}
