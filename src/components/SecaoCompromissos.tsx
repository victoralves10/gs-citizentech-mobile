import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import ItemLista from "./ItemLista";
import TituloSecao from "./TituloSecao";
import AvisoLinha from "./AvisoLinha";
import JanelaEdicao from "./JanelaEdicao";
import CampoTexto from "./CampoTexto";
import MenuOpcoes from "./MenuOpcoes";
import SeletorData from "./SeletorData";
import ResumoDoDia from "./ResumoDoDia";
import { Compromisso } from "../models/Compromisso";
import { Alerta, PrevisaoDia } from "../models/Previsao";
import { CompromissosDoLocal } from "../hooks/useCompromissosLocal";
import { iconeDoClima } from "../utils/clima";
import { dataCurta, porcentagem, temperatura } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Compromissos do local com a previsão de cada dia (lógica no useCompromissosLocal)
type Props = {
    c: CompromissosDoLocal;
    dias?: PrevisaoDia[];
    alertas?: Alerta[];
};

export default function SecaoCompromissos({ c, dias = [], alertas = [] }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // compromisso tocado: abre o menu com a previsão, Editar e Excluir
    const [selecionado, setSelecionado] = useState<Compromisso | null>(null);

    // previsão do dia (undefined se estiver fora dos 16 dias)
    function diaDo(compromisso: Compromisso) {
        return dias.find((d) => d.data === compromisso.data.slice(0, 10));
    }

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
                <AvisoLinha
                    icone="calendar-outline"
                    texto={
                        c.carregando
                            ? "Carregando..."
                            : "Nenhum compromisso marcado aqui. Toque em + Novo."
                    }
                />
            )}

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
                        onPress: () => selecionado && c.excluir(selecionado),
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
