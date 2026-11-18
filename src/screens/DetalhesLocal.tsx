import { useRef } from "react";
import { ScrollViewInstance, StyleSheet, Text, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import TituloSecao from "../components/TituloSecao";
import Botao from "../components/Botao";
import Aviso from "../components/Aviso";
import Atalhos from "../components/Atalhos";
import Carregando from "../components/Carregando";
import BlocoClima from "../components/BlocoClima";
import ListaHoras from "../components/ListaHoras";
import ListaDias from "../components/ListaDias";
import ListaAlertas from "../components/ListaAlertas";
import ListaMudancas from "../components/ListaMudancas";
import SecaoCompromissos from "../components/SecaoCompromissos";
import { useCarregar } from "../hooks/useCarregar";
import { useCompromissosLocal } from "../hooks/useCompromissosLocal";
import { previsaoService } from "../services/previsaoService";
import { ListaDeTelas } from "../navigation/tipos";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Detalhes de um local: tudo vem de GET /locais/{id}/previsao
export default function DetalhesLocal() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const { localId } = useRoute<RouteProp<ListaDeTelas, "DetalhesLocal">>().params;
    const { dados, carregando, atualizando, erro, atualizar } = useCarregar(() =>
        previsaoService.doLocal(localId)
    );
    const compromissos = useCompromissosLocal(localId);

    // os atalhos do topo rolam a tela até a seção
    const rolagem = useRef<ScrollViewInstance>(null);
    const posicoes = useRef({ alertas: 0, compromissos: 0 });
    function rolarAte(secao: "alertas" | "compromissos") {
        rolagem.current?.scrollTo({ y: posicoes.current[secao], animated: true });
    }

    if (carregando) {
        return (
            <TelaBase comCabecalho>
                <Carregando />
            </TelaBase>
        );
    }

    if (!dados) {
        return (
            <TelaBase comCabecalho>
                <Aviso icone="cloud-offline-outline" texto={erro} erro>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={atualizar} />
                </Aviso>
            </TelaBase>
        );
    }

    const { local } = dados;

    return (
        <TelaBase
            comCabecalho
            aoAtualizar={atualizar}
            atualizando={atualizando}
            refRolagem={rolagem}
        >
            <View>
                <Text style={estilos.endereco}>
                    {local.nome} · {local.cidade}
                    {local.uf ? `, ${local.uf}` : ""}
                </Text>

                <View style={estilos.atalhos}>
                    <Atalhos
                        itens={[
                            {
                                rotulo: "Alertas",
                                icone: "warning-outline",
                                onPress: () => rolarAte("alertas"),
                            },
                            {
                                rotulo: "Agenda",
                                icone: "calendar-outline",
                                onPress: () => rolarAte("compromissos"),
                            },
                            {
                                rotulo: "Novo evento",
                                icone: "add-circle-outline",
                                onPress: compromissos.abrirNovo,
                            },
                        ]}
                    />
                </View>

                {!dados.climaAtual ? (
                    <Aviso
                        icone="hourglass-outline"
                        titulo={`Buscando a previsão de ${local.apelido}`}
                        texto="Leva alguns segundos. Puxe a tela para baixo para atualizar."
                    />
                ) : (
                    <>
                        <BlocoClima
                            local={local}
                            clima={dados.climaAtual}
                            atualizadoEm={dados.atualizadoEm}
                            completo
                        />

                        <View onLayout={(e) => (posicoes.current.alertas = e.nativeEvent.layout.y)}>
                            <TituloSecao titulo="Alertas" />
                            <ListaAlertas
                                itens={dados.alertas.map((alerta) => ({ alerta }))}
                                mostrarDia
                                textoVazio="Nenhum alerta nos próximos dias."
                            />
                        </View>

                        {dados.previsaoPorHora.length > 0 && (
                            <>
                                <TituloSecao titulo="Próximas 48 horas" />
                                <ListaHoras horas={dados.previsaoPorHora} />
                            </>
                        )}

                        {dados.previsaoDiaria.length > 0 && (
                            <>
                                <TituloSecao
                                    titulo={`Próximos ${dados.previsaoDiaria.length} dias`}
                                />
                                <ListaDias dias={dados.previsaoDiaria} />
                            </>
                        )}

                        {dados.mudancasNaPrevisao.length > 0 && (
                            <>
                                <TituloSecao titulo="O que mudou na previsão" />
                                <ListaMudancas mudancas={dados.mudancasNaPrevisao} />
                            </>
                        )}
                    </>
                )}

                <View onLayout={(e) => (posicoes.current.compromissos = e.nativeEvent.layout.y)}>
                    <SecaoCompromissos
                        c={compromissos}
                        dias={dados.previsaoDiaria}
                        alertas={dados.alertas}
                    />
                </View>
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        endereco: {
            fontSize: 14,
            color: cores.textoSecundario,
            marginBottom: 12,
        },
        atalhos: {
            marginBottom: 16,
        },
    });
}
