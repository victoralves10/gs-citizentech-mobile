// espera alguns milissegundos (para parecer uma requisição pela internet)
export function esperar(ms = 600) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

// devolve uma CÓPIA do dado. Assim, se a tela mexer no que recebeu,
// o "banco falso" do mock continua igual (como uma API de verdade).
export function copia<T>(dado: T): T {
    return JSON.parse(JSON.stringify(dado));
}

// data de hoje + N dias, no formato que a API manda: "2026-11-17"
export function diaDaqui(dias: number): string {
    const data = new Date();
    data.setDate(data.getDate() + dias);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}`;
}

// hora de agora + N horas, no formato que a API manda: "2026-11-17T14:00"
export function horaDaqui(horas: number): string {
    const data = new Date();
    data.setMinutes(0, 0, 0);
    data.setHours(data.getHours() + horas);
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    const hora = String(data.getHours()).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}T${hora}:00`;
}
