import { Pressable, StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaAuth from "../components/TelaAuth";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import Selo from "../components/Selo";
import TextoComLink from "../components/TextoComLink";
import { useTema } from "../theme/TemaContext";
import { useLogin } from "../hooks/useLogin";
import { USAR_MOCK } from "../services/auth/authService";
import { toastAviso } from "../utils/toast";
import { Cores } from "../theme/cores";

export default function Login() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();

    // tudo que a tela precisa vem do hook
    const { email, setEmail, senha, setSenha, erros, carregando, enviar } = useLogin();

    // selo do usuário de teste: só aparece enquanto o login é falso (mock)
    const rodape = USAR_MOCK ? (
        <Selo
            texto="Modo teste: teste@gs.com / 123456"
            cor="neutro"
            icone="flask-outline"
            centralizado
        />
    ) : undefined;

    return (
        <TelaAuth
            titulo="Bem-vindo de volta 👋"
            subtitulo="Entre para ver o clima dos seus locais."
            rodape={rodape}
        >
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

            {/* ainda não existe recuperação de senha: só avisa */}
            <Pressable
                style={estilos.esqueceu}
                hitSlop={10}
                onPress={() => toastAviso("Recuperação de senha em breve.")}
            >
                <Text style={estilos.textoEsqueceu}>Esqueceu sua senha?</Text>
            </Pressable>

            <Botao texto="Entrar" icone="log-in-outline" onPress={enviar} carregando={carregando} />

            <TextoComLink
                texto="Não tem uma conta?"
                link="Cadastre-se"
                onPress={() => navigation.navigate("Cadastro")}
            />
        </TelaAuth>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        esqueceu: {
            alignSelf: "flex-end", // joga o link para a direita
            marginTop: -6, // gruda um pouco no campo de senha
        },
        textoEsqueceu: {
            fontSize: 13,
            fontWeight: "700",
            color: cores.primaria,
        },
    });
}
