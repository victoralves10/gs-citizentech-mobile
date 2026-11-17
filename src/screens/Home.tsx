// Primeira aba: tudo vem de UMA chamada só (GET /home, no hook useHome).
// Tem atalhos para as outras áreas e "Ver todos" nas seções.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import TituloSecao from "../components/TituloSecao";
import Botao from "../components/Botao";
import Selo from "../components/Selo";
import Cartao from "../components/Cartao";
import ItemLista from "../components/ItemLista";
import CartaoClimaAgora from "../components/CartaoClimaAgora";
import Indicadores from "../components/Indicadores";
import ListaHoras from "../components/ListaHoras";
import CartaoAlerta from "../components/CartaoAlerta";
import CartaoMudanca from "../components/CartaoMudanca";
import ChipsDicas from "../components/ChipsDicas";
import Atalhos from "../components/Atalhos";
import { useHome } from "../hooks/useHome";
import { useAuth } from "../context/AuthContext";
import { dataCurta, dataLonga, diaDeHoje } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// "Bom dia" até 11h59, "Boa tarde" até 17h59, depois "Boa noite"
function saudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

export default function Home() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { usuario } = useAuth();
    const { dados, carregando, atualizando, erro, atualizar } = useHome();

    // só o primeiro nome: "Victor Alves" → "Victor"
    const primeiroNome = usuario?.nome.split(" ")[0] ?? "";

    // ---------- um "convite" (caixa com ícone, texto e botão) ----------
    function convite(
        icone: keyof typeof Ionicons.glyphMap,
        titulo: string,
        texto: string,
        botao?: { texto: string; onPress: () => void }
    ) {
        return (
            <Cartao>
                <View style={estilos.convite}>
                    <Ionicons name={icone} size={40} color={cores.primaria} />
                    <Text style={estilos.tituloConvite}>{titulo}</Text>
                    <Text style={estilos.textoConvite}>{texto}</Text>
                    {botao && <Botao texto={botao.texto} onPress={botao.onPress} />}
                </View>
            </Cartao>
        );
    }

    // ---------- a parte do clima (depende da situação) ----------
    function parteDoClima() {
        if (carregando) {
            return (
                <ActivityIndicator size="large" color={cores.primaria} style={estilos.rodinha} />
            );
        }
        if (erro && !dados) {
            return convite("cloud-offline-outline", "Não deu para carregar", erro, {
                texto: "Tentar de novo",
                onPress: atualizar,
            });
        }
        if (!dados) return null;

        // 1) nenhum local salvo
        if (!dados.temLocais) {
            return convite(
                "location-outline",
                "Cadastre seu primeiro local",
                "Salve sua casa, o trabalho ou a escola para ver o clima e os alertas aqui.",
                { texto: "Adicionar local", onPress: () => navigation.navigate("NovoLocal") }
            );
        }

        // 2) tem locais, mas nenhum é o principal
        if (!dados.local) {
            return convite(
                "star-outline",
                "Escolha o seu local principal",
                'Em Meus Locais, toque num local e escolha "Tornar principal". Ele aparece aqui.',
                { texto: "Ir para Meus Locais", onPress: () => navigation.navigate("MeusLocais") }
            );
        }

        // 3) a previsão do local ainda está chegando (local acabou de ser criado)
        if (!dados.climaAtual) {
            return convite(
                "hourglass-outline",
                `Buscando a previsão de ${dados.local.apelido}`,
                "Leva alguns segundos. Puxe a tela para baixo para atualizar."
            );
        }

        // 4) tudo certo: o clima completo
        const local = dados.local;
        return (
            <>
                <View style={estilos.blocoClima}>
                    <CartaoClimaAgora
                        local={local}
                        clima={dados.climaAtual}
                        atualizadoEm={dados.atualizadoEm}
                    />
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
                    <Indicadores clima={dados.climaAtual} />
                </View>

                {/* ---------- alertas de hoje ---------- */}
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
                {dados.alertas.length > 0 ? (
                    <View style={estilos.lista}>
                        {dados.alertas.map((alerta, indice) => (
                            <CartaoAlerta key={alerta.id ?? indice} alerta={alerta} />
                        ))}
                    </View>
                ) : (
                    <Cartao>
                        <View style={estilos.semAlerta}>
                            <Ionicons name="checkmark-circle" size={22} color={cores.sucesso} />
                            <Text style={estilos.textoSemAlerta}>
                                Nenhum alerta para hoje em {local.apelido}.
                            </Text>
                        </View>
                    </Cartao>
                )}

                {/* ---------- dicas ---------- */}
                {dados.dicas.length > 0 && (
                    <>
                        <TituloSecao titulo="Dicas para hoje" />
                        <ChipsDicas dicas={dados.dicas} />
                    </>
                )}

                {/* ---------- próximas horas ---------- */}
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
                        // sino: atalho para a aba Alertas
                        <Pressable
                            style={estilos.sino}
                            hitSlop={8}
                            onPress={() => navigation.navigate("Alertas")}
                        >
                            <Ionicons name="notifications-outline" size={22} color={cores.texto} />
                        </Pressable>
                    }
                />

                {/* ---------- atalhos para as outras áreas do app ---------- */}
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

                {/* ---------- o que mudou (de TODOS os locais) ---------- */}
                {dados && dados.mudancasNaPrevisao.length > 0 && (
                    <>
                        <TituloSecao
                            titulo="O que mudou na previsão"
                            textoAcao="Ver tudo"
                            onAcao={() => navigation.navigate("Alertas")}
                        />
                        <View style={estilos.lista}>
                            {dados.mudancasNaPrevisao.map((mudanca) => (
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
                    </>
                )}

                {/* ---------- próximos compromissos ---------- */}
                {dados && dados.compromissos.length > 0 && (
                    <>
                        <TituloSecao
                            titulo="Próximos compromissos"
                            textoAcao="Ver todos"
                            onAcao={() => navigation.navigate("MeusCompromissos")}
                        />
                        <Cartao semEspaco>
                            {dados.compromissos.map((compromisso, indice) => (
                                <ItemLista
                                    key={compromisso.id}
                                    titulo={compromisso.nome}
                                    descricao={`${dataCurta(compromisso.data)} · ${compromisso.localApelido}`}
                                    icone="calendar-outline"
                                    divisor={indice > 0}
                                    // abre os Detalhes do local do compromisso
                                    onPress={() =>
                                        navigation.navigate("DetalhesLocal", {
                                            localId: compromisso.localId,
                                            apelido: compromisso.localApelido,
                                        })
                                    }
                                />
                            ))}
                        </Cartao>
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
        rodinha: {
            marginTop: 48,
        },
        blocoClima: {
            gap: 12,
        },
        lista: {
            gap: 10,
        },
        convite: {
            alignItems: "center",
            gap: 10,
            paddingVertical: 8,
        },
        tituloConvite: {
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
            color: cores.texto,
        },
        textoConvite: {
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: cores.textoSecundario,
            marginBottom: 6,
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
