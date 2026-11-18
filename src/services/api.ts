import { create, isAxiosError } from "axios";
import { buscarToken } from "../storage/sessaoStorage";
import { log } from "../utils/log";

// Axios da API Java + tradução de erros
export const API_URL = "https://garoavisa-api.onrender.com";

export const api = create({
    baseURL: API_URL,
    timeout: 60000,
});

// coloca o token em cada requisição
api.interceptors.request.use(async (config) => {
    const token = await buscarToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    log.api(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
});

let quandoExpirar: (() => void) | null = null;

export function aoExpirarSessao(funcao: () => void) {
    quandoExpirar = funcao;
}

api.interceptors.response.use(
    (resposta) => {
        log.api(`${resposta.config.url} → ${resposta.status}`);
        return resposta;
    },
    (erro) => {
        const status = erro.response ? erro.response.status : "sem resposta";
        log.erro(`${erro.config?.url} → ${status}`);

        // 401 fora do login = sessão vencida
        const ehRotaDeLogin = erro.config?.url?.startsWith("/auth");
        if (status === 401 && !ehRotaDeLogin && quandoExpirar) {
            quandoExpirar();
        }

        return Promise.reject(erro);
    }
);

// erro → mensagem para o usuário
export function mensagemDeErro(erro: unknown): string {
    if (isAxiosError(erro)) {
        if (erro.code === "ECONNABORTED") {
            return "O servidor demorou para responder. Tente de novo.";
        }
        if (!erro.response) {
            return "Sem conexão com o servidor. Tente de novo.";
        }

        if (erro.response.status === 401 && !erro.config?.url?.startsWith("/auth")) {
            return "Sua sessão expirou. Entre de novo.";
        }

        const dados = erro.response.data;

        if (dados?.erros) {
            const primeiraMensagem = Object.values(dados.erros)[0];
            if (typeof primeiraMensagem === "string") {
                return primeiraMensagem;
            }
        }

        return dados?.detail ?? dados?.mensagem ?? "Algo deu errado. Tente de novo.";
    }

    if (erro instanceof Error) {
        return erro.message;
    }
    return "Algo deu errado. Tente de novo.";
}
