import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { Cores } from "../theme/cores";

export default function Cadastro() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { entrar } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

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
            />
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
                placeholder="Crie uma senha"
                value={senha}
                onChangeText={setSenha}
                senha
            />

            <Botao texto="Cadastrar" onPress={entrar} />

            {/* goBack() = volta para a tela anterior (o Login) */}
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
