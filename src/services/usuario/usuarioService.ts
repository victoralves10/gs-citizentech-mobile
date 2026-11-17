import { USAR_MOCK } from "../../config/mock";
import { usuarioMock } from "../../mock/usuarioMock";
import { usuarioApi } from "./usuarioApi";

export const usuarioService = USAR_MOCK.usuario ? usuarioMock : usuarioApi;
