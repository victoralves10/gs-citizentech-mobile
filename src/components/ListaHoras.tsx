import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PrevisaoHora } from "../models/Previsao";
import { iconeDoClima } from "../utils/clima";
import { hora, porcentagem, temperatura } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

// Próximas horas em fileira que rola para o lado
type Props = {
    horas: PrevisaoHora[];
};

export default function ListaHoras({ horas }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={estilos.fileira}
        >
            {horas.map((item, indice) => {
                const agora = indice === 0;
                const chuvaAlta = (item.probabilidadeChuva ?? 0) >= 30;
                return (
                    <View key={item.hora} style={[estilos.coluna, agora && estilos.colunaAgora]}>
                        <Text style={[estilos.hora, agora && estilos.textoAgora]}>
                            {agora ? "Agora" : hora(item.hora)}
                        </Text>
                        <Ionicons
                            name={iconeDoClima(item.categoria, item.ehDia)}
                            size={24}
                            color={agora ? cores.textoSobreCor : cores.primaria}
                        />
                        <Text style={[estilos.temperatura, agora && estilos.textoAgora]}>
                            {temperatura(item.temperatura)}
                        </Text>
                        <Text
                            style={[
                                estilos.chuva,
                                chuvaAlta && estilos.chuvaAlta,
                                agora && estilos.textoAgora,
                            ]}
                        >
                            {porcentagem(item.probabilidadeChuva)}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        fileira: {
            gap: 8,
            paddingRight: 4,
        },
        coluna: {
            width: 64,
            alignItems: "center",
            gap: 6,
            paddingVertical: 12,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        colunaAgora: {
            borderColor: cores.primaria,
            backgroundColor: cores.primaria,
        },
        hora: {
            fontSize: 13,
            fontWeight: "600",
            color: cores.textoSecundario,
        },
        temperatura: {
            fontSize: 16,
            fontWeight: "800",
            color: cores.texto,
        },
        chuva: {
            fontSize: 12,
            color: cores.textoSuave,
        },
        chuvaAlta: {
            fontWeight: "700",
            color: cores.primaria,
            backgroundColor: transparente(cores.primaria, 0.1),
            paddingHorizontal: 6,
            borderRadius: 8,
            overflow: "hidden",
        },
        textoAgora: {
            color: cores.textoSobreCor,
            backgroundColor: "transparent",
        },
    });
}
