import { View } from "react-native";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import BotaoPilula from "../components/BotaoPilula";
import TituloSecao from "../components/TituloSecao";
import BlocoVazio from "../components/BlocoVazio";
import { toastAviso } from "../utils/toast";

export default function MeusLocais() {
    return (
        <TelaBase>
            <View>
                <CabecalhoTela
                    titulo="Meus locais"
                    subtitulo="Nenhum local salvo ainda"
                    direita={
                        <BotaoPilula
                            texto="Novo local"
                            icone="add"
                            onPress={() => toastAviso("Cadastro de locais em breve.")}
                        />
                    }
                />

                <TituloSecao titulo="Buscar nos meus locais" />
                <BlocoVazio titulo="Campo de busca (apelido ou cidade)" icone="search-outline" />

                <TituloSecao titulo="Locais salvos" />
                <BlocoVazio
                    titulo="Cards dos locais: clima agora, alerta e checkbox"
                    icone="location-outline"
                    altura={220}
                />
            </View>
        </TelaBase>
    );
}
