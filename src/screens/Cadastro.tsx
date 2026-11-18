import { useNavigation } from "@react-navigation/native";
import TelaAuth from "../components/TelaAuth";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import TextoComLink from "../components/TextoComLink";
import { useCadastro } from "../hooks/useCadastro";

// Cadastro com a API (a lógica fica no useCadastro)
export default function Cadastro() {
    const navigation = useNavigation();

    const {
        nome,
        setNome,
        email,
        setEmail,
        senha,
        setSenha,
        confirmarSenha,
        setConfirmarSenha,
        erros,
        carregando,
        enviar,
    } = useCadastro();

    return (
        <TelaAuth
            titulo="Crie sua conta ☀️"
            subtitulo="Salve seus locais e receba avisos quando o tempo mudar."
            onVoltar={() => navigation.goBack()}
        >
            <CampoTexto
                rotulo="Nome"
                icone="person-outline"
                placeholder="Seu nome"
                value={nome}
                onChangeText={setNome}
                erro={erros.nome}
            />
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
                placeholder="Mínimo de 6 caracteres"
                value={senha}
                onChangeText={setSenha}
                erro={erros.senha}
                senha
            />
            <CampoTexto
                rotulo="Confirmar senha"
                icone="lock-closed-outline"
                placeholder="Digite a senha de novo"
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
                erro={erros.confirmarSenha}
                senha
            />

            <Botao
                texto="Criar conta"
                icone="person-add-outline"
                onPress={enviar}
                carregando={carregando}
            />

            <TextoComLink texto="Já tem conta?" link="Entrar" onPress={() => navigation.goBack()} />
        </TelaAuth>
    );
}
