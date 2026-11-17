// Lista os próximos compromissos de todos os locais, com a data e o local.
// Tocar num compromisso abre os Detalhes do local (onde dá para editar e excluir).
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import Cartao from "../components/Cartao";
import ItemLista from "../components/ItemLista";
import Botao from "../components/Botao";
import { useMeusCompromissos } from "../hooks/useMeusCompromissos";
import { dataCurta } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

export default function MeusCompromissos() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { lista, carregando, atualizando, erro, atualizar } = useMeusCompromissos();

    function conteudo() {
        if (carregando) {
            return (
                <ActivityIndicator size="large" color={cores.primaria} style={estilos.rodinha} />
            );
        }
        if (erro && lista.length === 0) {
            return (
                <View style={estilos.aviso}>
                    <Ionicons name="cloud-offline-outline" size={40} color={cores.textoSuave} />
                    <Text style={estilos.texto}>{erro}</Text>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={atualizar} />
                </View>
            );
        }
        if (lista.length === 0) {
            return (
                <View style={estilos.aviso}>
                    <Ionicons name="calendar-outline" size={40} color={cores.primaria} />
                    <Text style={estilos.titulo}>Nenhum compromisso marcado</Text>
                    <Text style={estilos.texto}>
                        Abra um local em Meus Locais e toque em + Novo, na seção de compromissos.
                    </Text>
                    <Botao
                        texto="Ir para Meus Locais"
                        onPress={() => navigation.navigate("MeusLocais")}
                    />
                </View>
            );
        }
        return (
            <Cartao semEspaco>
                {lista.map((compromisso, indice) => (
                    <ItemLista
                        key={compromisso.id}
                        titulo={compromisso.nome}
                        descricao={`${dataCurta(compromisso.data)} · ${compromisso.localApelido}`}
                        icone="calendar-outline"
                        divisor={indice > 0}
                        onPress={() =>
                            navigation.navigate("DetalhesLocal", {
                                localId: compromisso.localId,
                                apelido: compromisso.localApelido,
                            })
                        }
                    />
                ))}
            </Cartao>
        );
    }

    return (
        <TelaBase comCabecalho aoAtualizar={atualizar} atualizando={atualizando}>
            <View>{conteudo()}</View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        rodinha: {
            marginTop: 48,
        },
        aviso: {
            alignItems: "center",
            gap: 10,
            paddingVertical: 24,
        },
        titulo: {
            fontSize: 18,
            fontWeight: "800",
            textAlign: "center",
            color: cores.texto,
        },
        texto: {
            fontSize: 14,
            lineHeight: 20,
            textAlign: "center",
            color: cores.textoSecundario,
            marginBottom: 6,
        },
    });
}
