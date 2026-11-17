import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import BotaoPilula from "../components/BotaoPilula";
import CampoBusca from "../components/CampoBusca";
import CartaoLocal from "../components/CartaoLocal";
import MenuOpcoes from "../components/MenuOpcoes";
import JanelaEdicao from "../components/JanelaEdicao";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { useMeusLocais } from "../hooks/useMeusLocais";
import { LocalCard } from "../models/Local";
import { mensagemDeErro } from "../services/api";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// "1 local salvo" / "3 locais salvos" / "Nenhum local salvo ainda"
function textoQuantidade(total: number, buscando: boolean) {
    if (buscando) {
        return total === 1 ? "1 local encontrado" : `${total} locais encontrados`;
    }
    if (total === 0) return "Nenhum local salvo ainda";
    return total === 1 ? "1 local salvo" : `${total} locais salvos`;
}

export default function MeusLocais() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();

    // tudo da lista vem do hook
    const lista = useMeusLocais();

    // ---------- menu de opções e janela do apelido ----------
    // "selecionado" = o local em que o usuário tocou
    const [selecionado, setSelecionado] = useState<LocalCard | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);
    const [janelaApelido, setJanelaApelido] = useState(false);
    const [apelido, setApelido] = useState("");
    const [erroApelido, setErroApelido] = useState<string>();
    const [salvando, setSalvando] = useState(false);

    function abrirMenu(local: LocalCard) {
        setSelecionado(local);
        setMenuAberto(true);
    }

    function abrirApelido() {
        setApelido(selecionado?.apelido ?? "");
        setErroApelido(undefined);
        setJanelaApelido(true);
    }

    async function salvarApelido() {
        if (!selecionado) return;
        if (!apelido.trim()) {
            return setErroApelido("Informe o apelido.");
        }
        setSalvando(true);
        try {
            await lista.renomear(selecionado, apelido);
            setJanelaApelido(false);
        } catch (e) {
            // ex.: "Já existe um local com este apelido" (vem da API)
            setErroApelido(mensagemDeErro(e));
        } finally {
            setSalvando(false);
        }
    }

    // pergunta antes de excluir
    function confirmarExclusao() {
        if (!selecionado) return;
        const local = selecionado;
        Alert.alert(
            `Excluir ${local.apelido}?`,
            "Os compromissos deste local também serão apagados.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: () => lista.excluir(local) },
            ]
        );
    }

    // ---------- pedaços da lista ----------

    // em cima da lista (rola junto): título, botão e busca
    const cabecalho = (
        <View style={estilos.cabecalho}>
            <CabecalhoTela
                titulo="Meus locais"
                subtitulo={
                    lista.carregando
                        ? "Carregando..."
                        : textoQuantidade(lista.totalItens, lista.busca.trim().length > 0)
                }
                direita={
                    <BotaoPilula
                        texto="Novo local"
                        icone="add"
                        onPress={() => navigation.navigate("NovoLocal")}
                    />
                }
            />
            <CampoBusca
                valor={lista.busca}
                onMudar={lista.setBusca}
                placeholder="Buscar por apelido ou bairro"
                buscando={lista.buscando}
            />
        </View>
    );

    // quando a lista está vazia: carregando, erro, nada encontrado ou nenhum local
    function vazio() {
        if (lista.carregando) {
            return (
                <ActivityIndicator size="large" color={cores.primaria} style={estilos.rodinha} />
            );
        }
        if (lista.erro) {
            return (
                <View style={estilos.vazio}>
                    <Ionicons name="cloud-offline-outline" size={40} color={cores.textoSuave} />
                    <Text style={estilos.textoVazio}>{lista.erro}</Text>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={lista.atualizar} />
                </View>
            );
        }
        if (lista.busca.trim()) {
            return (
                <View style={estilos.vazio}>
                    <Ionicons name="search-outline" size={40} color={cores.textoSuave} />
                    <Text style={estilos.textoVazio}>
                        Nenhum local encontrado para &quot;{lista.busca.trim()}&quot;.
                    </Text>
                </View>
            );
        }
        return (
            <View style={estilos.vazio}>
                <Ionicons name="location-outline" size={40} color={cores.primaria} />
                <Text style={estilos.tituloVazio}>Você ainda não salvou nenhum local</Text>
                <Text style={estilos.textoVazio}>
                    Salve sua casa, o trabalho ou a escola para ver o clima e receber alertas.
                </Text>
                <Botao
                    texto="Adicionar meu primeiro local"
                    icone="add"
                    onPress={() => navigation.navigate("NovoLocal")}
                />
                <Botao
                    texto="Pesquisar uma cidade"
                    icone="search-outline"
                    variante="contorno"
                    onPress={() => navigation.navigate("Pesquisa")}
                />
            </View>
        );
    }

    return (
        <TelaBase rolar={false} semEspaco>
            <FlatList
                data={lista.locais}
                keyExtractor={(local) => String(local.id)}
                renderItem={({ item }) => (
                    <CartaoLocal
                        local={item}
                        onAbrir={() =>
                            navigation.navigate("DetalhesLocal", {
                                localId: item.id,
                                apelido: item.apelido,
                            })
                        }
                        onAlertas={(ligar) => lista.alternarAlertas(item, ligar)}
                        onOpcoes={() => abrirMenu(item)}
                    />
                )}
                ListHeaderComponent={cabecalho}
                ListEmptyComponent={vazio()}
                // rodinha pequena no fim enquanto busca a próxima página
                ListFooterComponent={
                    lista.carregandoMais ? (
                        <ActivityIndicator color={cores.primaria} style={estilos.rodinhaRodape} />
                    ) : undefined
                }
                // rolagem infinita: quando faltar meia tela para o fim, pede mais
                onEndReached={lista.carregarMais}
                onEndReachedThreshold={0.5}
                // puxar a lista para baixo atualiza
                refreshControl={
                    <RefreshControl
                        refreshing={lista.atualizando}
                        onRefresh={lista.atualizar}
                        colors={[cores.primaria]}
                        tintColor={cores.primaria}
                    />
                }
                contentContainerStyle={estilos.conteudo}
                keyboardShouldPersistTaps="handled"
            />

            {/* ---------- menu do local ---------- */}
            <MenuOpcoes
                visivel={menuAberto}
                titulo={selecionado?.apelido ?? ""}
                subtitulo={selecionado ? `${selecionado.nome} · ${selecionado.cidade}` : undefined}
                onFechar={() => setMenuAberto(false)}
                opcoes={[
                    selecionado?.principal
                        ? {
                              titulo: "Tirar de principal",
                              icone: "star-outline",
                              onPress: () => selecionado && lista.mudarPrincipal(selecionado),
                          }
                        : {
                              titulo: "Tornar principal (aparece na Home)",
                              icone: "star",
                              onPress: () => selecionado && lista.mudarPrincipal(selecionado),
                          },
                    { titulo: "Trocar apelido", icone: "create-outline", onPress: abrirApelido },
                    {
                        titulo: "Excluir local",
                        icone: "trash-outline",
                        perigo: true,
                        onPress: confirmarExclusao,
                    },
                ]}
            />

            {/* ---------- janela para trocar o apelido ---------- */}
            <JanelaEdicao
                visivel={janelaApelido}
                titulo="Trocar apelido"
                erro={erroApelido}
                salvando={salvando}
                onFechar={() => setJanelaApelido(false)}
                onSalvar={salvarApelido}
            >
                <CampoTexto
                    rotulo="Apelido"
                    icone="pricetag-outline"
                    placeholder="Ex.: Casa, Trabalho, Escola"
                    value={apelido}
                    onChangeText={setApelido}
                    maxLength={50}
                    autoFocus
                />
            </JanelaEdicao>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        conteudo: {
            flexGrow: 1,
            padding: 20,
            gap: 12, // espaço entre os cartões
        },
        cabecalho: {
            gap: 16,
            marginBottom: 4,
        },
        rodinha: {
            marginTop: 48,
        },
        rodinhaRodape: {
            marginVertical: 16,
        },
        vazio: {
            alignItems: "center",
            gap: 10,
            marginTop: 40,
            paddingHorizontal: 20,
        },
        tituloVazio: {
            fontSize: 17,
            fontWeight: "800",
            textAlign: "center",
            color: cores.texto,
        },
        textoVazio: {
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: cores.textoSecundario,
        },
    });
}
