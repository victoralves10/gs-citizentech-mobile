import { ReactNode } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import Aviso from "./Aviso";
import Cartao from "./Cartao";
import CampoBusca from "./CampoBusca";
import ItemLista from "./ItemLista";
import { Lugar } from "../models/Lugar";
import { BuscaLugares } from "../hooks/useBuscaLugares";
import { descricaoDoLugar } from "../utils/formatar";
import { useTema } from "../theme/TemaContext";

// Campo de busca + lista de lugares encontrados (Pesquisa e Novo local)
type Props = {
    busca: BuscaLugares;
    onEscolher: (lugar: Lugar) => void;
    antesDeBuscar: ReactNode; // aparece com menos de 2 letras
};

export default function BuscaDeLugar({ busca, onEscolher, antesDeBuscar }: Props) {
    const { cores } = useTema();

    function resultado() {
        if (busca.buscaCurta) return antesDeBuscar;

        if (busca.erroBusca) {
            return <Aviso icone="cloud-offline-outline" texto={busca.erroBusca} erro semCartao />;
        }

        if (busca.resultados.length === 0) {
            return busca.buscando ? (
                <ActivityIndicator color={cores.primaria} />
            ) : (
                <Aviso
                    icone="search-outline"
                    texto="Nenhum lugar encontrado. Tente outro nome."
                    erro
                    semCartao
                />
            );
        }

        return (
            <Cartao semEspaco>
                {busca.resultados.map((lugar, indice) => (
                    <ItemLista
                        key={lugar.id}
                        titulo={lugar.nome}
                        descricao={descricaoDoLugar(lugar)}
                        icone="location-outline"
                        divisor={indice > 0}
                        onPress={() => onEscolher(lugar)}
                    />
                ))}
            </Cartao>
        );
    }

    return (
        <View style={estilos.bloco}>
            <CampoBusca
                valor={busca.busca}
                onMudar={busca.mudarBusca}
                placeholder="Digite um bairro ou cidade"
                buscando={busca.buscando}
            />
            {resultado()}
        </View>
    );
}

const estilos = StyleSheet.create({
    bloco: {
        gap: 16,
    },
});
