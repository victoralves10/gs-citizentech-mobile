import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { useTema } from "../theme/TemaContext";
import { useCadastro } from "../hooks/useCadastro";
import { Cores } from "../theme/cores";

export default function Cadastro() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
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
        <TelaBase comCabecalho>
            <View style={estilos.topo}>
                <Text style={estilos.titulo}>Criar conta</Text>
                <Text style={estilos.subtitulo}>Preencha seus dados para começar.</Text>
            </View>

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

            <Botao texto="Cadastrar" onPress={enviar} carregando={carregando} />
            <Botao texto="Já tenho conta" variante="contorno" onPress={() => navigation.goBack()} />
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        topo: {
            marginTop: 8,
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
    });
}
