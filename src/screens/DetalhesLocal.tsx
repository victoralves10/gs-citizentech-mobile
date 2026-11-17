import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import TituloSecao from "../components/TituloSecao";
import Cartao from "../components/Cartao";
import Botao from "../components/Botao";
import SecaoCompromissos from "../components/SecaoCompromissos";
import CartaoClimaAgora from "../components/CartaoClimaAgora";
import Indicadores from "../components/Indicadores";
import ListaHoras from "../components/ListaHoras";
import ListaDias from "../components/ListaDias";
import CartaoAlerta from "../components/CartaoAlerta";
import CartaoMudanca from "../components/CartaoMudanca";
import { useDetalhesLocal } from "../hooks/useDetalhesLocal";
import { ListaDeTelas } from "../navigation/tipos";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

export default function DetalhesLocal() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // o id do local que veio da tela anterior
    const rota = useRoute<RouteProp<ListaDeTelas, "DetalhesLocal">>();
    const { dados, carregando, atualizando, erro, atualizar } = useDetalhesLocal(
        rota.params.localId
    );

    // ---------- carregando / erro ----------
    if (carregando) {
        return (
            <TelaBase comCabecalho>
                <ActivityIndicator size="large" color={cores.primaria} style={estilos.rodinha} />
            </TelaBase>
        );
    }

    if (!dados) {
        return (
            <TelaBase comCabecalho>
                <View style={estilos.aviso}>
                    <Ionicons name="cloud-offline-outline" size={40} color={cores.textoSuave} />
                    <Text style={estilos.textoAviso}>{erro ?? "Não deu para carregar."}</Text>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={atualizar} />
                </View>
            </TelaBase>
        );
    }

    const { local } = dados;

    return (
        <TelaBase comCabecalho aoAtualizar={atualizar} atualizando={atualizando}>
            <View>
                {/* "Vila Mariana · São Paulo, SP" */}
                <Text style={estilos.endereco}>
                    {local.nome} · {local.cidade}
                    {local.uf ? `, ${local.uf}` : ""}
                </Text>

                {/* ---------- a previsão ainda está chegando ---------- */}
                {!dados.climaAtual ? (
                    <Cartao>
                        <View style={estilos.aviso}>
                            <Ionicons name="hourglass-outline" size={40} color={cores.primaria} />
                            <Text style={estilos.tituloAviso}>
                                Buscando a previsão de {local.apelido}
                            </Text>
                            <Text style={estilos.textoAviso}>
                                Leva alguns segundos. Puxe a tela para baixo para atualizar.
                            </Text>
                        </View>
                    </Cartao>
                ) : (
                    <>
                        {/* ---------- agora ---------- */}
                        <View style={estilos.bloco}>
                            <CartaoClimaAgora
                                local={local}
                                clima={dados.climaAtual}
                                atualizadoEm={dados.atualizadoEm}
                            />
                            <Indicadores clima={dados.climaAtual} completo />
                        </View>

                        {/* ---------- alertas (hoje e próximos dias) ---------- */}
                        <TituloSecao titulo="Alertas" />
                        {dados.alertas.length > 0 ? (
                            <View style={estilos.lista}>
                                {dados.alertas.map((alerta, indice) => (
                                    <CartaoAlerta
                                        key={alerta.id ?? indice}
                                        alerta={alerta}
                                        mostrarDia
                                    />
                                ))}
                            </View>
                        ) : (
                            <Cartao>
                                <View style={estilos.semAlerta}>
                                    <Ionicons
                                        name="checkmark-circle"
                                        size={22}
                                        color={cores.sucesso}
                                    />
                                    <Text style={estilos.textoSemAlerta}>
                                        Nenhum alerta nos próximos dias.
                                    </Text>
                                </View>
                            </Cartao>
                        )}

                        {/* ---------- 48 horas ---------- */}
                        {dados.previsaoPorHora.length > 0 && (
                            <>
                                <TituloSecao titulo="Próximas 48 horas" />
                                <ListaHoras horas={dados.previsaoPorHora} />
                            </>
                        )}

                        {/* ---------- 16 dias ---------- */}
                        {dados.previsaoDiaria.length > 0 && (
                            <>
                                <TituloSecao
                                    titulo={`Próximos ${dados.previsaoDiaria.length} dias`}
                                />
                                <ListaDias dias={dados.previsaoDiaria} />
                            </>
                        )}

                        {/* ---------- o que mudou ---------- */}
                        {dados.mudancasNaPrevisao.length > 0 && (
                            <>
                                <TituloSecao titulo="O que mudou na previsão" />
                                <View style={estilos.lista}>
                                    {dados.mudancasNaPrevisao.map((mudanca) => (
                                        <CartaoMudanca key={mudanca.id} mudanca={mudanca} />
                                    ))}
                                </View>
                            </>
                        )}
                    </>
                )}

                {/* ---------- compromissos ---------- */}
                <SecaoCompromissos
                    localId={local.id}
                    dias={dados.previsaoDiaria}
                    alertas={dados.alertas}
                />
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        rodinha: {
            marginTop: 48,
        },
        endereco: {
            fontSize: 14,
            color: cores.textoSecundario,
            marginBottom: 12,
        },
        bloco: {
            gap: 12,
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
        },
        semAlerta: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        textoSemAlerta: {
            flex: 1,
            fontSize: 14,
            color: cores.textoSecundario,
        },
    });
}
