import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";
import { emailValido, TAMANHO_MINIMO_SENHA } from "../utils/validacao";

type ErrosCadastro = {
    nome?: string;
    email?: string;
    senha?: string;
    confirmarSenha?: string;
};

export function useCadastro() {
    const { cadastrar } = useAuth();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [erros, setErros] = useState<ErrosCadastro>({});
    const [carregando, setCarregando] = useState(false);

    function validar() {
        const novosErros: ErrosCadastro = {};

        if (nome.trim().length < 3) {
            novosErros.nome = "Informe seu nome (mínimo de 3 letras).";
        }

        if (!email.trim()) {
            novosErros.email = "Informe o e-mail.";
        } else if (!emailValido(email)) {
            novosErros.email = "E-mail inválido.";
        }

        if (senha.length < TAMANHO_MINIMO_SENHA) {
            novosErros.senha = `A senha precisa ter no mínimo ${TAMANHO_MINIMO_SENHA} caracteres.`;
        }

        if (confirmarSenha !== senha) {
            novosErros.confirmarSenha = "As senhas não são iguais.";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    }

    async function enviar() {
        if (!validar()) {
            return;
        }

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
