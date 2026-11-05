export type ListaDeTelas = {
    // telas de fora (sem login)
    Login: undefined;
    Cadastro: undefined;

    // abas de baixo (com login)
    Abas: undefined;
    Home: undefined;
    Tela1: undefined;
    Tela2: undefined;
    Tela3: undefined;
    Perfil: undefined;

    // telas que abrem por cima das abas (com login)
    Tela4: undefined;
    SobreApp: undefined;
};

declare global {
    namespace ReactNavigation {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface RootParamList extends ListaDeTelas {}
    }
}
