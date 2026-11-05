import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";
import { ListaDeTelas } from "./tipos";

import Login from "../screens/Login";
import Cadastro from "../screens/Cadastro";
import Home from "../screens/Home";
import Tela1 from "../screens/Tela1";
import Tela2 from "../screens/Tela2";
import Tela3 from "../screens/Tela3";
import Tela4 from "../screens/Tela4";
import Perfil from "../screens/Perfil";
import SobreApp from "../screens/SobreApp";

// cria os 2 navegadores (os dois conhecem a nossa lista de telas)
const Pilha = createNativeStackNavigator<ListaDeTelas>();
const Aba = createBottomTabNavigator<ListaDeTelas>();

// ícone de cada aba (nome da tela → nome do ícone)
const ICONES_DAS_ABAS = {
    Home: "home-outline",
    Tela1: "grid-outline",
    Tela2: "list-outline",
    Tela3: "map-outline",
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
            <Aba.Screen name="Tela1" component={Tela1} options={{ title: "Tela 1" }} />
            <Aba.Screen name="Tela2" component={Tela2} options={{ title: "Tela 2" }} />
            <Aba.Screen name="Tela3" component={Tela3} options={{ title: "Tela 3" }} />
            <Aba.Screen name="Perfil" component={Perfil} />
        </Aba.Navigator>
    );
}

// A navegação completa do app
export default function Rotas() {
    const { cores, escuro } = useTema();
    const { logado } = useAuth();

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
                            name="Tela4"
                            component={Tela4}
                            options={{ title: "Tela 4" }}
                        />
                        <Pilha.Screen
                            name="SobreApp"
                            component={SobreApp}
                            options={{ title: "Sobre o App" }}
                        />
                    </>
                ) : (
                    // ---------- telas de FORA (sem login) ----------
                    <>
                        <Pilha.Screen
                            name="Login"
                            component={Login}
                            options={{ headerShown: false }}
                        />
                        <Pilha.Screen
                            name="Cadastro"
                            component={Cadastro}
                            options={{ title: "" }}
                        />
                    </>
                )}
            </Pilha.Navigator>

            {/* barra de cima do celular: clara no tema escuro e escura no claro */}
            <StatusBar style={escuro ? "light" : "dark"} />
        </NavigationContainer>
    );
}
