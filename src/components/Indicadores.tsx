import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClimaAtual } from "../models/Previsao";
import { horario, porcentagem, velocidade } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

type Props = {
    clima: ClimaAtual;
    completo?: boolean;
};

type Indicador = {
    icone: keyof typeof Ionicons.glyphMap;
    valor: string;
    rotulo: string;
};

export default function Indicadores({ clima, completo = false }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // os 4 de sempre
    const lista: Indicador[] = [
        { icone: "water-outline", valor: porcentagem(clima.umidade), rotulo: "Umidade" },
        {
            icone: "flag-outline",
            valor: velocidade(clima.vento?.velocidade),
            rotulo: clima.vento?.direcao ? `Vento ${clima.vento.direcao}` : "Vento",
        },
        {
            icone: "umbrella-outline",
            valor: porcentagem(clima.probabilidadeChuva),
            rotulo: "Chance de chuva",
        },
        {
            icone: "sunny-outline",
            valor: clima.indiceUV?.valor != null ? String(Math.round(clima.indiceUV.valor)) : "--",
            // a classificação ("Muito alto") já vem pronta da API
            rotulo: clima.indiceUV?.descricao ? `UV ${clima.indiceUV.descricao}` : "Índice UV",
        },
    ];

    // os extras da tela Detalhes
    if (completo) {
        lista.push(
            {
                icone: "speedometer-outline",
                valor: velocidade(clima.rajada?.valor),
                rotulo: clima.rajada?.descricao ? `Rajadas ${clima.rajada.descricao}` : "Rajadas",
            },
            { icone: "sunny", valor: horario(clima.sol?.nascer), rotulo: "Nascer do sol" },
            { icone: "moon-outline", valor: horario(clima.sol?.por), rotulo: "Pôr do sol" }
        );
    }

    return (
        <View style={estilos.grade}>
            {lista.map((item) => (
                <View key={item.rotulo} style={estilos.quadrado}>
                    <View style={estilos.icone}>
                        <Ionicons name={item.icone} size={18} color={cores.primaria} />
                    </View>
                    <View style={estilos.textos}>
                        <Text style={estilos.valor}>{item.valor}</Text>
                        <Text style={estilos.rotulo}>{item.rotulo}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        grade: {
            flexDirection: "row",
            flexWrap: "wrap", // 2 por linha
            gap: 10,
        },
        quadrado: {
            // 2 por linha: metade da largura menos metade do espaço entre eles
            width: "48%",
            flexGrow: 1,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            padding: 12,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        icone: {
            width: 34,
            height: 34,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        textos: {
            flex: 1,
        },
        valor: {
            fontSize: 16,
            fontWeight: "800",
            color: cores.texto,
        },
        rotulo: {
            flexShrink: 1, // deixa o texto quebrar a linha em vez de sumir
            fontSize: 12,
            color: cores.textoSecundario,
        },
    });
}
