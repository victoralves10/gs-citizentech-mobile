import { SafeAreaProvider } from "react-native-safe-area-context";
import { TemaProvider } from "./src/theme/TemaContext";
import { AuthProvider } from "./src/context/AuthContext";
import { ApresentacaoProvider } from "./src/context/ApresentacaoContext";
import Rotas from "./src/navigation";
import ToastTema from "./src/components/ToastTema";

export default function App() {
    return (
        <SafeAreaProvider>
            <TemaProvider>
                <AuthProvider>
                    <ApresentacaoProvider>
                        <Rotas />
                        <ToastTema />
                    </ApresentacaoProvider>
                </AuthProvider>
            </TemaProvider>
        </SafeAreaProvider>
    );
}
