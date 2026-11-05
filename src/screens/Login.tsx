import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import CampoTexto from "../components/CampoTexto";
import Botao from "../components/Botao";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { Cores } from "../theme/cores";

export default function Login() {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    // navigation = o "controle remoto" para trocar de tela
    const navigation = useNavigation();
    const { entrar } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

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
            />

            <Botao texto="Entrar" onPress={entrar} />

            {/* navega para a tela de Cadastro (que fica por cima do Login) */}
            <Botao
                texto="Criar conta"
                variante="contorno"
                onPress={() => navigation.navigate("Cadastro")}
            />
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
    });
}
