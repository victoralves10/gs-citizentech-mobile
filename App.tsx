import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { TemaProvider, useTema } from "./src/theme/TemaContext";
import TelaBase from "./src/components/TelaBase";
import CampoTexto from "./src/components/CampoTexto";
import Botao from "./src/components/Botao";
import ToastTema from "./src/components/ToastTema";
import { toastAviso, toastErro, toastSucesso } from "./src/utils/toast";

export default function App() {
    return (
        <SafeAreaProvider>
            <TemaProvider>
                <TesteComponentes />
                <ToastTema />
            </TemaProvider>
        </SafeAreaProvider>
    );
}

// tela de teste dos componentes
function TesteComponentes() {
    const { cores, escuro, mudarPreferencia } = useTema();

    // o que foi digitado nos campos
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    // se o botão "Entrar" está carregando
    const [carregando, setCarregando] = useState(false);

    // simula um login: espera 2 segundos e mostra um toast
    function testarCarregando() {
        setCarregando(true);
        setTimeout(() => {
            setCarregando(false);
            toastSucesso("Deu certo!");
        }, 2000);
    }

    return (
        <TelaBase>
            <Text style={[estilos.titulo, { color: cores.texto }]}>Teste dos componentes</Text>

            <CampoTexto
                rotulo="E-mail"
                icone="mail-outline"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <CampoTexto
                rotulo="Senha"
                icone="lock-closed-outline"
                placeholder="Sua senha"
                value={senha}
                onChangeText={setSenha}
                senha
                erro={senha.length > 0 && senha.length < 6 ? "Mínimo de 6 caracteres." : undefined}
            />

            <Botao texto="Testar carregando" onPress={testarCarregando} carregando={carregando} />
            <Botao
                texto="Toast de erro"
                variante="contorno"
                onPress={() => toastErro("Deu erro!")}
            />
            <Botao
                texto="Toast de aviso"
                variante="contorno"
                onPress={() => toastAviso("Só um aviso.")}
            />

            <View style={estilos.linha}>
                <Botao
                    texto="Claro"
                    variante="contorno"
                    onPress={() => mudarPreferencia("claro")}
                />
                <Botao
                    texto="Escuro"
                    variante="contorno"
                    onPress={() => mudarPreferencia("escuro")}
                />
            </View>

            <StatusBar style={escuro ? "light" : "dark"} />
        </TelaBase>
    );
}

const estilos = StyleSheet.create({
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
    },
    linha: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 12,
    },
});
