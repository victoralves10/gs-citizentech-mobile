// TELA 1 (aba)
// Ainda sem conteúdo: mostra só o aviso "em construção".
import TelaBase from "../components/TelaBase";
import EmBreve from "../components/EmBreve";

export default function Tela1() {
    return (
        <TelaBase rolar={false}>
            <EmBreve titulo="Tela 1" />
        </TelaBase>
    );
}
