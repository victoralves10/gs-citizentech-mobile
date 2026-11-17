import { create, isAxiosError } from "axios";
import { buscarToken } from "../storage/sessaoStorage";
import { log } from "../utils/log";

// endereço da API Java (no Render)
export const API_URL = "https://garoavisa-api.onrender.com";

export const api = create({
    baseURL: API_URL,
    timeout: 60000,
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

let quandoExpirar: (() => void) | null = null;

export function aoExpirarSessao(funcao: () => void) {
    quandoExpirar = funcao;
}

// DEPOIS de cada resposta: escreve no terminal se deu certo ou errado
api.interceptors.response.use(
    (resposta) => {
        log.api(`${resposta.config.url} → ${resposta.status}`);
        return resposta;
    },
    (erro) => {
        const status = erro.response ? erro.response.status : "sem resposta";
        log.erro(`${erro.config?.url} → ${status}`);

        // 401 fora do login/cadastro = token vencido ou inválido.
        // (no login, 401 é só "senha errada": esse a tela mostra normalmente)
        const ehRotaDeLogin = erro.config?.url?.startsWith("/auth");
        if (status === 401 && !ehRotaDeLogin && quandoExpirar) {
            quandoExpirar();
        }

        return Promise.reject(erro);
    }
);

// transforma qualquer erro em uma mensagem para mostrar ao usuário
export function mensagemDeErro(erro: unknown): string {
    if (isAxiosError(erro)) {
        // demorou demais (ex.: o Render estava acordando)
        if (erro.code === "ECONNABORTED") {
            return "O servidor demorou para responder. Tente de novo.";
        }
        // nem chegou no servidor (sem internet, endereço errado...)
        if (!erro.response) {
            return "Sem conexão com o servidor. Tente de novo.";
        }

        // token vencido: o AuthContext já está saindo da conta
        if (erro.response.status === 401 && !erro.config?.url?.startsWith("/auth")) {
            return "Sua sessão expirou. Entre de novo.";
        }

        const dados = erro.response.data;

        // erro de validação: mostra a primeira mensagem da lista "erros"
        if (dados?.erros) {
            const primeiraMensagem = Object.values(dados.erros)[0];
            if (typeof primeiraMensagem === "string") {
                return primeiraMensagem;
            }
        }

        // erro comum: usa o "detail" (ou "mensagem", se algum dia vier assim)
        return dados?.detail ?? dados?.mensagem ?? "Algo deu errado. Tente de novo.";
    }

    // erro comum (é o que o mock usa)
    if (erro instanceof Error) {
        return erro.message;
    }
    return "Algo deu errado. Tente de novo.";
}
