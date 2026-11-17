import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import { PrevisaoDia } from "../models/Previsao";
import { iconeDoClima } from "../utils/clima";
import { diaSemana, porcentagem, temperatura } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

type Props = {
    dias: PrevisaoDia[];
};

export default function ListaDias({ dias }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // a menor mínima e a maior máxima de TODOS os dias (para desenhar as barrinhas)
    const minimas = dias.map((d) => d.temperaturaMinima ?? 0);
    const maximas = dias.map((d) => d.temperaturaMaxima ?? 0);
    const menor = Math.min(...minimas);
    const maior = Math.max(...maximas);
    const faixa = Math.max(1, maior - menor); // evita dividir por zero

    return (
        <Cartao semEspaco>
            {dias.map((dia, indice) => {
                // onde a barrinha começa e qual a largura (em %)
                const inicio = (((dia.temperaturaMinima ?? menor) - menor) / faixa) * 100;
                const largura =
                    (((dia.temperaturaMaxima ?? maior) - (dia.temperaturaMinima ?? menor)) /
                        faixa) *
                    100;
                const chuvaAlta = (dia.probabilidadeChuva ?? 0) >= 30;

                return (
                    <View
                        key={dia.data}
                        style={[
                            estilos.linha,
                            indice > 0 && estilos.divisor,
                            dia.previsaoIncerta && estilos.incerta,
                        ]}
                    >
                        {/* dia da semana + data */}
                        <View style={estilos.colunaDia}>
                            <Text style={estilos.dia}>{diaSemana(dia.data)}</Text>
                            <Text style={estilos.data}>
                                {dia.data.slice(8, 10)}/{dia.data.slice(5, 7)}
                            </Text>
                        </View>

                        {/* ícone + chance de chuva */}
                        <Ionicons
                            name={iconeDoClima(dia.categoria)}
                            size={22}
                            color={cores.primaria}
                        />
                        <Text style={[estilos.chuva, chuvaAlta && estilos.chuvaAlta]}>
                            {porcentagem(dia.probabilidadeChuva)}
                        </Text>

                        {/* mínima ▬▬▬ máxima */}
                        <Text style={estilos.minima}>{temperatura(dia.temperaturaMinima)}</Text>
                        <View style={estilos.trilho}>
                            <View
                                style={[
                                    estilos.barra,
                                    { left: `${inicio}%`, width: `${Math.max(largura, 8)}%` },
                                ]}
                            />
                        </View>
                        <Text style={estilos.maxima}>{temperatura(dia.temperaturaMaxima)}</Text>
                    </View>
                );
            })}
        </Cartao>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        linha: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 16,
            paddingVertical: 12,
        },
        divisor: {
            borderTopWidth: 1,
            borderTopColor: cores.borda,
        },
        incerta: {
            opacity: 0.55, // dia distante: previsão menos confiável
        },
        colunaDia: {
            width: 44,
        },
        dia: {
            fontSize: 15,
            fontWeight: "700",
            color: cores.texto,
        },
        data: {
            fontSize: 12,
            color: cores.textoSuave,
        },
        chuva: {
            width: 40,
            fontSize: 13,
            color: cores.textoSuave,
        },
        chuvaAlta: {
            fontWeight: "700",
            color: cores.primaria,
        },
        minima: {
            width: 32,
            textAlign: "right",
            fontSize: 14,
            color: cores.textoSecundario,
        },
        trilho: {
            flex: 1,
            height: 6,
            borderRadius: 3,
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        barra: {
            position: "absolute",
            height: 6,
            borderRadius: 3,
            backgroundColor: cores.primaria,
        },
        maxima: {
            width: 32,
            fontSize: 14,
            fontWeight: "800",
            color: cores.texto,
        },
    });
}
