import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { useApresentacao } from "../context/ApresentacaoContext";
import { ListaDeTelas } from "./tipos";
import Carregando from "../components/Carregando";

import Apresentacao from "../screens/Apresentacao";
import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import MeusLocais from "../screens/MeusLocais";
import Pesquisa from "../screens/Pesquisa";
import Alertas from "../screens/Alertas";
import DetalhesLocal from "../screens/DetalhesLocal";
import Perfil from "../screens/Perfil";
import SobreApp from "../screens/SobreApp";
import MeusCompromissos from "../screens/MeusCompromissos";
import NovoLocal from "../screens/NovoLocal";

// cria os 2 navegadores (os dois conhecem a nossa lista de telas)
const Pilha = createNativeStackNavigator<ListaDeTelas>();
const Aba = createBottomTabNavigator<ListaDeTelas>();

// ícone de cada aba (nome da tela → nome do ícone)
const ICONES_DAS_ABAS = {
    Home: "home-outline",
    MeusLocais: "location-outline",
    Pesquisa: "search-outline",
    Alertas: "notifications-outline",
    Perfil: "person-outline",
} as const;

// As abas de baixo
function Abas() {
    const { cores } = useTema();

    return (
        <Aba.Navigator
            // screenOptions vale para TODAS as abas.
            // Ele recebe a "route" (a aba) para escolher o ícone certo.
            screenOptions={({ route }) => ({
                headerShown: false, // as abas não mostram cabeçalho (cada tela tem o seu título)
                tabBarActiveTintColor: cores.primaria, // cor da aba selecionada
                tabBarInactiveTintColor: cores.textoSuave, // cor das outras
                tabBarStyle: { backgroundColor: cores.superficie, borderTopColor: cores.borda },
                tabBarIcon: ({ color, size }) => (
                    <Ionicons
                        name={ICONES_DAS_ABAS[route.name as keyof typeof ICONES_DAS_ABAS]}
                        size={size}
                        color={color}
                    />
                ),
            })}
        >
            <Aba.Screen name="Home" component={Home} />
            <Aba.Screen
                name="MeusLocais"
                component={MeusLocais}
                options={{ title: "Meus locais" }}
            />
            <Aba.Screen name="Pesquisa" component={Pesquisa} />
            <Aba.Screen name="Alertas" component={Alertas} />
            <Aba.Screen name="Perfil" component={Perfil} />
        </Aba.Navigator>
    );
}

// A navegação completa do app
export default function Rotas() {
    const { cores, escuro } = useTema();
    const { logado, carregando } = useAuth();
    const { jaViuApresentacao } = useApresentacao();
    // O React Navigation tem o próprio tema (cor de fundo, do cabeçalho...).
    // Aqui a gente pega o tema padrão dele (claro ou escuro) e troca as cores
    // pelas nossas. O "..." copia tudo que já existe e só substitui o que a gente escreveu.
    const temaBase = escuro ? DarkTheme : DefaultTheme;
    const temaNavegacao = {
        ...temaBase,
        colors: {
            ...temaBase.colors,
            background: cores.fundo,
            card: cores.superficie,
            text: cores.texto,
            border: cores.borda,
            primary: cores.primaria,
        },
    };

    // enquanto confere a sessão salva e o sinal da apresentação, mostra a rodinha
    // (senão o Login piscaria na tela antes de entrar no app)
    if (carregando || jaViuApresentacao === null) {
        return <Carregando texto="Abrindo o app..." />;
    }

    return (
        <NavigationContainer theme={temaNavegacao}>
            <Pilha.Navigator>
                {logado ? (
                    // ---------- telas de DENTRO (com login) ----------
                    <>
                        <Pilha.Screen
                            name="Abas"
                            component={Abas}
                            options={{ headerShown: false }}
                        />
                        <Pilha.Screen
                            name="DetalhesLocal"
                            component={DetalhesLocal}
                            // o título é o apelido do local ("Casa"), que vem junto ao abrir
                            options={({ route }) => ({
                                title: route.params?.apelido ?? "Detalhes do local",
                            })}
                        />
                        <Pilha.Screen
                            name="SobreApp"
                            component={SobreApp}
                            options={{ title: "Sobre o App" }}
                        />
                        <Pilha.Screen
                            name="MeusCompromissos"
                            component={MeusCompromissos}
                            options={{ title: "Meus compromissos" }}
                        />
                        <Pilha.Screen
                            name="NovoLocal"
                            component={NovoLocal}
                            options={{ title: "Novo local" }}
                        />
                        <Pilha.Screen
                            name="Apresentacao"
                            component={Apresentacao}
                            options={{ headerShown: false }}
                        />
                    </>
                ) : (
                    // ---------- telas de FORA (sem login) ----------
                    <>
                        {/* nunca viu a apresentação: ela entra PRIMEIRO na lista (é a tela inicial).
                            Ao tocar em "Começar", jaViuApresentacao vira true, ela sai da lista
                            e o app mostra o Login sozinho. */}
                        {!jaViuApresentacao && (
                            <Pilha.Screen
                                name="Apresentacao"
                                component={Apresentacao}
                                options={{ headerShown: false }}
                            />
                        )}
                        <Pilha.Screen
                            name="Login"
                            component={Login}
                            options={{ headerShown: false }}
                        />
                        <Pilha.Screen
                            name="Cadastro"
                            component={Cadastro}
                            options={{ headerShown: false }}
                        />
                    </>
                )}
            </Pilha.Navigator>

            {/* barra de cima do celular: clara no tema escuro e escura no claro */}
            <StatusBar style={escuro ? "light" : "dark"} />
        </NavigationContainer>
    );
}
