import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import IlustracaoClima from "./IlustracaoClima";
import { PaginaApresentacao } from "../data/apresentacao";
import { useTema } from "../theme/TemaContext";
import { Cores } from "../theme/cores";

// Uma página da apresentação
type Props = {
    pagina: PaginaApresentacao;
    largura: number; // largura da página (= largura da tela)
    altura: number; // altura da página (= espaço entre o topo e o rodapé)
};

export default function SlideApresentacao({ pagina, largura, altura }: Props) {
    const { cores } = useTema();
    const estilos = criarEstilos(cores);

    const { height: alturaTela } = useWindowDimensions();

    const tamanho = Math.min(largura * 0.78, alturaTela * 0.42);

    return (
        <View style={[estilos.pagina, { width: largura, height: altura }]}>
            {pagina.imagem ? (
                <Image
                    source={pagina.imagem}
                    style={{ width: tamanho, height: tamanho }}
                    resizeMode="contain"
                />
            ) : (
                <IlustracaoClima
                    tamanho={tamanho}
                    icone={pagina.icone}
                    iconesExtras={pagina.iconesExtras}
                />
            )}

            <View style={estilos.textos}>
                <Text style={estilos.titulo}>{pagina.titulo}</Text>
                <Text style={estilos.texto}>{pagina.texto}</Text>
            </View>
        </View>
    );
}

function criarEstilos(cores: Cores) {
    return StyleSheet.create({
        pagina: {
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 28,
            gap: 36,
        },
        textos: {
            alignItems: "center",
            gap: 10,
            maxWidth: 340, // em tablet, o texto não fica com linhas compridas demais
        },
        titulo: {
            fontSize: 26,
            fontWeight: "800",
            textAlign: "center",
            color: cores.texto,
        },
        texto: {
            fontSize: 16,
            lineHeight: 23,
            textAlign: "center",
            color: cores.textoSecundario,
        },
    });
}
