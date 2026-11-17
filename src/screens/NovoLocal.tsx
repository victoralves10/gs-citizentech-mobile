import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import Cartao from "../components/Cartao";
import ItemLista from "../components/ItemLista";
import CampoBusca from "../components/CampoBusca";
import CampoTexto from "../components/CampoTexto";
import Interruptor from "../components/Interruptor";
import Botao from "../components/Botao";
import TituloSecao from "../components/TituloSecao";
import { useNovoLocal } from "../hooks/useNovoLocal";
import { ListaDeTelas } from "../navigation/tipos";
import { descricaoDoLugar } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

// apelidos prontos para tocar e preencher
const SUGESTOES = ["Casa", "Trabalho", "Escola", "Academia"];

export default function NovoLocal() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();

    // lugar que veio pronto da tela anterior (pode não vir)
    const rota = useRoute<RouteProp<ListaDeTelas, "NovoLocal">>();
    const novo = useNovoLocal(rota.params?.lugar);

    // salvou: volta para a tela anterior (Meus Locais atualiza a lista sozinha)
    async function salvar() {
        const deuCerto = await novo.salvar();
        if (deuCerto) {
            navigation.goBack();
        }
    }

    // ======================= PASSO 2: lugar escolhido =======================
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
                        maxLength={50}
                    />

                    {/* sugestões: tocar preenche o apelido */}
                    <View style={estilos.sugestoes}>
                        {SUGESTOES.map((sugestao) => {
                            const ativa = novo.apelido === sugestao;
                            return (
                                <Pressable
                                    key={sugestao}
                                    onPress={() => novo.setApelido(sugestao)}
                                    style={[estilos.chip, ativa && estilos.chipAtivo]}
                                >
                                    <Text
                                        style={[estilos.textoChip, ativa && estilos.textoChipAtivo]}
                                    >
                                        {sugestao}
                                    </Text>
                                </Pressable>
                            );
                        })}
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

    // ======================= PASSO 1: buscar o lugar =======================
    return (
        <TelaBase comCabecalho>
            <View style={estilos.passo1}>
                <Text style={estilos.ajuda}>
                    Procure pelo nome do bairro ou da cidade. Depois você dá um apelido para ele.
                </Text>

                <CampoBusca
                    valor={novo.busca}
                    onMudar={novo.mudarBusca}
                    placeholder="Digite um bairro ou cidade"
                    buscando={novo.buscando}
                />

                {/* resultado da busca: dica, erro, nada encontrado ou a lista */}
                {novo.buscaCurta ? (
                    <View style={estilos.vazio}>
                        <Ionicons name="map-outline" size={40} color={cores.primaria} />
                        <Text style={estilos.textoVazio}>
                            Ex.: &quot;Pinheiros&quot;, &quot;Campinas&quot;, &quot;Copacabana&quot;
                        </Text>
                    </View>
                ) : novo.erroBusca ? (
                    <View style={estilos.vazio}>
                        <Ionicons name="cloud-offline-outline" size={40} color={cores.textoSuave} />
                        <Text style={estilos.textoVazio}>{novo.erroBusca}</Text>
                    </View>
                ) : novo.resultados.length === 0 ? (
                    novo.buscando ? (
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
                    <Cartao semEspaco>
                        {novo.resultados.map((lugar, indice) => (
                            <ItemLista
                                key={lugar.id}
                                titulo={lugar.nome}
                                descricao={descricaoDoLugar(lugar)}
                                icone="location-outline"
                                divisor={indice > 0}
                                onPress={() => novo.escolher(lugar)}
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
        passo1: {
            gap: 16,
        },
        ajuda: {
            fontSize: 14,
            lineHeight: 20,
            color: cores.textoSecundario,
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
        rodinha: {
            marginTop: 32,
        },

        // passo 2
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
            flexWrap: "wrap", // se não couber na linha, desce para a próxima
            gap: 8,
            marginTop: 12,
        },
        chip: {
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderRadius: 999,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        chipAtivo: {
            borderColor: cores.primaria,
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        textoChip: {
            fontSize: 14,
            fontWeight: "600",
            color: cores.textoSecundario,
        },
        textoChipAtivo: {
            color: cores.primaria,
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
