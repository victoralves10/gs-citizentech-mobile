import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CartaoMudanca from "./CartaoMudanca";
import AvisoLinha from "./AvisoLinha";
import { Mudanca } from "../models/Previsao";

// Lista do "O que mudou na previsão"
type Props = {
    mudancas: Mudanca[];
    abrirLocal?: boolean; // tocar no cartão abre os Detalhes do local
    textoVazio?: string;
};

export default function ListaMudancas({ mudancas, abrirLocal, textoVazio }: Props) {
    const navigation = useNavigation();

    if (mudancas.length === 0) {
        return textoVazio ? <AvisoLinha texto={textoVazio} /> : null;
    }

    return (
        <View style={estilos.lista}>
            {mudancas.map((mudanca) => (
                <CartaoMudanca
                    key={`${mudanca.id}-${mudanca.localId}`}
                    mudanca={mudanca}
                    onPress={
                        abrirLocal
                            ? () =>
                                  navigation.navigate("DetalhesLocal", {
                                      localId: mudanca.localId,
                                      apelido: mudanca.localApelido,
                                  })
                            : undefined
                    }
                />
            ))}
        </View>
    );
}

const estilos = StyleSheet.create({
    lista: {
        gap: 10,
    },
});
