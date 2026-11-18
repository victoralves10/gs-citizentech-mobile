import AsyncStorage from "@react-native-async-storage/async-storage";
import { Lugar } from "../models/Lugar";

const CHAVE = "@gs:buscas-recentes";
const MAXIMO = 5;

export async function buscarRecentes(): Promise<Lugar[]> {
    const texto = await AsyncStorage.getItem(CHAVE);
    return texto ? JSON.parse(texto) : [];
}

// o lugar vai para o topo; guarda só os 5 últimos
export async function salvarRecente(lugar: Lugar): Promise<Lugar[]> {
    const atuais = await buscarRecentes();
    const novos = [lugar, ...atuais.filter((l) => l.id !== lugar.id)].slice(0, MAXIMO);
    await AsyncStorage.setItem(CHAVE, JSON.stringify(novos));
    return novos;
}

export async function limparRecentes() {
    await AsyncStorage.removeItem(CHAVE);
}
