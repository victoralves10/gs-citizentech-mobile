// Se a pessoa já viu a apresentação
import AsyncStorage from "@react-native-async-storage/async-storage";

const CHAVE_APRESENTACAO = "@gs:apresentacao-vista";

export async function apresentacaoFoiVista(): Promise<boolean> {
    const valor = await AsyncStorage.getItem(CHAVE_APRESENTACAO);
    return valor === "sim";
}

export async function marcarApresentacaoVista() {
    await AsyncStorage.setItem(CHAVE_APRESENTACAO, "sim");
}
