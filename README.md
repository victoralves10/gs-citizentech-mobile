# GaroAvisa (Mobile)

App da Global Solution 2026/2 (CitizenTech). Mostra o clima dos lugares que importam
para o cidadão (casa, trabalho, escola), avisa quando o tempo pede atenção e junta a
previsão aos compromissos marcados em cada lugar.

O app só mostra informações: toda a regra de negócio fica na API Java
(<https://garoavisa-api.onrender.com>).

## Funcionalidades

- Cadastro, login e logout com JWT (telas protegidas só aparecem com login)
- Home com o clima do local principal, alertas de hoje, dicas, próximas horas e o que mudou
- Meus Locais: CRUD de locais com busca, paginação, local principal e alertas liga/desliga
- Detalhes do local: previsão de 48 horas e 16 dias, alertas e compromissos do local
- Compromissos: CRUD com calendário e a previsão do dia de cada compromisso
- Pesquisa: previsão de qualquer lugar sem precisar salvar
- Alertas: alertas e mudanças de todos os locais com alertas ligados
- Perfil: trocar nome e senha, tema claro/escuro e excluir conta
- Sobre o App: versão, hash do commit e data do build

Exclusões (local, compromisso, conta e buscas recentes) pedem confirmação dupla.

## Validações

Todo formulário é conferido no app antes de chamar a API, e o erro aparece embaixo
do campo. Os limites são os mesmos da API Java, que valida de novo (Bean Validation)
e devolve a mensagem que o app mostra.

| Formulário  | O que é conferido                                                                   | Onde                                  |
| ----------- | ----------------------------------------------------------------------------------- | ------------------------------------- |
| Login       | e-mail obrigatório e válido, senha obrigatória                                      | `validacoes/authValidacoes.ts`        |
| Cadastro    | nome (3 a 100), e-mail (até 100), senha (6 a 72), confirmação igual                 | `validacoes/authValidacoes.ts`        |
| Perfil      | nome (3 a 100); senha atual, nova senha (6 a 72 e diferente da atual) e confirmação | `validacoes/perfilValidacoes.ts`      |
| Local       | apelido obrigatório (até 50)                                                        | `validacoes/localValidacoes.ts`       |
| Compromisso | nome obrigatório (até 80), data escolhida e não pode estar no passado               | `validacoes/compromissoValidacoes.ts` |

Camadas: a tela mostra o erro no campo → o hook chama a validação e só chama o service
se estiver tudo certo → as regras ficam em `src/validacoes/`.

## Tecnologias

React Native, Expo SDK 58, TypeScript, React Navigation, Axios, AsyncStorage,
react-native-calendars, react-native-toast-message, ESLint e Prettier.

## Como rodar

```bash
npm install
npx expo start
```

Abra no Expo Go (Android ou iPhone) lendo o QR Code.

Conferir o código:

```bash
npm run format && npm run lint && npm run typecheck
```

## Estrutura

```
src/
  components/   peças visuais reaproveitadas pelas telas
  config/       números usados em mais de um lugar
  context/      sessão do usuário e apresentação
  data/         textos da apresentação
  hooks/        lógica das telas (estado, chamadas à API, validação)
  models/       formato dos dados da API
  navigation/   pilha + abas e o nome de cada tela
  screens/      telas (só desenham)
  services/     chamadas HTTP (API Java e Open-Meteo)
  storage/      o que fica salvo no celular
  theme/        cores e tema claro/escuro
  utils/        formatação, datas, ícones e confirmação
  validacoes/   regras dos formulários
```

Fluxo: tela → hook → service → API.

## Publicação

O APK está no Firebase App Distribution.

- Link de convite: <https://appdistribution.firebase.dev/i/55cf0dae86eab266>
- Abra o link no celular Android, entre com o seu e-mail e toque em "Baixar".
- O convite também chega por e-mail, de firebase-noreply@google.com (confira o spam).

A tela Sobre o App mostra o hash do commit usado no build.

## Vídeo

Link do vídeo: _(adicionar)_

## Equipe

- Eduardo Batista Locaspi (RM561713)
- Enzo Vieira Bernardini (RM563000)
- Liana Lyumi Morisita Fujisima (RM565698)
- Victor Alves Lopes (RM561833)
