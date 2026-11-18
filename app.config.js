const { execSync } = require("child_process");

// Commit e data do build para a tela Sobre o App
function lerCommit() {
    const commitDoEas = process.env.EAS_BUILD_GIT_COMMIT_HASH;
    if (commitDoEas) {
        return commitDoEas.slice(0, 7);
    }

    try {
        return execSync("git rev-parse --short HEAD").toString().trim();
    } catch {
        return "sem commit";
    }
}

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

module.exports = ({ config }) => ({
    ...config,
    extra: {
        ...config.extra,
        commit: lerCommit(),
        dataBuild: dataDoBuild(),
    },
});
