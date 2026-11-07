import { View } from "react-native";
import TelaBase from "../components/TelaBase";
import TituloSecao from "../components/TituloSecao";
import BlocoVazio from "../components/BlocoVazio";
import { toastAviso } from "../utils/toast";

export default function DetalhesLocal() {
    return (
        <TelaBase comCabecalho>
            <View>
                <BlocoVazio
                    titulo="Agora: temperatura, umidade, vento, UV, sol"
                    icone="partly-sunny-outline"
                    altura={170}
                />

                <TituloSecao titulo="Próximas 48 horas" />
                <BlocoVazio titulo="Gráfico hora a hora" icone="stats-chart-outline" altura={150} />

                <TituloSecao titulo="Alertas deste local" />
                <BlocoVazio titulo="Alertas de hoje e dos próximos dias" icone="warning-outline" />

                <TituloSecao titulo="O que mudou" />
                <BlocoVazio titulo="Antes → depois na previsão" icone="trending-down-outline" />

                <TituloSecao titulo="Próximos 16 dias" />
                <BlocoVazio titulo="Lista dia a dia" icone="list-outline" altura={180} />

                {/* a seção de eventos tem a ação "+ Novo evento" na direita do título */}
                <TituloSecao
                    titulo="Eventos deste local"
                    textoAcao="+ Novo evento"
                    onAcao={() => toastAviso("Eventos em breve.")}
                />
                <BlocoVazio titulo="Eventos marcados neste local" icone="calendar-outline" />
            </View>
        </TelaBase>
    );
}
