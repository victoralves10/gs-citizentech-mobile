import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CartaoAlerta from "./CartaoAlerta";
import AvisoLinha from "./AvisoLinha";
import { Alerta } from "../models/Previsao";

// um alerta e, quando a tela mistura locais, o local dele (tocar abre os Detalhes)
export type ItemAlerta = {
    alerta: Alerta;
    local?: { id: number; apelido: string };
};

type Props = {
    itens: ItemAlerta[];
    mostrarDia?: boolean;
    textoVazio?: string; // sem texto, a lista vazia não mostra nada
};

export default function ListaAlertas({ itens, mostrarDia, textoVazio }: Props) {
    const navigation = useNavigation();

    if (itens.length === 0) {
        return textoVazio ? <AvisoLinha texto={textoVazio} /> : null;
    }

    return (
        <View style={estilos.lista}>
            {itens.map(({ alerta, local }, indice) => (
                <CartaoAlerta
                    key={`${local?.id ?? 0}-${alerta.id ?? indice}`}
                    alerta={alerta}
                    mostrarDia={mostrarDia}
                    local={local?.apelido}
                    onPress={
                        local
                            ? () =>
                                  navigation.navigate("DetalhesLocal", {
                                      localId: local.id,
                                      apelido: local.apelido,
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
