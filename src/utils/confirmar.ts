import { Alert } from "react-native";

type Opcoes = {
    titulo: string;
    mensagem: string;
    aoConfirmar: () => void;
};

// Confirmação dupla para exclusões: pergunta duas vezes antes de apagar
export function confirmarExclusao({ titulo, mensagem, aoConfirmar }: Opcoes) {
    Alert.alert(titulo, mensagem, [
        { text: "Cancelar", style: "cancel" },
        {
            text: "Excluir",
            style: "destructive",
            onPress: () =>
                Alert.alert("Tem certeza?", "Essa ação não pode ser desfeita.", [
                    { text: "Não", style: "cancel" },
                    { text: "Sim, excluir", style: "destructive", onPress: aoConfirmar },
                ]),
        },
    ]);
}
