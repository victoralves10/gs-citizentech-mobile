import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { ClimaAtual, LocalResumo } from "../models/Previsao";
import { iconeDoClima } from "../utils/clima";
import { temperatura, tempoAtras } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Cartão azul com o clima de agora
type Props = {
    local: LocalResumo;
    clima: ClimaAtual;
    atualizadoEm: string | null;
};

export default function CartaoClimaAgora({ local, clima, atualizadoEm }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <LinearGradient
            colors={[cores.primaria, cores.primariaForte]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={estilos.cartao}
        >
            <View style={estilos.bolha} />

            {/* Local e horário */}
            <View style={estilos.topo}>
                <Ionicons name="location" size={14} color={cores.textoSobreCor} />
                <Text style={estilos.local} numberOfLines={1}>
                    {local.apelido} · {local.nome}
                </Text>
                <Text style={estilos.atualizado}>{tempoAtras(atualizadoEm)}</Text>
            </View>

            {/* Agora */}
            <View style={estilos.meio}>
                <Ionicons
                    name={iconeDoClima(clima.categoria, clima.ehDia)}
                    size={64}
                    color={cores.textoSobreCor}
                />
                <View>
                    <Text style={estilos.temperatura}>{temperatura(clima.temperatura)}</Text>
                    <Text style={estilos.condicao}>{clima.condicao ?? "--"}</Text>
                </View>
            </View>

            {/* Máxima, mínima e sensação */}
            <Text style={estilos.rodape}>
                Máx {temperatura(clima.temperaturaMaxima)} · Mín{" "}
                {temperatura(clima.temperaturaMinima)} · Sensação{" "}
                {temperatura(clima.sensacaoTermica)}
            </Text>
        </LinearGradient>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        cartao: {
            padding: 20,
            borderRadius: 24,
            gap: 14,
            overflow: "hidden", // corta a bolha que passa da borda
        },
        bolha: {
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            top: -80,
            right: -60,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
        },
        topo: {
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
        },
        local: {
            flex: 1,
            fontSize: 14,
            fontWeight: "700",
            color: cores.textoSobreCor,
        },
        atualizado: {
            fontSize: 12,
            color: cores.textoSobreCor,
            opacity: 0.8,
        },
        meio: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
        },
        temperatura: {
            fontSize: 56,
            fontWeight: "800",
            color: cores.textoSobreCor,
            lineHeight: 62,
        },
        condicao: {
            fontSize: 16,
            fontWeight: "600",
            color: cores.textoSobreCor,
        },
        rodape: {
            fontSize: 14,
            color: cores.textoSobreCor,
            opacity: 0.9,
        },
    });
}
