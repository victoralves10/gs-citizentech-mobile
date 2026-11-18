import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { usuarioService } from "../services/usuarioService";
import { mensagemDeErro } from "../services/api";
import { confirmarExclusao } from "../utils/confirmar";
import { toastErro, toastSucesso } from "../utils/toast";

type Janela = "nome" | "senha" | null;

// Perfil: editar nome e senha, sair e excluir a conta (uma janela por vez)
export function usePerfil() {
    const { usuario, atualizarUsuario, sair } = useAuth();

    const [janela, setJanela] = useState<Janela>(null);
    const [nome, setNome] = useState("");
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmacao, setConfirmacao] = useState("");
    const [erro, setErro] = useState<string>();
    const [salvando, setSalvando] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    // atualiza os dados sempre que a aba aparece (sem internet, mantém os guardados)
    useFocusEffect(
        useCallback(() => {
            usuarioService
                .buscar()
                .then(atualizarUsuario)
                .catch(() => {});
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    function abrir(qual: Janela) {
        setNome(usuario?.nome ?? "");
        setSenhaAtual("");
        setNovaSenha("");
        setConfirmacao("");
        setErro(undefined);
        setJanela(qual);
    }

    async function salvar() {
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
            } else {
                await usuarioService.alterarSenha(senhaAtual, novaSenha);
                toastSucesso("Senha trocada!");
            }
            setJanela(null);
        } catch (e) {
            setErro(mensagemDeErro(e));
        } finally {
            setSalvando(false);
        }
    }

    function pedirSaida() {
        Alert.alert("Sair da conta", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", style: "destructive", onPress: sair },
        ]);
    }

    function excluirConta() {
        confirmarExclusao({
            titulo: "Excluir minha conta",
            mensagem: "Seus locais e compromissos também serão apagados.",
            aoConfirmar: async () => {
                setExcluindo(true);
                try {
                    await usuarioService.excluirConta();
                    await sair();
                    toastSucesso("Sua conta foi excluída.");
                } catch (e) {
                    toastErro(mensagemDeErro(e));
                    setExcluindo(false);
                }
            },
        });
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
            senhaAtual,
            setSenhaAtual,
            novaSenha,
            setNovaSenha,
            confirmacao,
            setConfirmacao,
        },
        abrirNome: () => abrir("nome"),
        abrirSenha: () => abrir("senha"),
        fechar: () => setJanela(null),
        salvar,
        pedirSaida,
        excluirConta,
    };
}
