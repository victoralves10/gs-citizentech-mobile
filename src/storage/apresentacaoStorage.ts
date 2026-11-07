import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_APRESENTACAO = "@gs:apresentacao-vista";

// true se a pessoa já viu a apresentação
export async function apresentacaoFoiVista(): Promise<boolean> {
    const valor = await AsyncStorage.getItem(CHAVE_APRESENTACAO);
    return valor === "sim";
}

// salva o sinal (chamado no "Começar" e no "Pular")
export async function marcarApresentacaoVista() {
    await AsyncStorage.setItem(CHAVE_APRESENTACAO, "sim");
}
