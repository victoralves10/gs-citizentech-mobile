// escreve uma linha no terminal, só em desenvolvimento
function escrever(tipo: string, mensagem: string) {
    if (__DEV__) {
        console.log(`[${tipo}] ${mensagem}`);
    }
}

// um "atalho" para cada tipo de mensagem
export const log = {
    tema: (mensagem: string) => escrever("TEMA", mensagem),
    sessao: (mensagem: string) => escrever("SESSÃO", mensagem),
    api: (mensagem: string) => escrever("API", mensagem),
    erro: (mensagem: string) => escrever("ERRO", mensagem),
};
