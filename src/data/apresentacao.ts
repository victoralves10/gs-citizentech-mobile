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
        texto: "O clima dos lugares que importam para você, explicado e com aviso.",
        icone: "partly-sunny",
        iconesExtras: ["rainy", "thermometer", "umbrella"],
    },
    {
        id: "locais",
        titulo: "Seus lugares, explicados",
        texto: "Salve casa, trabalho e escola e veja a previsão explicada em português simples pela IA.",
        icone: "location",
        iconesExtras: ["home", "sparkles", "school"],
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
