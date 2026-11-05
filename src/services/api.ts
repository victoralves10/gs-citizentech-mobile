import { create, isAxiosError } from "axios";
import { buscarToken } from "../storage/sessaoStorage";
import { log } from "../utils/log";

// endereço da API Java (provisório)
export const API_URL = "http://localhost:8080";

export const api = create({
    baseURL: API_URL,
    timeout: 15000, // desiste depois de 15 segundos sem resposta
});

// ANTES de cada requisição: coloca o token no cabeçalho "Authorization"
api.interceptors.request.use(async (config) => {
    const token = await buscarToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    log.api(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

// DEPOIS de cada resposta: escreve no terminal se deu certo ou errado
api.interceptors.response.use(
    (resposta) => {
        log.api(`${resposta.config.url} → ${resposta.status}`);
        return resposta;
    },
    (erro) => {
        const status = erro.response ? erro.response.status : "sem resposta";
        log.erro(`${erro.config?.url} → ${status}`);
        return Promise.reject(erro);
    }
);

// transforma qualquer erro em uma mensagem para mostrar ao usuário
export function mensagemDeErro(erro: unknown): string {
    // erro que veio da API (o backend manda { mensagem: "..." })
    if (isAxiosError(erro)) {
        if (!erro.response) {
            return "Sem conexão com o servidor. Tente de novo.";
        }
        return erro.response.data?.mensagem ?? "Algo deu errado. Tente de novo.";
    }
    // erro comum (é o que o mock usa)
    if (erro instanceof Error) {
        return erro.message;
    }
    return "Algo deu errado. Tente de novo.";
}
