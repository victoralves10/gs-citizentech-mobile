// Nomes das telas e o que cada uma recebe
import { Lugar } from "../models/Lugar";

export type ListaDeTelas = {
    // sem login
    Apresentacao: undefined; // boas-vindas da primeira abertura
    Login: undefined;
    Cadastro: undefined;

    // abas
    Abas: undefined;
    Home: undefined;
    MeusLocais: undefined;
    Pesquisa: undefined;
    Alertas: undefined;
    Perfil: undefined;

    // por cima das abas
    DetalhesLocal: { localId: number; apelido?: string }; // apelido = título da tela
    SobreApp: undefined;
    MeusCompromissos: undefined; // todos os compromissos, de todos os locais
    NovoLocal: { lugar?: Lugar } | undefined;
};

declare global {
    namespace ReactNavigation {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface RootParamList extends ListaDeTelas {}
    }
}
