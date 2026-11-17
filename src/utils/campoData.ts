// Datas usadas na escolha do dia do compromisso (formato da API: "2026-11-25").

// os próximos N dias (para os atalhos "Hoje", "Amanhã"...)
export function proximosDias(quantidade: number): string[] {
    return Array.from({ length: quantidade }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() + i);
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${data.getFullYear()}-${mes}-${dia}`;
    });
}
