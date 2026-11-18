import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Campo de busca com lupa, rodinha e botão de limpar
type Props = {
    valor: string;
    onMudar: (texto: string) => void;
    placeholder?: string;
    buscando?: boolean;
};

export default function CampoBusca({ valor, onMudar, placeholder, buscando = false }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    return (
        <View style={estilos.caixa}>
            <Ionicons name="search-outline" size={20} color={cores.textoSuave} />

            <TextInput
                style={estilos.input}
                value={valor}
                onChangeText={onMudar}
                placeholder={placeholder}
                placeholderTextColor={cores.textoSuave}
                autoCorrect={false}
                returnKeyType="search"
            />

            {buscando ? (
                <ActivityIndicator size="small" color={cores.primaria} />
            ) : (
                valor.length > 0 && (
                    <Pressable onPress={() => onMudar("")} hitSlop={10}>
                        <Ionicons name="close-circle" size={20} color={cores.textoSuave} />
                    </Pressable>
                )
            )}
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        caixa: {
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            paddingHorizontal: 14,
            height: 48,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: cores.borda,
            backgroundColor: cores.superficie,
        },
        input: {
            flex: 1,
            fontSize: 15,
            color: cores.texto,
        },
    });
}
