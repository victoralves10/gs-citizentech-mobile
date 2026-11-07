import { useState } from "react";
import { View } from "react-native";
import TelaBase from "../components/TelaBase";
import CabecalhoTela from "../components/CabecalhoTela";
import Segmentado from "../components/Segmentado";
import TituloSecao from "../components/TituloSecao";
import BlocoVazio from "../components/BlocoVazio";

// as 4 origens de alerta (o "valor" é o que vai para a API depois)
type Origem = "TODOS" | "DIA" | "MUDANCA" | "EVENTO";

export default function Alertas() {
    // qual aba de origem está marcada (começa em "Todos")
    const [origem, setOrigem] = useState<Origem>("TODOS");

    return (
        <TelaBase>
            <View>
                <CabecalhoTela titulo="Alertas" subtitulo="Nenhum alerta por enquanto" />

                <Segmentado
                    opcoes={[
                        { valor: "TODOS", rotulo: "Todos" },
                        { valor: "DIA", rotulo: "No dia" },
                        { valor: "MUDANCA", rotulo: "Mudanças" },
                        { valor: "EVENTO", rotulo: "Eventos" },
                    ]}
                    valor={origem}
                    onMudar={setOrigem}
                />

                <TituloSecao titulo="Filtrar por tipo" />
                <BlocoVazio
                    titulo="Chuva, tempestade, calor, frio, vento, UV"
                    icone="funnel-outline"
                />

                <TituloSecao titulo="Seus alertas" />
                <BlocoVazio
                    titulo="Lista de alertas (lidos e não lidos)"
                    icone="notifications-outline"
                    altura={220}
                />
            </View>
        </TelaBase>
    );
}
