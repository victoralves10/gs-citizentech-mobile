import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Calendar, LocaleConfig } from "react-native-calendars";
import Chip from "./Chip";
import { diaDeHoje, proximosDias } from "../utils/datas";
import { dataCurta, diaSemana } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Campo de data com calendário e atalhos dos próximos 7 dias (dias passados bloqueados)

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
    valor: string; // "2026-11-25" ou ""
    onMudar: (valor: string) => void;
    erro?: string;
};

export default function SeletorData({ rotulo, valor, onMudar, erro }: Props) {
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

            <Pressable
                style={[estilos.campo, aberto && estilos.campoAberto, erro && estilos.campoErro]}
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

            {erro && <Text style={estilos.erro}>{erro}</Text>}

            {aberto ? (
                <Calendar
                    key={cores.fundo} // recria ao trocar o tema
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
            ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={estilos.atalhos}>
                        {proximosDias(7).map((dia, indice) => (
                            <Chip
                                key={dia}
                                texto={indice === 1 ? "Amanhã" : diaSemana(dia)}
                                subtexto={`${dia.slice(8, 10)}/${dia.slice(5, 7)}`}
                                ativo={valor === dia}
                                onPress={() => escolher(dia)}
                            />
                        ))}
                    </View>
                </ScrollView>
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
        campoErro: {
            borderColor: cores.erro,
        },
        erro: {
            fontSize: 13,
            color: cores.erro,
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
        calendario: {
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            overflow: "hidden",
        },
    });
}
