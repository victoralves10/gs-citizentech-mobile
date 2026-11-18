import { useNavigation } from "@react-navigation/native";
import TelaAuth from "../components/TelaAuth";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import TextoComLink from "../components/TextoComLink";
import { useLogin } from "../hooks/useLogin";

// Login com a API (a lógica fica no useLogin)
export default function Login() {
    const navigation = useNavigation();
    const { email, setEmail, senha, setSenha, erros, carregando, enviar } = useLogin();

    return (
        <TelaAuth
            titulo="Bem-vindo de volta 👋"
            subtitulo="Entre para ver o clima dos seus locais."
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

            <Botao texto="Entrar" icone="log-in-outline" onPress={enviar} carregando={carregando} />

            <TextoComLink
                texto="Não tem uma conta?"
                link="Cadastre-se"
                onPress={() => navigation.navigate("Cadastro")}
            />
        </TelaAuth>
    );
}
