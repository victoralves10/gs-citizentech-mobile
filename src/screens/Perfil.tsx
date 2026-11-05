import { Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import Botao from "../components/Botao";
import { useTema } from "../theme/TemaContext";
import { useAuth } from "../context/AuthContext";

export default function Perfil() {
    const { cores } = useTema();
    const navigation = useNavigation();
    const { sair } = useAuth();

    return (
        <TelaBase>
            <Text style={{ fontSize: 26, fontWeight: "bold", color: cores.texto }}>Perfil</Text>

            <Botao
                texto="Sobre o App"
                variante="contorno"
                onPress={() => navigation.navigate("SobreApp")}
            />
            <Botao texto="Sair" onPress={sair} />
        </TelaBase>
    );
}
