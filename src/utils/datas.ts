// Datas no formato da API ("2026-11-25")

function paraApi(data: Date): string {
    const mes = String(data.getMonth() + 1).padStart(2, "0");
    const dia = String(data.getDate()).padStart(2, "0");
    return `${data.getFullYear()}-${mes}-${dia}`;
}

export function diaDeHoje(): string {
    return paraApi(new Date());
}

// hoje e os próximos dias, para os atalhos de data
export function proximosDias(quantidade: number): string[] {
    return Array.from({ length: quantidade }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() + i);
        return paraApi(data);
    });
}
