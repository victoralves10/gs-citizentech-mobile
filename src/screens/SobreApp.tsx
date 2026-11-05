// SOBRE O APP (abre por cima das abas)
// Ela vai mostrar a versão e o hash do commit.
import TelaBase from "../components/TelaBase";
import EmBreve from "../components/EmBreve";

export default function SobreApp() {
    return (
        <TelaBase rolar={false} comCabecalho>
            <EmBreve titulo="Sobre o App" descricao="Versão e commit do app." />
        </TelaBase>
    );
}
