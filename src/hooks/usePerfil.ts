import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { usuarioService } from "../services/usuario/usuarioService";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";

type Janela = "nome" | "sobreMim" | "senha" | null;

// tamanho máximo do "Sobre mim" (igual à API)
export const TAMANHO_SOBRE_MIM = 200;

export function usePerfil() {
    const { usuario, atualizarUsuario, sair } = useAuth();

    // qual janela está aberta
    const [janela, setJanela] = useState<Janela>(null);

    // os campos das janelas
    const [nome, setNome] = useState("");
    const [sobreMim, setSobreMim] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");

    // erro mostrado dentro da janela e rodinha do botão Salvar
    const [erro, setErro] = useState<string>();
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    // ---------- quando a tela aparece: busca os dados atualizados ----------
    // (useFocusEffect roda toda vez que o usuário entra na aba Perfil)
    useFocusEffect(
        useCallback(() => {
            usuarioService
                .buscar()
                .then(atualizarUsuario)
                .catch(() => {
                    // sem internet: continua mostrando o que já estava guardado
                });
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    // ---------- abrir e fechar ----------
    function abrirNome() {
        setNome(usuario?.nome ?? "");
        abrir("nome");
    }

    function abrirSobreMim() {
        setSobreMim(usuario?.perfilIa ?? "");
        abrir("sobreMim");
    }

    function abrirSenha() {
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmacao("");
        abrir("senha");
    }

    function abrir(qual: Janela) {
        setErro(undefined);
        setJanela(qual);
    }

    function fechar() {
        setJanela(null);
    }

    // ---------- salvar (a mesma função serve para as 3 janelas) ----------
    async function salvar() {
        // conferência rápida antes de chamar a API (o resto a API confere)
        if (janela === "nome" && !nome.trim()) {
            return setErro("Informe o seu nome.");
        }
        if (janela === "senha") {
            if (!senhaAtual || !novaSenha) {
                return setErro("Preencha a senha atual e a nova senha.");
            }
            if (novaSenha !== confirmacao) {
                return setErro("A confirmação não é igual à nova senha.");
            }
        }

        setErro(undefined);
        setSalvando(true);
        try {
            if (janela === "nome") {
                await atualizarUsuario(await usuarioService.alterarNome(nome.trim()));
                toastSucesso("Nome atualizado!");
            } else if (janela === "sobreMim") {
                await atualizarUsuario(await usuarioService.alterarSobreMim(sobreMim.trim()));
                toastSucesso('"Sobre mim" atualizado!');
            } else if (janela === "senha") {
                await usuarioService.alterarSenha(senhaAtual, novaSenha);
                toastSucesso("Senha trocada!");
            }
            fechar();
        } catch (e) {
            // ex.: "Senha atual incorreta." (a mensagem vem pronta da API)
            setErro(mensagemDeErro(e));
        } finally {
            setSalvando(false);
        }
    }

    // ---------- excluir conta ----------
    async function excluirConta() {
        setExcluindo(true);
        try {
            await usuarioService.excluirConta();
            await sair(); // apaga a sessão e volta para o Login
            toastSucesso("Sua conta foi excluída.");
        } catch (e) {
            toastErro(mensagemDeErro(e));
            setExcluindo(false);
        }
    }

    return {
        usuario,
        janela,
        erro,
        salvando,
        excluindo,
        campos: {
            nome,
            setNome,
            sobreMim,
            setSobreMim,
            senhaAtual,
            setSenhaAtual,
            novaSenha,
            setNovaSenha,
            confirmacao,
            setConfirmacao,
        },
        abrirNome,
        abrirSobreMim,
        abrirSenha,
        fechar,
        salvar,
        excluirConta,
    };
}
