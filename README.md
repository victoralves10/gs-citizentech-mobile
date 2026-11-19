<div align="center">

# 🌦️ GaroAvisa · Mobile

**O clima dos lugares que importam pra você - com aviso antes do tempo virar.**

Global Solution 2026/2 · CitizenTech · FIAP

<br>

[![Vídeo no YouTube](https://img.shields.io/badge/▶_Vídeo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/zU0HBDHeVx8)
[![Vídeo no Drive](https://img.shields.io/badge/▶_Vídeo_(cópia)-Google_Drive-1FA463?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/18ytmjAkBPiLnIdSdy6tLw17Phe8nwFjL/view?usp=sharing)
[![Baixar o app](https://img.shields.io/badge/⬇_Baixar_APK-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://appdistribution.firebase.dev/i/55cf0dae86eab266)

<br>

![React Native](https://img.shields.io/badge/React_Native-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo_SDK_58-000020?style=flat-square&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-6B52AE?style=flat-square&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=flat-square&logo=axios&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-1A2C34?style=flat-square&logo=prettier&logoColor=F7B93E)

</div>

---

## 📑 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Funcionalidades](#-funcionalidades)
- [Validações](#-validações)
- [Tecnologias](#-tecnologias)
- [Como rodar](#-como-rodar)
- [Estrutura](#-estrutura)
- [Publicação](#-publicação)
- [Vídeo](#-vídeo)
- [Equipe](#-equipe)

---

## 💡 Sobre o projeto

O **GaroAvisa** mostra o clima dos lugares que importam para o cidadão (casa, trabalho,
escola), avisa quando o tempo pede atenção e junta a previsão aos compromissos marcados
em cada lugar.

---

## ✨ Funcionalidades

| | Tela | O que faz |
| :-: | --- | --- |
| 🔐 | **Login e Cadastro** | Cadastro, login e logout com JWT. Telas protegidas só aparecem com login |
| 🏠 | **Home** | Clima do local principal, alertas de hoje, dicas, próximas horas e o que mudou |
| 📍 | **Meus Locais** | CRUD de locais com busca, paginação, local principal e alertas liga/desliga |
| 🗺️ | **Detalhes do local** | Previsão de 48 horas e 16 dias, alertas e compromissos do local |
| 📅 | **Compromissos** | CRUD com calendário e a previsão do dia de cada compromisso |
| 🔎 | **Pesquisa** | Previsão de qualquer lugar sem precisar salvar |
| ⚠️ | **Alertas** | Alertas e mudanças de todos os locais com alertas ligados |
| 👤 | **Perfil** | Trocar nome e senha, tema claro/escuro e excluir conta |
| ℹ️ | **Sobre o App** | Versão, hash do commit e data do build |

---

## ✅ Validações

Todo formulário é conferido no app antes de chamar a API, e o erro aparece embaixo do
campo. Os limites são os mesmos da API Java, que valida de novo (Bean Validation).

| Formulário | O que é conferido | Onde |
| --- | --- | --- |
| Login | e-mail obrigatório e válido, senha obrigatória | `validacoes/authValidacoes.ts` |
| Cadastro | nome (3 a 100), e-mail (até 100), senha (6 a 72), confirmação igual | `validacoes/authValidacoes.ts` |
| Perfil | nome (3 a 100); senha atual, nova senha (6 a 72 e diferente da atual) e confirmação | `validacoes/perfilValidacoes.ts` |
| Local | apelido obrigatório (até 50) | `validacoes/localValidacoes.ts` |
| Compromisso | nome obrigatório (até 80), data escolhida e não pode estar no passado | `validacoes/compromissoValidacoes.ts` |


---

## 🛠️ Tecnologias

| Categoria | Ferramentas |
| --- | --- |
| Base | React Native, Expo SDK 58, TypeScript |
| Navegação | React Navigation (pilha + abas) |
| Dados | Axios, AsyncStorage |
| Interface | react-native-calendars, react-native-toast-message |
| Qualidade | ESLint, Prettier |
| Build | EAS Build (APK) e Firebase App Distribution |

---

## 🚀 Como rodar

```bash
npm install
npx expo start
```

Abra no **Expo Go** (Android ou iPhone) lendo o QR Code.

---

## 🗂️ Estrutura

```
src/
├── components/   peças visuais reaproveitadas pelas telas
├── config/       números usados em mais de um lugar
├── context/      sessão do usuário e apresentação
├── data/         textos da apresentação
├── hooks/        lógica das telas (estado, chamadas à API, validação)
├── models/       formato dos dados da API
├── navigation/   pilha + abas e o nome de cada tela
├── screens/      telas (só desenham)
├── services/     chamadas HTTP (API Java e Open-Meteo)
├── storage/      o que fica salvo no celular
├── theme/        cores e tema claro/escuro
├── utils/        formatação, datas, ícones e confirmação
└── validacoes/   regras dos formulários
```

**Fluxo:** `tela → hook → service → API`

---

## 📦 Publicação

O APK está no **Firebase App Distribution**.

<div align="center">

[![Baixar no Firebase](https://img.shields.io/badge/⬇_Baixar_o_GaroAvisa-Firebase_App_Distribution-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://appdistribution.firebase.dev/i/55cf0dae86eab266)

</div>

1. Abra o link no celular Android.
2. Entre com o seu e-mail e toque em **Baixar**.
3. O convite também chega por e-mail, de `firebase-noreply@google.com` (confira o spam).

> [!TIP]
> A tela **Sobre o App** mostra o hash do commit usado no build. A versão publicada
> corresponde ao commit **`14a39fe`**.

---

## 🎬 Vídeo

<div align="center">

[![Assistir no YouTube](https://img.shields.io/badge/▶_Assistir-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://youtu.be/zU0HBDHeVx8)
[![Cópia no Drive](https://img.shields.io/badge/▶_Cópia-Google_Drive-1FA463?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com/file/d/18ytmjAkBPiLnIdSdy6tLw17Phe8nwFjL/view?usp=sharing)

</div>

- YouTube: <https://youtu.be/zU0HBDHeVx8>
- Cópia no Google Drive (caso o YouTube não abra): <https://drive.google.com/file/d/18ytmjAkBPiLnIdSdy6tLw17Phe8nwFjL/view?usp=sharing>

---

## 👥 Equipe

| Nome | RM |
| --- | :-: |
| Eduardo Batista Locaspi | 561713 |
| Enzo Vieira Bernardini | 563000 |
| Liana Lyumi Morisita Fujisima | 565698 |
| Victor Alves Lopes | 561833 |

<div align="center">

<br>

Feito com ☔ pela equipe GaroAvisa · FIAP 2026

</div>
