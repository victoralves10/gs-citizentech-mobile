// um compromisso (GET /compromissos, GET /locais/{id}/compromissos...)
export type Compromisso = {
    id: number;
    nome: string; // "Reunião de alinhamento"
    data: string; // só o dia: "2026-11-20"
    localId: number;
    localApelido: string; // "Trabalho"
};

// o que o app manda para criar (POST /locais/{localId}/compromissos)
export type CriarCompromisso = {
    nome: string;
    data: string; // "2026-11-20"
};

// o que o app manda para editar (PUT /compromissos/{id})
export type EditarCompromisso = {
    nome: string;
    data: string;
    localId: number; // dá para mudar o compromisso de local
};
