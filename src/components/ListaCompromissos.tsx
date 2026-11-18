import { useNavigation } from "@react-navigation/native";
import Cartao from "./Cartao";
import ItemLista from "./ItemLista";
import { Compromisso } from "../models/Compromisso";
import { dataCurta } from "../utils/formatar";

// Compromissos de vários locais: tocar abre os Detalhes do local
type Props = {
    compromissos: Compromisso[];
};

export default function ListaCompromissos({ compromissos }: Props) {
    const navigation = useNavigation();

    return (
        <Cartao semEspaco>
            {compromissos.map((compromisso, indice) => (
                <ItemLista
                    key={compromisso.id}
                    titulo={compromisso.nome}
                    descricao={`${dataCurta(compromisso.data)} · ${compromisso.localApelido}`}
                    icone="calendar-outline"
                    divisor={indice > 0}
                    onPress={() =>
                        navigation.navigate("DetalhesLocal", {
                            localId: compromisso.localId,
                            apelido: compromisso.localApelido,
                        })
                    }
                />
            ))}
        </Cartao>
    );
}
