import { ImageSourcePropType } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NomeIcone = keyof typeof Ionicons.glyphMap;

export type PaginaApresentacao = {
    id: string;
    titulo: string;
    texto: string;
    icone: NomeIcone;
    iconesExtras: [NomeIcone, NomeIcone, NomeIcone]; // exatamente 3
    imagem?: ImageSourcePropType;
};

export const PAGINAS_APRESENTACAO: PaginaApresentacao[] = [
    {
        id: "boas-vindas",
        titulo: "Bem-vindo ao GaroAvisa",
        texto: "O clima dos lugares que importam para você, com aviso antes do tempo virar.",
        icone: "partly-sunny",
        iconesExtras: ["rainy", "thermometer", "umbrella"],
    },
    {
        id: "locais",
        titulo: "Seus lugares, sempre à vista",
        texto: "Salve casa, trabalho e escola e veja o clima de cada um, hora a hora e para os próximos dias.",
        icone: "location",
        iconesExtras: ["home", "time", "school"],
    },
    {
        id: "alertas",
        titulo: "Avisos na hora certa",
        texto: "Chuva forte, calor, vento e mudanças bruscas na previsão: a gente avisa antes.",
        icone: "notifications",
        iconesExtras: ["thunderstorm", "warning", "trending-down"],
    },
    {
        id: "eventos",
        titulo: "Planeje sem surpresa",
        texto: "Marque seus planos e saiba se o tempo vai colaborar nos dias do evento.",
        icone: "calendar",
        iconesExtras: ["sunny", "checkmark-circle", "cloud"],
    },
];
