import { Pressable, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import TituloSecao from "../components/TituloSecao";
import BlocoVazio from "../components/BlocoVazio";
import Botao from "../components/Botao";
import Selo from "../components/Selo";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { Cores } from "../theme/cores";

// "Bom dia" até 11h59, "Boa tarde" até 17h59, depois "Boa noite"
function saudacao() {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

export default function Home() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { usuario } = useAuth();

    // só o primeiro nome: "Victor Alves" → "Victor"
    const primeiroNome = usuario?.nome.split(" ")[0] ?? "";

    return (
        <TelaBase>
            <View>
                <CabecalhoTela
                    acima={`${saudacao()}, ${primeiroNome}`}
                    titulo="Seu local principal"
                    subtitulo="Cadastre um local para ver o clima aqui"
                    direita={
                        // sino: atalho para a aba Alertas
                        <Pressable
                            style={estilos.sino}
                            hitSlop={8}
                            onPress={() => navigation.navigate("Alertas")}
                        >
                            <Ionicons name="notifications-outline" size={22} color={cores.texto} />
                        </Pressable>
                    }
                />

                {/* clima agora + botão para os detalhes */}
                <View style={estilos.blocoComBotao}>
                    <BlocoVazio titulo="Clima agora" icone="partly-sunny-outline" altura={170} />
                    <Botao
                        texto="Ver mais detalhes"
                        icone="arrow-forward"
                        variante="contorno"
                        onPress={() => navigation.navigate("DetalhesLocal")}
                    />
                </View>

                <TituloSecao
                    titulo="Explicação do dia"
                    selo={<Selo texto="IA" cor="secundaria" />}
                />
                <BlocoVazio titulo="Texto da IA sobre o dia" icone="sparkles-outline" />

                <TituloSecao titulo="Alertas de hoje" />
                <BlocoVazio titulo="Alertas do local principal" icone="warning-outline" />

                <TituloSecao titulo="Dicas para hoje" />
                <BlocoVazio titulo="Guarda-chuva, protetor, casaco..." icone="umbrella-outline" />

                <TituloSecao titulo="Hoje, hora a hora" />
                <BlocoVazio
                    titulo="Gráfico de temperatura e chuva"
                    icone="stats-chart-outline"
                    altura={170}
                />

                <TituloSecao titulo="A previsão mudou" />
                <BlocoVazio
                    titulo="Mudanças bruscas nos seus locais"
                    icone="trending-down-outline"
                />

                <TituloSecao titulo="Seus próximos eventos" />
                <BlocoVazio titulo="Eventos e o clima de cada um" icone="calendar-outline" />
            </View>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        sino: {
            width: 44,
            height: 44,
            borderRadius: 22,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: cores.superficie,
            borderWidth: 1,
            borderColor: cores.borda,
        },
        blocoComBotao: {
            marginTop: 8,
            gap: 12,
        },
    });
}
