import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";
import { erroDoEmail, semErros, TAMANHO_MINIMO_SENHA } from "../utils/validacao";

type Erros = {
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
};

// Cadastro: valida os campos, cria a conta e já entra
export function useCadastro() {
    const { cadastrar } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erros, setErros] = useState<Erros>({});
    const [carregando, setCarregando] = useState(false);

    async function enviar() {
        const novosErros: Erros = {
            nome: nome.trim().length < 3 ? "Informe seu nome (mínimo de 3 letras)." : undefined,
            email: erroDoEmail(email),
            senha:
                senha.length < TAMANHO_MINIMO_SENHA
                    ? `A senha precisa ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`
                    : undefined,
            confirmarSenha: confirmarSenha !== senha ? "As senhas não são iguais." : undefined,
        };
        setErros(novosErros);
        if (!semErros(novosErros)) return;

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
