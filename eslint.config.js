// ESLint: regras do Expo + Prettier
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const prettierRecomendado = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
    expoConfig,
    prettierRecomendado,
    {
        ignores: ["dist/*", "node_modules/*", ".expo/*"],
    },
]);
