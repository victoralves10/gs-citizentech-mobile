// Transforma os dados da API em texto para a tela
const VAZIO = "--";

const DIAS_CURTOS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const DIAS_LONGOS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const MESES = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
];

// Números

// 24.3 → "24°"
export function temperatura(valor: number | null | undefined): string {
    if (valor == null) return VAZIO;
    const arredondado = Math.round(valor);
    return `${arredondado === 0 ? 0 : arredondado}°`;
}

// 40 → "40%"
export function porcentagem(valor: number | null | undefined): string {
    if (valor == null) return VAZIO;
    return `${Math.round(valor)}%`;
}

// 18.4 → "18 km/h"
export function velocidade(valor: number | null | undefined): string {
    if (valor == null) return VAZIO;
    return `${Math.round(valor)} km/h`;
}

// 2.35 → "2,4 mm"
export function milimetros(valor: number | null | undefined): string {
    if (valor == null) return VAZIO;
    return `${valor.toFixed(1).replace(".", ",")} mm`;
}

// Datas (lidas pelo texto, sem converter fuso)

// "2026-11-18" → { ano: 2026, mes: 11, dia: 18 }
function lerDia(texto: string) {
    const [ano, mes, dia] = texto.slice(0, 10).split("-").map(Number);
    return { ano, mes, dia };
}

// 0 = hoje, 1 = amanhã, -1 = ontem
function diasAPartirDeHoje(texto: string): number {
    const { ano, mes, dia } = lerDia(texto);
    const data = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return Math.round((data.getTime() - hoje.getTime()) / 86400000);
}

function diaDaSemana(texto: string): number {
    const { ano, mes, dia } = lerDia(texto);
    return new Date(ano, mes - 1, dia).getDay();
}

// "2026-11-17T14:00" → "14h"
export function hora(texto: string | null | undefined): string {
    if (!texto) return VAZIO;
    return `${Number(texto.slice(11, 13))}h`;
}

// "2026-11-17T05:12" → "05:12"
export function horario(texto: string | null | undefined): string {
    if (!texto) return VAZIO;
    return texto.slice(11, 16);
}

// "2026-11-18" → "Hoje" / "Amanhã" / "Qua, 18/11"
export function dataCurta(texto: string | null | undefined): string {
    if (!texto) return VAZIO;
    const diferenca = diasAPartirDeHoje(texto);
    if (diferenca === 0) return "Hoje";
    if (diferenca === 1) return "Amanhã";

    const { mes, dia } = lerDia(texto);
    const dd = String(dia).padStart(2, "0");
    const mm = String(mes).padStart(2, "0");
    return `${DIAS_CURTOS[diaDaSemana(texto)]}, ${dd}/${mm}`;
}

// "2026-11-18" → "Hoje" / "Qua"
export function diaSemana(texto: string | null | undefined): string {
    if (!texto) return VAZIO;
    if (diasAPartirDeHoje(texto) === 0) return "Hoje";
    return DIAS_CURTOS[diaDaSemana(texto)];
}

// "2026-11-18" → "Quarta, 18 de novembro"
export function dataLonga(texto: string | null | undefined): string {
    if (!texto) return VAZIO;
    const { mes, dia } = lerDia(texto);
    return `${DIAS_LONGOS[diaDaSemana(texto)]}, ${dia} de ${MESES[mes - 1]}`;
}

// "2026-11-17T13:00:00Z" → "agora" / "há 5 min" / "há 2 h" / "há 3 dias"
export function tempoAtras(texto: string | null | undefined): string {
    if (!texto) return VAZIO;
    const minutos = Math.floor((Date.now() - new Date(texto).getTime()) / 60000);

    if (minutos < 1) return "agora";
    if (minutos < 60) return `há ${minutos} min`;

    const horas = Math.floor(minutos / 60);
    if (horas < 24) return `há ${horas} h`;

    const dias = Math.floor(horas / 24);
    return dias === 1 ? "há 1 dia" : `há ${dias} dias`;
}

// Textos

// "Bom dia" até 11h59, "Boa tarde" até 17h59, depois "Boa noite"
export function saudacao(): string {
    const hora = new Date().getHours();
    if (hora < 12) return "Bom dia";
    if (hora < 18) return "Boa tarde";
    return "Boa noite";
}

// "Victor Alves" → "VA"
export function iniciais(nome?: string): string {
    if (!nome) return "?";
    const partes = nome.trim().split(/\s+/);
    const ultima = partes.length > 1 ? partes[partes.length - 1].charAt(0) : "";
    return (partes[0].charAt(0) + ultima).toUpperCase();
}

// "São Paulo, São Paulo · Brasil" (sem repetir a cidade)
export function descricaoDoLugar(lugar: {
    nome: string;
    cidade: string;
    estado: string;
    pais: string;
}): string {
    const cidade = lugar.cidade && lugar.cidade !== lugar.nome ? `${lugar.cidade}, ` : "";
    return `${cidade}${lugar.estado} · ${lugar.pais}`;
}
