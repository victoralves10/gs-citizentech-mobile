// Lista os próximos compromissos e permite criar, editar e excluir.
// Toda a lógica está no hook useCompromissosLocal.
import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Cartao from "./Cartao";
import ItemLista from "./ItemLista";
import TituloSecao from "./TituloSecao";
import JanelaEdicao from "./JanelaEdicao";
import CampoTexto from "./CampoTexto";
import MenuOpcoes from "./MenuOpcoes";
import { Compromisso } from "../models/Compromisso";
import { useCompromissosLocal } from "../hooks/useCompromissosLocal";
import { apiParaCampo, mascaraData, proximosDias } from "../utils/campoData";
import { dataCurta, diaSemana } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

type Props = {
    localId: number;
};

export default function SecaoCompromissos({ localId }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const c = useCompromissosLocal(localId);

    // compromisso em que o usuário tocou (abre o menu Editar / Excluir)
    const [selecionado, setSelecionado] = useState<Compromisso | null>(null);

    function confirmarExclusao(compromisso: Compromisso) {
        Alert.alert(`Excluir "${compromisso.nome}"?`, "Isso não pode ser desfeito.", [
            { text: "Cancelar", style: "cancel" },
            { text: "Excluir", style: "destructive", onPress: () => c.excluir(compromisso) },
        ]);
    }

    return (
        <View>
            <TituloSecao
                titulo="Compromissos deste local"
                textoAcao="+ Novo"
                onAcao={c.abrirNovo}
            />

            {c.lista.length > 0 ? (
                <Cartao semEspaco>
                    {c.lista.map((compromisso, indice) => (
                        <ItemLista
                            key={compromisso.id}
                            titulo={compromisso.nome}
                            descricao={dataCurta(compromisso.data)}
                            icone="calendar-outline"
                            divisor={indice > 0}
                            onPress={() => setSelecionado(compromisso)}
                        />
                    ))}
                </Cartao>
            ) : (
                <Cartao>
                    <Text style={estilos.vazio}>
                        {c.carregando
                            ? "Carregando..."
                            : "Nenhum compromisso marcado aqui. Toque em + Novo."}
                    </Text>
                </Cartao>
            )}

            {/* ---------- menu: editar ou excluir ---------- */}
            <MenuOpcoes
                visivel={selecionado !== null}
                titulo={selecionado?.nome ?? ""}
                subtitulo={selecionado ? dataCurta(selecionado.data) : undefined}
                onFechar={() => setSelecionado(null)}
                opcoes={[
                    {
                        titulo: "Editar",
                        icone: "create-outline",
                        onPress: () => selecionado && c.abrirEdicao(selecionado),
                    },
                    {
                        titulo: "Excluir",
                        icone: "trash-outline",
                        perigo: true,
                        onPress: () => selecionado && confirmarExclusao(selecionado),
                    },
                ]}
            />

            {/* ---------- janela de criar / editar ---------- */}
            <JanelaEdicao
                visivel={c.aberta}
                titulo={c.editando ? "Editar compromisso" : "Novo compromisso"}
                erro={c.erro}
                salvando={c.salvando}
                onFechar={c.fechar}
                onSalvar={c.salvar}
            >
                <CampoTexto
                    rotulo="Nome"
                    icone="bookmark-outline"
                    placeholder="Ex.: Reunião, aniversário, consulta"
                    value={c.nome}
                    onChangeText={c.setNome}
                    maxLength={80}
                />
                <CampoTexto
                    rotulo="Data"
                    icone="calendar-outline"
                    placeholder="DD/MM/AAAA"
                    keyboardType="number-pad"
                    value={c.data}
                    onChangeText={(texto) => c.setData(mascaraData(texto))}
                />

                {/* atalhos: os próximos 7 dias */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={estilos.atalhos}>
                        {proximosDias(7).map((dia, indice) => {
                            const campo = apiParaCampo(dia);
                            const ativo = c.data === campo;
                            return (
                                <Pressable
                                    key={dia}
                                    onPress={() => c.setData(campo)}
                                    style={[estilos.atalho, ativo && estilos.atalhoAtivo]}
                                >
                                    <Text style={[estilos.dia, ativo && estilos.textoAtivo]}>
                                        {indice === 1 ? "Amanhã" : diaSemana(dia)}
                                    </Text>
                                    <Text style={[estilos.data, ativo && estilos.textoAtivo]}>
                                        {campo.slice(0, 5)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            </JanelaEdicao>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        vazio: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
        atalhos: {
            flexDirection: "row",
            gap: 8,
        },
        atalho: {
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        atalhoAtivo: {
            borderColor: cores.primaria,
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        dia: {
            fontSize: 13,
            fontWeight: "700",
            color: cores.texto,
        },
        data: {
            fontSize: 12,
            color: cores.textoSecundario,
        },
        textoAtivo: {
            color: cores.primaria,
        },
    });
}
