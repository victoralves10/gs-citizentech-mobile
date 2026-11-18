// Compromissos (iguais à API Java)
export type Compromisso = {
    id: number;
    nome: string; // "Reunião de alinhamento"
    data: string; // só o dia: "2026-11-20"
    localId: number;
    localApelido: string; // "Trabalho"
};

// POST /locais/{id}/compromissos
export type CriarCompromisso = {
    nome: string;
    data: string; // "2026-11-20"
};

// PUT /compromissos/{id}
export type EditarCompromisso = {
    nome: string;
    data: string;
    localId: number; // dá para mudar o compromisso de local
};
