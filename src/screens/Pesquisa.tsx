import { View } from "react-native";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import TituloSecao from "../components/TituloSecao";
import BlocoVazio from "../components/BlocoVazio";

export default function Pesquisa() {
    return (
        <TelaBase>
            <View>
                <CabecalhoTela titulo="Pesquisa" subtitulo="Veja o clima de qualquer cidade" />

                <BlocoVazio titulo="Campo de busca com sugestões" icone="search-outline" />

                <TituloSecao titulo="Buscas recentes" />
                <BlocoVazio titulo="Últimas 5 cidades pesquisadas" icone="time-outline" />

                <TituloSecao titulo="Resultado" />
                <BlocoVazio
                    titulo="Clima agora, IA, alertas, hora a hora e 7 dias"
                    icone="partly-sunny-outline"
                    altura={220}
                />
            </View>
        </TelaBase>
    );
}
