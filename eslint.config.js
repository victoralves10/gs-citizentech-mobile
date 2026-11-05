// Configuração do ESLint: o "corretor" que aponta erros e código fora do padrão.
// Ele junta duas regras prontas:
//   1) expoConfig  -> as regras recomendadas pelo Expo para React Native
//   2) prettier    -> faz o ESLint reclamar quando a formatação (espaços, aspas...) foge do padrão do Prettier
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierRecomendado = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
    expoConfig,
    prettierRecomendado,
    {
        // pastas que o ESLint não precisa olhar
        ignores: ["dist/*", "node_modules/*", ".expo/*"],
    },
]);
