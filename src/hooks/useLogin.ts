import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";
import { emailValido } from "../utils/validacao";

// as mensagens de erro de cada campo (vazio = sem erro)
type ErrosLogin = {
    email?: string;
    senha?: string;
};

export function useLogin() {
    const { entrar } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState<ErrosLogin>({});
    const [carregando, setCarregando] = useState(false);

    // confere os campos e devolve true se estiver tudo certo
    function validar() {
        const novosErros: ErrosLogin = {};

        if (!email.trim()) {
            novosErros.email = "Informe o e-mail.";
        } else if (!emailValido(email)) {
            novosErros.email = "E-mail inválido.";
        }

        if (!senha) {
            novosErros.senha = "Informe a senha.";
        }

        setErros(novosErros);

        // Object.keys lista os campos com erro. Se a lista estiver vazia, está tudo certo.
        return Object.keys(novosErros).length === 0;
    }

    // chamada no botão "Entrar"
    async function enviar() {
        if (!validar()) {
            return; // tem erro: para aqui e mostra as mensagens nos campos
        }

        setCarregando(true);

        // try/catch: tenta fazer o login; se der erro, cai no catch
        try {
            await entrar(email.trim(), senha);
            toastSucesso("Bem-vindo!");
        } catch (erro) {
            toastErro(mensagemDeErro(erro));
        } finally {
            // finally roda sempre, dando certo ou errado
            setCarregando(false);
        }
    }

    return { email, setEmail, senha, setSenha, erros, carregando, enviar };
}
