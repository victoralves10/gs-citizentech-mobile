export type ListaDeTelas = {
    // telas de fora (sem login)
    Login: undefined;
    Cadastro: undefined;

    // abas de baixo (com login)
    Abas: undefined;
    Home: undefined;
    MeusLocais: undefined;
    Pesquisa: undefined;
    Alertas: undefined;
    Perfil: undefined;

    // telas que abrem por cima das abas (com login)
    DetalhesLocal: undefined;
    SobreApp: undefined;
};

declare global {
    namespace ReactNavigation {
        // eslint-disable-next-line @typescript-eslint/no-empty-object-type
        interface RootParamList extends ListaDeTelas {}
    }
}
