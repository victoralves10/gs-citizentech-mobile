// Mensagens rápidas na parte de baixo da tela
import Toast from "react-native-toast-message";

export function toastSucesso(mensagem: string) {
    Toast.show({ type: "success", text1: mensagem, position: "bottom", visibilityTime: 2000 });
}

export function toastErro(mensagem: string) {
    Toast.show({ type: "error", text1: mensagem, position: "bottom", visibilityTime: 2500 });
}

export function toastAviso(mensagem: string) {
    Toast.show({ type: "info", text1: mensagem, position: "bottom", visibilityTime: 2000 });
}
