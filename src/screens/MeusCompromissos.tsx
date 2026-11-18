import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import TelaBase from "../components/TelaBase";
import Aviso from "../components/Aviso";
import Botao from "../components/Botao";
import Carregando from "../components/Carregando";
import ListaCompromissos from "../components/ListaCompromissos";
import { useCarregar } from "../hooks/useCarregar";
import { compromissosService } from "../services/compromissosService";

// Próximos compromissos de todos os locais (tocar abre os Detalhes do local)
export default function MeusCompromissos() {
    const navigation = useNavigation();
    const { dados, carregando, atualizando, erro, atualizar } = useCarregar(
        compromissosService.todos
    );

    function conteudo() {
        if (carregando) return <Carregando />;

        if (!dados) {
            return (
                <Aviso icone="cloud-offline-outline" texto={erro} erro>
                    <Botao texto="Tentar de novo" variante="contorno" onPress={atualizar} />
                </Aviso>
            );
        }

        if (dados.length === 0) {
            return (
                <Aviso
                    icone="calendar-outline"
                    titulo="Nenhum compromisso marcado"
                    texto="Abra um local em Meus Locais e toque em + Novo, na seção de compromissos."
                >
                    <Botao
                        texto="Ir para Meus Locais"
                        onPress={() => navigation.navigate("MeusLocais")}
                    />
                </Aviso>
            );
        }

        return <ListaCompromissos compromissos={dados} />;
    }

    return (
        <TelaBase comCabecalho aoAtualizar={atualizar} atualizando={atualizando}>
            <View>{conteudo()}</View>
        </TelaBase>
    );
}
