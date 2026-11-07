import { Switch } from "react-native";
import { useTema } from "../theme/TemaContext";

type Props = {
    valor: boolean;
    onMudar?: (novo: boolean) => void;
    desabilitado?: boolean;
};

export default function Interruptor({ valor, onMudar, desabilitado = false }: Props) {
    const { cores } = useTema();

    return (
        <Switch
            value={valor}
            onValueChange={onMudar}
            disabled={desabilitado}
            // cor do trilho: [desligado, ligado]
            trackColor={{ false: cores.borda, true: cores.primaria }}
            // cor da bolinha (no Android; no iPhone ela já é branca)
            thumbColor={cores.textoSobreCor}
            // fundo do trilho desligado no iPhone
            ios_backgroundColor={cores.borda}
        />
    );
}
