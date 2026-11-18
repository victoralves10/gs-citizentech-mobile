import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import TituloSecao from "../components/TituloSecao";
import Botao from "../components/Botao";
import Selo from "../components/Selo";
import Aviso from "../components/Aviso";
import Atalhos from "../components/Atalhos";
import Carregando from "../components/Carregando";
import BlocoClima from "../components/BlocoClima";
import ListaHoras from "../components/ListaHoras";
import ListaAlertas from "../components/ListaAlertas";
import ListaMudancas from "../components/ListaMudancas";
import ListaCompromissos from "../components/ListaCompromissos";
import ChipsDicas from "../components/ChipsDicas";
import { useCarregar } from "../hooks/useCarregar";
import { useAuth } from "../context/AuthContext";
import { previsaoService } from "../services/previsaoService";
import { diaDeHoje } from "../utils/datas";
import { dataLonga, saudacao } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Home: tudo vem de GET /home
export default function Home() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { usuario } = useAuth();
    const { dados, carregando, atualizando, erro, atualizar } = useCarregar(previsaoService.home);

    const primeiroNome = usuario?.nome.split(" ")[0] ?? "";

    function parteDoClima() {
        if (carregando) return <Carregando />;

        if (!dados) {
            return (
                <Aviso icone="cloud-offline-outline" titulo="Não deu para carregar" texto={erro}>
                    <Botao texto="Tentar de novo" onPress={atualizar} />
                </Aviso>
            );
        }

        if (!dados.temLocais) {
            return (
                <Aviso
                    icone="location-outline"
                    titulo="Cadastre seu primeiro local"
                    texto="Salve sua casa, o trabalho ou a escola para ver o clima e os alertas aqui."
                >
                    <Botao
                        texto="Adicionar local"
                        onPress={() => navigation.navigate("NovoLocal")}
                    />
                </Aviso>
            );
        }

        if (!dados.local) {
            return (
                <Aviso
                    icone="star-outline"
                    titulo="Escolha o seu local principal"
                    texto='Em Meus Locais, toque num local e escolha "Tornar principal". Ele aparece aqui.'
                >
                    <Botao
                        texto="Ir para Meus Locais"
                        onPress={() => navigation.navigate("MeusLocais")}
                    />
                </Aviso>
            );
        }

        if (!dados.climaAtual) {
            return (
                <Aviso
                    icone="hourglass-outline"
                    titulo={`Buscando a previsão de ${dados.local.apelido}`}
                    texto="Leva alguns segundos. Puxe a tela para baixo para atualizar."
                />
            );
        }

        const local = dados.local;
        return (
            <>
                <BlocoClima
                    local={local}
                    clima={dados.climaAtual}
                    atualizadoEm={dados.atualizadoEm}
                >
                    <Botao
                        texto="Ver mais detalhes"
                        icone="arrow-forward"
                        variante="contorno"
                        onPress={() =>
                            navigation.navigate("DetalhesLocal", {
                                localId: local.id,
                                apelido: local.apelido,
                            })
                        }
                    />
                </BlocoClima>

                <TituloSecao
                    titulo="Alertas de hoje"
                    textoAcao="Ver todos"
                    onAcao={() => navigation.navigate("Alertas")}
                    selo={
                        dados.alertas.length > 0 ? (
                            <Selo texto={String(dados.alertas.length)} cor="erro" />
                        ) : undefined
                    }
                />
                <ListaAlertas
                    itens={dados.alertas.map((alerta) => ({ alerta }))}
                    textoVazio={`Nenhum alerta para hoje em ${local.apelido}.`}
                />

                {dados.dicas.length > 0 && (
                    <>
                        <TituloSecao titulo="Dicas para hoje" />
                        <ChipsDicas dicas={dados.dicas} />
                    </>
                )}

                {dados.previsaoPorHora.length > 0 && (
                    <>
                        <TituloSecao titulo="Próximas horas" />
                        <ListaHoras horas={dados.previsaoPorHora} />
                    </>
                )}
            </>
        );
    }

    return (
        <TelaBase aoAtualizar={atualizar} atualizando={atualizando}>
            <View>
                <CabecalhoTela
                    acima={`${saudacao()}, ${primeiroNome}`}
                    titulo="Hoje"
                    subtitulo={dataLonga(diaDeHoje())}
                    direita={
                        <Pressable
                            style={estilos.sino}
                            hitSlop={8}
                            onPress={() => navigation.navigate("Alertas")}
                        >
                            <Ionicons name="notifications-outline" size={22} color={cores.texto} />
                        </Pressable>
                    }
                />

                <View style={estilos.atalhos}>
                    <Atalhos
                        itens={[
                            {
                                rotulo: "Locais",
                                icone: "location-outline",
                                onPress: () => navigation.navigate("MeusLocais"),
                            },
                            {
                                rotulo: "Pesquisar",
                                icone: "search-outline",
                                onPress: () => navigation.navigate("Pesquisa"),
                            },
                            {
                                rotulo: "Agenda",
                                icone: "calendar-outline",
                                onPress: () => navigation.navigate("MeusCompromissos"),
                            },
                            {
                                rotulo: "Alertas",
                                icone: "warning-outline",
                                onPress: () => navigation.navigate("Alertas"),
                            },
                        ]}
                    />
                </View>

                <View style={estilos.clima}>{parteDoClima()}</View>

                {dados && dados.mudancasNaPrevisao.length > 0 && (
                    <>
                        <TituloSecao
                            titulo="O que mudou na previsão"
                            textoAcao="Ver tudo"
                            onAcao={() => navigation.navigate("Alertas")}
                        />
                        <ListaMudancas mudancas={dados.mudancasNaPrevisao} abrirLocal />
                    </>
                )}

                {dados && dados.compromissos.length > 0 && (
                    <>
                        <TituloSecao
                            titulo="Próximos compromissos"
                            textoAcao="Ver todos"
                            onAcao={() => navigation.navigate("MeusCompromissos")}
                        />
                        <ListaCompromissos compromissos={dados.compromissos} />
                    </>
                )}
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        sino: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: cores.superficie,
            borderWidth: 1,
            borderColor: cores.borda,
        },
        atalhos: {
            marginTop: 16,
        },
        clima: {
            marginTop: 16,
        },
    });
}
