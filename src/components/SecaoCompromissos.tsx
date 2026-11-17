// Lista os próximos compromissos e permite criar, editar e excluir.
// Na linha aparece um resumo da previsão do dia; no menu, a previsão completa.
// Toda a lógica está no hook useCompromissosLocal.
import { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import ItemLista from "./ItemLista";
import TituloSecao from "./TituloSecao";
import JanelaEdicao from "./JanelaEdicao";
import CampoTexto from "./CampoTexto";
import MenuOpcoes from "./MenuOpcoes";
import SeletorData from "./SeletorData";
import ResumoDoDia from "./ResumoDoDia";
import { Compromisso } from "../models/Compromisso";
import { Alerta, PrevisaoDia } from "../models/Previsao";
import { useCompromissosLocal } from "../hooks/useCompromissosLocal";
import { iconeDoClima } from "../utils/clima";
import { dataCurta, porcentagem, temperatura } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    localId: number;
    dias?: PrevisaoDia[]; // previsão de 16 dias do local (vem da API nos Detalhes)
    alertas?: Alerta[]; // alertas do local (hoje e próximos dias)
};

export default function SecaoCompromissos({ localId, dias = [], alertas = [] }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const c = useCompromissosLocal(localId);

    // compromisso em que o usuário tocou (abre o menu com a previsão, Editar e Excluir)
    const [selecionado, setSelecionado] = useState<Compromisso | null>(null);

    // a previsão do dia de um compromisso (ou undefined se estiver fora dos 16 dias)
    function diaDo(compromisso: Compromisso) {
        return dias.find((d) => d.data === compromisso.data.slice(0, 10));
    }

    // resumo na direita da linha: ícone, mín/máx e chance de chuva
    function resumo(compromisso: Compromisso) {
        const dia = diaDo(compromisso);
        if (!dia) return undefined;
        return (
            <View style={estilos.resumo}>
                <Ionicons name={iconeDoClima(dia.categoria)} size={18} color={cores.primaria} />
                <Text style={estilos.temperaturas}>
                    {temperatura(dia.temperaturaMinima)}/{temperatura(dia.temperaturaMaxima)}
                </Text>
                <Text style={estilos.chuva}>{porcentagem(dia.probabilidadeChuva)}</Text>
            </View>
        );
    }

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
                            direita={resumo(compromisso)}
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

            {/* ---------- menu: previsão do dia + editar ou excluir ---------- */}
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
            >
                {selecionado && (
                    <ResumoDoDia
                        dia={diaDo(selecionado)}
                        alertas={alertas.filter((a) => a.dia === selecionado.data.slice(0, 10))}
                    />
                )}
            </MenuOpcoes>

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
                <SeletorData rotulo="Data" valor={c.data} onMudar={c.setData} />
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
        resumo: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        temperaturas: {
            fontSize: 13,
            fontWeight: "700",
            color: cores.texto,
        },
        chuva: {
            fontSize: 12,
            color: cores.textoSecundario,
        },
    });
}
