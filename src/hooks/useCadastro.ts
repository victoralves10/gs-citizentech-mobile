import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";
import { Erros, temErros } from "../validacoes/regras";
import { CamposCadastro, validarCadastro } from "../validacoes/authValidacoes";

// Cadastro: valida os campos, cria a conta e já entra
export function useCadastro() {
    const { cadastrar } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erros, setErros] = useState<Erros<keyof CamposCadastro>>({});
    const [carregando, setCarregando] = useState(false);

    async function enviar() {
        const novosErros = validarCadastro({ nome, email, senha, confirmarSenha });
        setErros(novosErros);
        if (temErros(novosErros)) return;

        setCarregando(true);
        try {
            await cadastrar(nome.trim(), email.trim(), senha);
            toastSucesso("Conta criada!");
        } catch (erro) {
            toastErro(mensagemDeErro(erro));
        } finally {
            setCarregando(false);
        }
    }

    return {
        nome,
        setNome,
        email,
        setEmail,
        senha,
        setSenha,
        confirmarSenha,
        setConfirmarSenha,
        erros,
        carregando,
        enviar,
    };
}
