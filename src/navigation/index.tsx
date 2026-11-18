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

const Pilha = createNativeStackNavigator<ListaDeTelas>();
const Aba = createBottomTabNavigator<ListaDeTelas>();

const ICONES_DAS_ABAS = {
    Home: "home-outline",
    MeusLocais: "location-outline",
    Pesquisa: "search-outline",
    Alertas: "notifications-outline",
    Perfil: "person-outline",
} as const;

// Abas
function Abas() {
    const { cores } = useTema();

    return (
        <Aba.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: cores.primaria,
                tabBarInactiveTintColor: cores.textoSuave,
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

// Navegação do app
export default function Rotas() {
    const { cores, escuro } = useTema();
    const { logado, carregando } = useAuth();
    const { jaViuApresentacao } = useApresentacao();
    // tema do React Navigation com as cores do app
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

    if (carregando || jaViuApresentacao === null) {
        return <Carregando texto="Abrindo o app..." />;
    }

    return (
        <NavigationContainer theme={temaNavegacao}>
            <Pilha.Navigator>
                {logado ? (
                    // Com login
                    <>
                        <Pilha.Screen
                            name="Abas"
                            component={Abas}
                            options={{ headerShown: false }}
                        />
                        <Pilha.Screen
                            name="DetalhesLocal"
                            component={DetalhesLocal}
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
                    // Sem login
                    <>
                        {/* na 1ª abertura, a apresentação vem antes do Login */}
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

            <StatusBar style={escuro ? "light" : "dark"} />
        </NavigationContainer>
    );
}
