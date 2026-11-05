const { execSync } = require("child_process");

// descobre o hash curto do commit atual (ex.: "a1b2c3d")
function lerCommit() {
    // quando o APK é gerado no EAS, ele informa o commit nesta variável
    const commitDoEas = process.env.EAS_BUILD_GIT_COMMIT_HASH;
    if (commitDoEas) {
        return commitDoEas.slice(0, 7);
    }

    // rodando no computador: pergunta para o próprio Git
    try {
        return execSync("git rev-parse --short HEAD").toString().trim();
    } catch {
        return "sem commit";
    }
}

// data e hora de agora, no formato brasileiro (ex.: "05/11/2026 14:52")
function dataDoBuild() {
    return new Date()
        .toLocaleString("pt-BR", {
            timeZone: "America/Sao_Paulo",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        .replace(",", "");
}

// "config" é o que veio do app.json. Devolvemos ele igual, só com os 2 dados a mais em "extra".
module.exports = ({ config }) => ({
    ...config,
    extra: {
        ...config.extra,
        commit: lerCommit(),
        dataBuild: dataDoBuild(),
    },
});
