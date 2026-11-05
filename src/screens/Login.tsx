import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { useTema } from "../theme/TemaContext";
import { useLogin } from "../hooks/useLogin";
import { USAR_MOCK } from "../services/auth/authService";
import { Cores } from "../theme/cores";

export default function Login() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();

    // tudo que a tela precisa vem do hook
    const { email, setEmail, senha, setSenha, erros, carregando, enviar } = useLogin();

    return (
        <TelaBase>
            <View style={estilos.topo}>
                <Text style={estilos.titulo}>Entrar</Text>
                <Text style={estilos.subtitulo}>Acesse sua conta para continuar.</Text>
            </View>

            <CampoTexto
                rotulo="E-mail"
                icone="mail-outline"
                placeholder="seu@email.com"
                value={email}
                onChangeText={setEmail}
                erro={erros.email}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <CampoTexto
                rotulo="Senha"
                icone="lock-closed-outline"
                placeholder="Sua senha"
                value={senha}
                onChangeText={setSenha}
                erro={erros.senha}
                senha
            />

            <Botao texto="Entrar" onPress={enviar} carregando={carregando} />
            <Botao
                texto="Criar conta"
                variante="contorno"
                onPress={() => navigation.navigate("Cadastro")}
            />

            {/* dica que só aparece enquanto o login é falso (mock) */}
            {USAR_MOCK && <Text style={estilos.dica}>Modo teste: teste@gs.com / 123456</Text>}
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        topo: {
            marginTop: 40,
            marginBottom: 16,
            gap: 6,
        },
        titulo: {
            fontSize: 30,
            fontWeight: "bold",
            color: cores.texto,
        },
        subtitulo: {
            fontSize: 15,
            color: cores.textoSecundario,
        },
        dica: {
            textAlign: "center",
            fontSize: 13,
            color: cores.textoSuave,
        },
    });
}
