import { Pressable, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import Cartao from "../components/Cartao";
import ItemLista from "../components/ItemLista";
import CampoTexto from "../components/CampoTexto";
import Interruptor from "../components/Interruptor";
import Botao from "../components/Botao";
import TituloSecao from "../components/TituloSecao";
import Chip from "../components/Chip";
import Aviso from "../components/Aviso";
import BuscaDeLugar from "../components/BuscaDeLugar";
import { useNovoLocal } from "../hooks/useNovoLocal";
import { ListaDeTelas } from "../navigation/tipos";
import { descricaoDoLugar } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

const SUGESTOES = ["Casa", "Trabalho", "Escola", "Academia"];

// Novo local: 1) buscar o lugar  2) dar um apelido e salvar
export default function NovoLocal() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();

    const rota = useRoute<RouteProp<ListaDeTelas, "NovoLocal">>();
    const novo = useNovoLocal(rota.params?.lugar);

    async function salvar() {
        const deuCerto = await novo.salvar();
        if (deuCerto) {
            navigation.goBack();
        }
    }

    // passo 2: lugar escolhido
    if (novo.escolhido) {
        const lugar = novo.escolhido;
        return (
            <TelaBase comCabecalho>
                <View>
                    <TituloSecao titulo="Lugar" />
                    <Cartao>
                        <View style={estilos.linhaEscolhido}>
                            <View style={estilos.icone}>
                                <Ionicons name="location" size={20} color={cores.primaria} />
                            </View>
                            <View style={estilos.textos}>
                                <Text style={estilos.nomeLugar}>{lugar.nome}</Text>
                                <Text style={estilos.descricao}>{descricaoDoLugar(lugar)}</Text>
                            </View>
                            <Pressable onPress={novo.trocarLugar} hitSlop={10}>
                                <Text style={estilos.trocar}>Trocar</Text>
                            </Pressable>
                        </View>
                    </Cartao>

                    <TituloSecao titulo="Como você chama este lugar?" />
                    <CampoTexto
                        rotulo="Apelido"
                        icone="pricetag-outline"
                        placeholder="Ex.: Casa, Trabalho, Escola"
                        value={novo.apelido}
                        onChangeText={novo.setApelido}
                        erro={novo.erros.apelido}
                        maxLength={50}
                    />

                    <View style={estilos.sugestoes}>
                        {SUGESTOES.map((sugestao) => (
                            <Chip
                                key={sugestao}
                                texto={sugestao}
                                ativo={novo.apelido === sugestao}
                                onPress={() => novo.setApelido(sugestao)}
                            />
                        ))}
                    </View>

                    <TituloSecao titulo="Avisos" />
                    <Cartao semEspaco>
                        <ItemLista
                            titulo="Receber alertas"
                            descricao="Chuva forte, calor, vento e mudanças na previsão"
                            icone="notifications-outline"
                            direita={
                                <Interruptor
                                    valor={novo.receberAlertas}
                                    onMudar={novo.setReceberAlertas}
                                />
                            }
                        />
                    </Cartao>

                    {novo.erro && <Text style={estilos.erro}>{novo.erro}</Text>}

                    <View style={estilos.botao}>
                        <Botao
                            texto="Salvar local"
                            icone="checkmark"
                            onPress={salvar}
                            carregando={novo.salvando}
                        />
                    </View>
                </View>
            </TelaBase>
        );
    }

    // passo 1: buscar o lugar
    return (
        <TelaBase comCabecalho>
            <View style={estilos.passo1}>
                <Text style={estilos.ajuda}>
                    Procure pelo nome do bairro ou da cidade. Depois você dá um apelido para ele.
                </Text>

                <BuscaDeLugar
                    busca={novo.busca}
                    onEscolher={novo.escolher}
                    antesDeBuscar={
                        <Aviso
                            icone="map-outline"
                            texto='Ex.: "Pinheiros", "Campinas", "Copacabana"'
                            semCartao
                        />
                    }
                />
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        passo1: {
            gap: 16,
        },
        ajuda: {
            fontSize: 14,
            lineHeight: 20,
            color: cores.textoSecundario,
        },

        linhaEscolhido: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
        },
        icone: {
            width: 40,
            height: 40,
            borderRadius: 20,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        textos: {
            flex: 1,
            gap: 2,
        },
        nomeLugar: {
            fontSize: 16,
            fontWeight: "800",
            color: cores.texto,
        },
        descricao: {
            fontSize: 13,
            color: cores.textoSecundario,
        },
        trocar: {
            fontSize: 14,
            fontWeight: "700",
            color: cores.primaria,
        },
        sugestoes: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            marginTop: 12,
        },
        erro: {
            marginTop: 16,
            fontSize: 14,
            color: cores.erro,
        },
        botao: {
            marginTop: 24,
        },
    });
}
