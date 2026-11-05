import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TelaBase from "../components/TelaBase";
import Botao from "../components/Botao";
import { useTema, PreferenciaTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { Cores } from "../theme/cores";

// as 3 opções de tema, com o texto e o ícone de cada uma
const OPCOES_TEMA: {
    valor: PreferenciaTema;
    texto: string;
    icone: "phone-portrait-outline" | "sunny-outline" | "moon-outline";
}[] = [
    { valor: "automatico", texto: "Automático", icone: "phone-portrait-outline" },
    { valor: "claro", texto: "Claro", icone: "sunny-outline" },
    { valor: "escuro", texto: "Escuro", icone: "moon-outline" },
];

export default function Perfil() {
    const { cores, preferencia, mudarPreferencia } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { usuario, sair } = useAuth();

    // primeira letra do nome, para o círculo (ex.: "V")
    const inicial = usuario ? usuario.nome.charAt(0).toUpperCase() : "?";

    // pergunta antes de sair (Alert = a caixinha de confirmação do próprio celular)
    function confirmarSaida() {
        Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: sair },
        ]);
    }

    return (
        <TelaBase>
            <Text style={estilos.titulo}>Perfil</Text>

            {/* cartão com os dados do usuário */}
            <View style={estilos.cartao}>
                <View style={estilos.avatar}>
                    <Text style={estilos.inicial}>{inicial}</Text>
                </View>
                <View style={estilos.dados}>
                    <Text style={estilos.nome}>{usuario?.nome}</Text>
                    <Text style={estilos.email}>{usuario?.email}</Text>
                </View>
            </View>

            {/* escolha do tema */}
            <Text style={estilos.secao}>Aparência</Text>
            <View style={estilos.opcoes}>
                {OPCOES_TEMA.map((opcao) => {
                    const ativa = preferencia === opcao.valor;
                    return (
                        <Pressable
                            key={opcao.valor}
                            onPress={() => mudarPreferencia(opcao.valor)}
                            style={[estilos.opcao, ativa && estilos.opcaoAtiva]}
                        >
                            <Ionicons
                                name={opcao.icone}
                                size={20}
                                color={ativa ? cores.textoSobreCor : cores.texto}
                            />
                            <Text style={[estilos.textoOpcao, ativa && estilos.textoAtivo]}>
                                {opcao.texto}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* ações */}
            <Text style={estilos.secao}>Conta</Text>
            <Botao
                texto="Sobre o App"
                variante="contorno"
                onPress={() => navigation.navigate("SobreApp")}
            />
            <Botao texto="Sair" onPress={confirmarSaida} />
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        titulo: {
            fontSize: 26,
            fontWeight: "bold",
            color: cores.texto,
        },
        cartao: {
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            padding: 16,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        avatar: {
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: cores.primaria,
        },
        inicial: {
            fontSize: 24,
            fontWeight: "bold",
            color: cores.textoSobreCor,
        },
        dados: {
            flex: 1,
            gap: 2,
        },
        nome: {
            fontSize: 18,
            fontWeight: "bold",
            color: cores.texto,
        },
        email: {
            fontSize: 14,
            color: cores.textoSecundario,
        },
        secao: {
            marginTop: 8,
            fontSize: 14,
            fontWeight: "700",
            color: cores.textoSecundario,
        },
        opcoes: {
            flexDirection: "row",
            gap: 8,
        },
        opcao: {
            flex: 1, // as 3 opções dividem a largura por igual
            alignItems: "center",
            gap: 6,
            paddingVertical: 12,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        opcaoAtiva: {
            backgroundColor: cores.primaria,
            borderColor: cores.primaria,
        },
        textoOpcao: {
            fontSize: 13,
            fontWeight: "600",
            color: cores.texto,
        },
        textoAtivo: {
            color: cores.textoSobreCor,
        },
    });
}
