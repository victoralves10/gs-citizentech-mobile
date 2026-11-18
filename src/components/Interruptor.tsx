import { Switch } from "react-native";
import { useTema } from "../theme/TemaContext";

// Switch com as cores do tema
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
            trackColor={{ false: cores.borda, true: cores.primaria }}
            thumbColor={cores.textoSobreCor}
            ios_backgroundColor={cores.borda}
        />
    );
}
