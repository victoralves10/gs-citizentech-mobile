// Previsão completa de um dia (fica no menu do compromisso).
// Céu, mín/máx, chuva, alertas daquele dia e o aviso de "previsão incerta".
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import { Alerta, PrevisaoDia } from "../models/Previsao";
import { corDaGravidade, iconeDoAlerta, iconeDoClima } from "../utils/clima";
import { milimetros, porcentagem, temperatura } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

type Props = {
    dia?: PrevisaoDia; // undefined: o dia está fora dos 16 dias
    alertas: Alerta[]; // só os alertas deste dia
};

export default function ResumoDoDia({ dia, alertas }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    if (!dia) {
        return (
            <Cartao>
                <View style={estilos.linha}>
                    <Ionicons name="time-outline" size={22} color={cores.textoSuave} />
                    <Text style={estilos.apoio}>
                        A previsão deste dia ainda não está disponível.
                    </Text>
                </View>
            </Cartao>
        );
    }

    return (
        <Cartao>
            <View style={estilos.conteudo}>
                <View style={estilos.linha}>
                    <Ionicons name={iconeDoClima(dia.categoria)} size={34} color={cores.primaria} />
                    <View style={estilos.textos}>
                        <Text style={estilos.condicao}>{dia.condicao ?? "Previsão do dia"}</Text>
                        <Text style={estilos.info}>
                            Mín {temperatura(dia.temperaturaMinima)} · Máx{" "}
                            {temperatura(dia.temperaturaMaxima)}
                        </Text>
                        <Text style={estilos.info}>
                            Chuva {porcentagem(dia.probabilidadeChuva)} ·{" "}
                            {milimetros(dia.volumeChuva)}
                        </Text>
                    </View>
                </View>

                {alertas.map((alerta, indice) => (
                    <View key={alerta.id ?? indice} style={estilos.linha}>
                        <Ionicons
                            name={iconeDoAlerta(alerta.tipo)}
                            size={18}
                            color={corDaGravidade(alerta.gravidade, cores)}
                        />
                        <Text style={estilos.alerta}>{alerta.titulo}</Text>
                    </View>
                ))}

                {dia.previsaoIncerta && (
                    <Text style={estilos.incerta}>
                        Previsão ainda incerta: o dia está longe e pode mudar.
                    </Text>
                )}
            </View>
        </Cartao>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        conteudo: {
            gap: 10,
        },
        linha: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
        },
        textos: {
            flex: 1,
            gap: 2,
        },
        condicao: {
            fontSize: 16,
            fontWeight: "700",
            color: cores.texto,
        },
        info: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
        apoio: {
            flex: 1,
            fontSize: 14,
            color: cores.textoSecundario,
        },
        alerta: {
            flex: 1,
            fontSize: 14,
            fontWeight: "600",
            color: cores.texto,
        },
        incerta: {
            fontSize: 13,
            fontStyle: "italic",
            color: cores.textoSuave,
        },
    });
}
