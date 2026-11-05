// TELA 2 (aba)
// Ainda sem conteúdo: mostra só o aviso "em construção".
import TelaBase from "../components/TelaBase";
import EmBreve from "../components/EmBreve";

export default function Tela2() {
    return (
        <TelaBase rolar={false}>
            <EmBreve titulo="Tela 2" />
        </TelaBase>
    );
}
