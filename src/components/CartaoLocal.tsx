import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Cartao from "./Cartao";
import Selo from "./Selo";
import Interruptor from "./Interruptor";
import { LocalCard } from "../models/Local";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

type Props = {
    local: LocalCard;
    onAlertas: (ligar: boolean) => void; // tocou no interruptor (true = ligou)
    onOpcoes: () => void; // tocou no cartão ou nos "⋮"
};

export default function CartaoLocal({ local, onAlertas, onOpcoes }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <Cartao semEspaco onPress={onOpcoes}>
            {/* ---------- parte de cima: ícone, nomes e ⋮ ---------- */}
            <View style={estilos.topo}>
                {/* o principal ganha a casinha; os outros, o alfinete */}
                <View style={[estilos.icone, local.principal && estilos.iconePrincipal]}>
                    <Ionicons
                        name={local.principal ? "home" : "location"}
                        size={20}
                        color={local.principal ? cores.textoSobreCor : cores.primaria}
                    />
                </View>

                <View style={estilos.textos}>
                    <View style={estilos.linhaApelido}>
                        <Text style={estilos.apelido} numberOfLines={1}>
                            {local.apelido}
                        </Text>
                        {local.principal && <Selo texto="Principal" icone="star" />}
                    </View>
                    <Text style={estilos.endereco} numberOfLines={1}>
                        {local.nome} · {local.cidade}
                    </Text>
                </View>

                <Pressable onPress={onOpcoes} hitSlop={12}>
                    <Ionicons name="ellipsis-vertical" size={20} color={cores.textoSuave} />
                </Pressable>
            </View>

            {/* ---------- parte de baixo: interruptor de alertas ---------- */}
            <View style={estilos.rodape}>
                <Ionicons
                    name={local.receberAlertas ? "notifications" : "notifications-off-outline"}
                    size={18}
                    color={local.receberAlertas ? cores.primaria : cores.textoSuave}
                />
                <Text style={estilos.textoAlertas}>Receber alertas</Text>
                <Interruptor valor={local.receberAlertas} onMudar={onAlertas} />
            </View>
        </Cartao>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        topo: {
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            padding: 16,
        },
        icone: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: transparente(cores.primaria, 0.12),
        },
        iconePrincipal: {
            backgroundColor: cores.primaria,
        },
        textos: {
            flex: 1,
            gap: 2,
        },
        linhaApelido: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
        },
        apelido: {
            flexShrink: 1, // apelido grande encolhe, o selo continua aparecendo
            fontSize: 17,
            fontWeight: "800",
            color: cores.texto,
        },
        endereco: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
        rodape: {
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderTopWidth: 1,
            borderTopColor: cores.borda,
        },
        textoAlertas: {
            flex: 1,
            fontSize: 14,
            color: cores.textoSecundario,
        },
    });
}
