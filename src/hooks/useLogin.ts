import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { mensagemDeErro } from "../services/api";
import { toastErro, toastSucesso } from "../utils/toast";
import { Erros, temErros } from "../validacoes/regras";
import { CamposLogin, validarLogin } from "../validacoes/authValidacoes";

// Login: valida os campos e entra pela API
export function useLogin() {
    const { entrar } = useAuth();

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [erros, setErros] = useState<Erros<keyof CamposLogin>>({});
    const [carregando, setCarregando] = useState(false);

    async function enviar() {
        const novosErros = validarLogin({ email, senha });
        setErros(novosErros);
        if (temErros(novosErros)) return;

        setCarregando(true);
        try {
            await entrar(email.trim(), senha);
            toastSucesso("Bem-vindo!");
        } catch (erro) {
            toastErro(mensagemDeErro(erro));
        } finally {
            setCarregando(false);
        }
    }

    return { email, setEmail, senha, setSenha, erros, carregando, enviar };
}
