import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
    return (
        <View style={estilos.container}>
            <Text style={estilos.titulo}>Projeto GS CitizenTech</Text>
            <Text>Base do app criada.</Text>
            <StatusBar style="inverted" />
        </View>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
    },
});
