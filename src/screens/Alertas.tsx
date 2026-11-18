import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import Segmentado from "../components/Segmentado";
import TituloSecao from "../components/TituloSecao";
import Selo from "../components/Selo";
import Aviso from "../components/Aviso";
import Botao from "../components/Botao";
import Carregando from "../components/Carregando";
import ListaAlertas from "../components/ListaAlertas";
import ListaMudancas from "../components/ListaMudancas";
import { useAlertas } from "../hooks/useAlertas";

// Aba Alertas: alertas e mudanças de todos os locais com alertas ligados
export default function Alertas() {
    const navigation = useNavigation();
    const { dados, carregando, atualizando, erro, filtro, setFiltro, atualizar } = useAlertas();

    function subtitulo() {
        if (!dados) return undefined;
        const n = dados.alertas.length;
        if (n === 0) return "Nenhum alerta por enquanto";
        return n === 1 ? "1 alerta nos próximos dias" : `${n} alertas nos próximos dias`;
    }

    function conteudo() {
        if (carregando) return <Carregando />;

        if (!dados) {
            return (
                <Aviso icone="cloud-offline-outline" titulo="Não deu para carregar" texto={erro}>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={atualizar} />
                </Aviso>
            );
        }

        if (!dados.temLocais) {
            return (
                <Aviso
                    icone="location-outline"
                    titulo="Nenhum local salvo"
                    texto="Cadastre um local para receber alertas de chuva, calor, vento e mais."
                >
                    <Botao
                        texto="Adicionar local"
                        onPress={() => navigation.navigate("NovoLocal")}
                    />
                </Aviso>
            );
        }

        if (dados.locaisComAlerta === 0) {
            return (
                <Aviso
                    icone="notifications-off-outline"
                    titulo="Alertas desligados"
                    texto='Ligue "Receber alertas" em pelo menos um local para ver os avisos aqui.'
                >
                    <Botao
                        texto="Ir para Meus Locais"
                        onPress={() => navigation.navigate("MeusLocais")}
                    />
                </Aviso>
            );
        }

        return (
            <>
                {filtro !== "MUDANCAS" && (
                    <>
                        <TituloSecao
                            titulo="Alertas"
                            selo={
                                dados.alertas.length > 0 ? (
                                    <Selo texto={String(dados.alertas.length)} cor="erro" />
                                ) : undefined
                            }
                        />
                        <ListaAlertas
                            itens={dados.alertas}
                            mostrarDia
                            textoVazio="Nenhum alerta nos próximos dias."
                        />
                    </>
                )}

                {filtro !== "ALERTAS" && (
                    <>
                        <TituloSecao titulo="O que mudou na previsão" />
                        <ListaMudancas
                            mudancas={dados.mudancas}
                            abrirLocal
                            textoVazio="A previsão não mudou nas últimas horas."
                        />
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

const estilos = StyleSheet.create({
    corpo: {
        marginTop: 8,
    },
});
