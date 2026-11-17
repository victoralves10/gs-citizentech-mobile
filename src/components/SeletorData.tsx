// Campo de data que abre um calendário (react-native-calendars), igual ao do Clyvo.
// Guarda a data no formato da API ("2026-11-25") e bloqueia os dias que já passaram.
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { proximosDias } from "../utils/campoData";
import { dataCurta, diaDeHoje, diaSemana } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores, transparente } from "../theme/cores";

// calendário em português
LocaleConfig.locales["pt-br"] = {
    monthNames: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ],
    monthNamesShort: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
    ],
    dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
    today: "Hoje",
};
LocaleConfig.defaultLocale = "pt-br";

type Props = {
    rotulo: string;
    valor: string; // "2026-11-25" ou "" (nenhuma escolhida)
    onMudar: (valor: string) => void;
};

export default function SeletorData({ rotulo, valor, onMudar }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const [aberto, setAberto] = useState(false);

    function escolher(dia: string) {
        onMudar(dia);
        setAberto(false);
    }

    return (
        <View style={estilos.bloco}>
            <Text style={estilos.rotulo}>{rotulo}</Text>

            {/* o campo: mostra a data escolhida e abre/fecha o calendário */}
            <Pressable
                style={[estilos.campo, aberto && estilos.campoAberto]}
                onPress={() => setAberto(!aberto)}
            >
                <Ionicons name="calendar-outline" size={20} color={cores.textoSuave} />
                <Text style={[estilos.texto, !valor && estilos.placeholder]}>
                    {valor
                        ? `${dataCurta(valor)} · ${valor.split("-").reverse().join("/")}`
                        : "Escolha a data"}
                </Text>
                <Ionicons
                    name={aberto ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={cores.textoSuave}
                />
            </Pressable>

            {/* atalhos: os próximos 7 dias (somem com o calendário aberto) */}
            {!aberto && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={estilos.atalhos}>
                        {proximosDias(7).map((dia, indice) => {
                            const ativo = valor === dia;
                            return (
                                <Pressable
                                    key={dia}
                                    onPress={() => escolher(dia)}
                                    style={[estilos.atalho, ativo && estilos.atalhoAtivo]}
                                >
                                    <Text style={[estilos.dia, ativo && estilos.textoAtivo]}>
                                        {indice === 1 ? "Amanhã" : diaSemana(dia)}
                                    </Text>
                                    <Text style={[estilos.data, ativo && estilos.textoAtivo]}>
                                        {dia.slice(8, 10)}/{dia.slice(5, 7)}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </ScrollView>
            )}

            {/* o calendário (dias passados ficam apagados) */}
            {aberto && (
                <Calendar
                    // a key recria o calendário quando o tema muda (claro/escuro)
                    key={cores.fundo}
                    current={valor || undefined}
                    minDate={diaDeHoje()}
                    markedDates={
                        valor ? { [valor]: { selected: true, selectedColor: cores.primaria } } : {}
                    }
                    onDayPress={(dia) => escolher(dia.dateString)}
                    style={estilos.calendario}
                    theme={{
                        calendarBackground: cores.superficie,
                        dayTextColor: cores.texto,
                        textDisabledColor: cores.textoSuave,
                        monthTextColor: cores.texto,
                        textSectionTitleColor: cores.textoSecundario,
                        todayTextColor: cores.primaria,
                        arrowColor: cores.primaria,
                        selectedDayTextColor: cores.textoSobreCor,
                    }}
                />
            )}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        bloco: {
            gap: 8,
        },
        rotulo: {
            fontSize: 14,
            fontWeight: "600",
            color: cores.texto,
        },
        campo: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 14,
            height: 52,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        campoAberto: {
            borderColor: cores.primaria,
        },
        texto: {
            flex: 1,
            fontSize: 15,
            color: cores.texto,
        },
        placeholder: {
            color: cores.textoSuave,
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
        calendario: {
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            overflow: "hidden",
        },
    });
}
