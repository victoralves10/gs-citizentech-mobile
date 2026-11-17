// ============================================================================
// CAMPO DE DATA
// O usuário digita "25/11/2026" e a API usa "2026-11-25".
// Estas funções fazem a ponte entre os dois formatos.
// ============================================================================

// enquanto digita: "25112026" → "25/11/2026" (coloca as barras sozinho)
export function mascaraData(texto: string): string {
    const numeros = texto.replace(/\D/g, "").slice(0, 8);
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

// "25/11/2026" → "2026-11-25" (ou null, se a data não existir)
export function campoParaApi(texto: string): string | null {
    const partes = texto.split("/");
    if (partes.length !== 3 || partes[2].length !== 4) return null;

    const [dia, mes, ano] = partes.map(Number);
    const data = new Date(ano, mes - 1, dia);
    // confere se a data existe de verdade (31/02 não existe)
    if (data.getDate() !== dia || data.getMonth() !== mes - 1) return null;

    return `${ano}-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

// "2026-11-25" → "25/11/2026"
export function apiParaCampo(data: string): string {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// os próximos N dias, no formato da API (para os atalhos "Hoje", "Amanhã"...)
export function proximosDias(quantidade: number): string[] {
    return Array.from({ length: quantidade }, (_, i) => {
        const data = new Date();
        data.setDate(data.getDate() + i);
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const dia = String(data.getDate()).padStart(2, "0");
        return `${data.getFullYear()}-${mes}-${dia}`;
    });
}
