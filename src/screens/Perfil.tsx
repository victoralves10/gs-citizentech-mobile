// Tela de Perfil: nome, senha, aparência, Sobre o App, sair e excluir conta.
// Toda a lógica está no hook usePerfil.
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import TelaBase from "../components/TelaBase";
import Cartao from "../components/Cartao";
import TituloSecao from "../components/TituloSecao";
import ItemLista from "../components/ItemLista";
import Segmentado from "../components/Segmentado";
import JanelaEdicao from "../components/JanelaEdicao";
import CampoTexto from "../components/CampoTexto";
import { NOME_DO_APP } from "../components/Marca";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { usePerfil } from "../hooks/usePerfil";
import { Cores } from "../theme/cores";

// pega as iniciais do nome: "Victor Alves" → "VA", "Victor" → "V"
function iniciais(nome?: string) {
    if (!nome) return "?";
    const partes = nome.trim().split(/\s+/); // separa por espaços
    const primeira = partes[0].charAt(0);
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";
    return (primeira + ultima).toUpperCase();
}

export default function Perfil() {
    const { cores, preferencia, mudarPreferencia } = useTema();
    const estilos = criarEstilos(cores);
    const navigation = useNavigation();
    const { sair } = useAuth();

    // tudo que a tela precisa vem do hook
    const perfil = usePerfil();
    const { usuario, campos } = perfil;

    // pergunta antes de sair (Alert = a caixinha de confirmação do próprio celular)
    function confirmarSaida() {
        Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: sair },
        ]);
    }

    // pergunta antes de excluir: não tem volta!
    function confirmarExclusao() {
        Alert.alert(
            "Excluir minha conta",
            "Seus locais e compromissos também serão apagados. Isso não pode ser desfeito.",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Excluir", style: "destructive", onPress: perfil.excluirConta },
            ]
        );
    }

    return (
        <TelaBase>
            {/* View única: assim o espaço entre as seções é controlado pelo TituloSecao */}
            <View>
                <Text style={estilos.tituloTela}>Perfil</Text>

                {/* ---------- CARTÃO DO USUÁRIO (degradê): tocar edita o nome ---------- */}
                <Pressable onPress={perfil.abrirNome}>
                    <LinearGradient
                        colors={[cores.primaria, cores.primariaForte]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={estilos.cartaoUsuario}
                    >
                        {/* enfeite: bolha de luz no canto */}
                        <View style={estilos.bolha} />

                        <View style={estilos.avatar}>
                            <Text style={estilos.iniciais}>{iniciais(usuario?.nome)}</Text>
                        </View>
                        <View style={estilos.dados}>
                            <Text style={estilos.nome} numberOfLines={1}>
                                {usuario?.nome}
                            </Text>
                            <Text style={estilos.email} numberOfLines={1}>
                                {usuario?.email}
                            </Text>
                            <View style={estilos.papel}>
                                <Ionicons
                                    name="person-outline"
                                    size={12}
                                    color={cores.textoSobreCor}
                                />
                                <Text style={estilos.textoPapel}>Cidadão</Text>
                            </View>
                        </View>
                        <Ionicons name="create-outline" size={22} color={cores.textoSobreCor} />
                    </LinearGradient>
                </Pressable>

                {/* ---------- APARÊNCIA (funciona) ---------- */}
                <TituloSecao titulo="Aparência" />
                <Segmentado
                    opcoes={[
                        { valor: "automatico", rotulo: "Automático" },
                        { valor: "claro", rotulo: "Claro" },
                        { valor: "escuro", rotulo: "Escuro" },
                    ]}
                    valor={preferencia}
                    onMudar={mudarPreferencia}
                />

                {/* ---------- CONTA ---------- */}
                <TituloSecao titulo="Conta" />
                <Cartao semEspaco>
                    <ItemLista
                        titulo="Trocar senha"
                        icone="lock-closed-outline"
                        onPress={perfil.abrirSenha}
                    />
                    <ItemLista
                        divisor
                        titulo="Sobre o App"
                        icone="information-circle-outline"
                        onPress={() => navigation.navigate("SobreApp")}
                    />
                    <ItemLista
                        divisor
                        titulo="Ver apresentação de novo"
                        icone="play-circle-outline"
                        onPress={() => navigation.navigate("Apresentacao")}
                    />
                    <ItemLista
                        divisor
                        perigo
                        titulo="Sair"
                        icone="log-out-outline"
                        onPress={confirmarSaida}
                    />
                </Cartao>

                {/* ---------- EXCLUIR CONTA + VERSÃO ---------- */}
                <Pressable
                    onPress={confirmarExclusao}
                    disabled={perfil.excluindo}
                    hitSlop={10}
                    style={estilos.excluir}
                >
                    <Text style={estilos.textoExcluir}>
                        {perfil.excluindo ? "Excluindo..." : "Excluir minha conta"}
                    </Text>
                </Pressable>
                <Text style={estilos.versao}>
                    {NOME_DO_APP} · versão {Constants.expoConfig?.version ?? "-"}
                </Text>
            </View>

            {/* ---------- JANELAS DE EDIÇÃO (só uma aparece por vez) ---------- */}
            <JanelaEdicao
                visivel={perfil.janela === "nome"}
                titulo="Editar nome"
                erro={perfil.erro}
                salvando={perfil.salvando}
                onFechar={perfil.fechar}
                onSalvar={perfil.salvar}
            >
                <CampoTexto
                    rotulo="Nome"
                    icone="person-outline"
                    value={campos.nome}
                    onChangeText={campos.setNome}
                    maxLength={100}
                    autoFocus
                />
            </JanelaEdicao>

            <JanelaEdicao
                visivel={perfil.janela === "senha"}
                titulo="Trocar senha"
                erro={perfil.erro}
                salvando={perfil.salvando}
                onFechar={perfil.fechar}
                onSalvar={perfil.salvar}
                textoSalvar="Trocar"
            >
                <CampoTexto
                    rotulo="Senha atual"
                    icone="lock-closed-outline"
                    senha
                    value={campos.senhaAtual}
                    onChangeText={campos.setSenhaAtual}
                />
                <CampoTexto
                    rotulo="Nova senha"
                    icone="key-outline"
                    senha
                    placeholder="Mínimo de 6 caracteres"
                    value={campos.novaSenha}
                    onChangeText={campos.setNovaSenha}
                />
                <CampoTexto
                    rotulo="Confirmar nova senha"
                    icone="key-outline"
                    senha
                    value={campos.confirmacao}
                    onChangeText={campos.setConfirmacao}
                />
            </JanelaEdicao>
        </TelaBase>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        tituloTela: {
            fontSize: 26,
            fontWeight: "bold",
            color: cores.texto,
            marginBottom: 16,
        },

        // cartão do usuário
        cartaoUsuario: {
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            padding: 20,
            borderRadius: 24,
            overflow: "hidden", // corta a bolha que passa da borda
        },
        bolha: {
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: 90,
            top: -70,
            right: -50,
            backgroundColor: "rgba(255, 255, 255, 0.12)",
        },
        avatar: {
            width: 64,
            height: 64,
            borderRadius: 32,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            borderWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.45)",
        },
        iniciais: {
            fontSize: 22,
            fontWeight: "800",
            color: cores.textoSobreCor,
        },
        dados: {
            flex: 1,
            gap: 2,
        },
        nome: {
            fontSize: 19,
            fontWeight: "800",
            color: cores.textoSobreCor,
        },
        email: {
            fontSize: 13,
            color: cores.textoSobreCor,
            opacity: 0.85,
        },
        papel: {
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-start",
            gap: 4,
            marginTop: 6,
            paddingHorizontal: 10,
            paddingVertical: 3,
            borderRadius: 999,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
        },
        textoPapel: {
            fontSize: 11,
            fontWeight: "700",
            color: cores.textoSobreCor,
        },

        // rodapé
        excluir: {
            alignSelf: "center",
            marginTop: 24,
        },
        textoExcluir: {
            fontSize: 14,
            fontWeight: "700",
            color: cores.erro,
        },
        versao: {
            textAlign: "center",
            marginTop: 10,
            fontSize: 12,
            color: cores.textoSuave,
        },
    });
}
