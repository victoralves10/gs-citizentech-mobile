import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import EmBreve from "../components/EmBreve";
import Botao from "../components/Botao";

export default function Home() {
    const navigation = useNavigation();

    return (
        <TelaBase>
            <EmBreve titulo="Home" />
            <View>
                <Botao texto="Abrir a Tela 4" onPress={() => navigation.navigate("Tela4")} />
            </View>
        </TelaBase>
    );
}
