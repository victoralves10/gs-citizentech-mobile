import Toast from "react-native-toast-message";

// mensagem verde (deu certo)
export function toastSucesso(mensagem: string) {
    Toast.show({ type: "success", text1: mensagem, position: "bottom", visibilityTime: 2000 });
}

// mensagem vermelha (deu erro)
export function toastErro(mensagem: string) {
    Toast.show({ type: "error", text1: mensagem, position: "bottom", visibilityTime: 2500 });
}

// mensagem azul (só um aviso)
export function toastAviso(mensagem: string) {
    Toast.show({ type: "info", text1: mensagem, position: "bottom", visibilityTime: 2000 });
}
