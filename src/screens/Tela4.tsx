// TELA 4 (abre por cima das abas)
// Ainda sem conteúdo. Como ela fica na "pilha", o topo já tem o botão de voltar.
import TelaBase from "../components/TelaBase";
import EmBreve from "../components/EmBreve";

export default function Tela4() {
    return (
        <TelaBase rolar={false} comCabecalho>
            <EmBreve titulo="Tela 4" />
        </TelaBase>
    );
}
