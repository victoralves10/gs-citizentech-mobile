import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from "react-native";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import CampoBusca from "../components/CampoBusca";
import CartaoLocal from "../components/CartaoLocal";
import MenuOpcoes from "../components/MenuOpcoes";
import JanelaEdicao from "../components/JanelaEdicao";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import Aviso from "../components/Aviso";
import Carregando from "../components/Carregando";
import { useMeusLocais } from "../hooks/useMeusLocais";
import { LocalCard } from "../models/Local";
import { useTema } from "../theme/TemaContext";

// "1 local salvo" / "3 locais salvos" / "2 locais encontrados"
function textoQuantidade(total: number, buscando: boolean) {
    if (buscando) {
        return total === 1 ? "1 local encontrado" : `${total} locais encontrados`;
    }
    if (total === 0) return "Nenhum local salvo ainda";
    return total === 1 ? "1 local salvo" : `${total} locais salvos`;
}

// Meus Locais: lista com busca, rolagem infinita e menu de cada local
export default function MeusLocais() {
    const { cores } = useTema();
    const navigation = useNavigation();
    const lista = useMeusLocais();
    const janela = lista.apelidoJanela;

    // local tocado no ⋮ (abre o menu)
    const [selecionado, setSelecionado] = useState<LocalCard | null>(null);

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
                    <Botao
                        texto="Novo local"
                        icone="add"
                        pequeno
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

    function vazio() {
        if (lista.carregando) return <Carregando />;

        if (lista.erro) {
            return (
                <Aviso icone="cloud-offline-outline" texto={lista.erro} erro semCartao>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={lista.atualizar} />
                </Aviso>
            );
        }

        if (lista.busca.trim()) {
            return (
                <Aviso
                    icone="search-outline"
                    texto={`Nenhum local encontrado para "${lista.busca.trim()}".`}
                    erro
                    semCartao
                />
            );
        }

        return (
            <Aviso
                icone="location-outline"
                titulo="Você ainda não salvou nenhum local"
                texto="Salve sua casa, o trabalho ou a escola para ver o clima e receber alertas."
                semCartao
            >
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
            </Aviso>
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
                        onOpcoes={() => setSelecionado(item)}
                    />
                )}
                ListHeaderComponent={cabecalho}
                ListEmptyComponent={vazio()}
                ListFooterComponent={
                    lista.carregandoMais ? (
                        <ActivityIndicator color={cores.primaria} style={estilos.rodape} />
                    ) : undefined
                }
                onEndReached={lista.carregarMais}
                onEndReachedThreshold={0.5}
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

            <MenuOpcoes
                visivel={selecionado !== null}
                titulo={selecionado?.apelido ?? ""}
                subtitulo={selecionado ? `${selecionado.nome} · ${selecionado.cidade}` : undefined}
                onFechar={() => setSelecionado(null)}
                opcoes={
                    selecionado
                        ? [
                              {
                                  titulo: selecionado.principal
                                      ? "Tirar de principal"
                                      : "Tornar principal (aparece na Home)",
                                  icone: selecionado.principal ? "star-outline" : "star",
                                  onPress: () => lista.mudarPrincipal(selecionado),
                              },
                              {
                                  titulo: "Trocar apelido",
                                  icone: "create-outline",
                                  onPress: () => janela.abrir(selecionado),
                              },
                              {
                                  titulo: "Excluir local",
                                  icone: "trash-outline",
                                  perigo: true,
                                  onPress: () => lista.excluir(selecionado),
                              },
                          ]
                        : []
                }
            />

            <JanelaEdicao
                visivel={janela.aberta}
                titulo="Trocar apelido"
                erro={janela.erro}
                salvando={janela.salvando}
                onFechar={janela.fechar}
                onSalvar={janela.salvar}
            >
                <CampoTexto
                    rotulo="Apelido"
                    icone="pricetag-outline"
                    placeholder="Ex.: Casa, Trabalho, Escola"
                    value={janela.apelido}
                    onChangeText={janela.setApelido}
                    maxLength={50}
                    autoFocus
                />
            </JanelaEdicao>
        </TelaBase>
    );
}

const estilos = StyleSheet.create({
    conteudo: {
        flexGrow: 1,
        padding: 20,
        gap: 12,
    },
    cabecalho: {
        gap: 16,
        marginBottom: 4,
    },
    rodape: {
        marginVertical: 16,
    },
});
