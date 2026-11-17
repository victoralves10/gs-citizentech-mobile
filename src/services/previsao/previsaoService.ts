import { USAR_MOCK } from "../../config/mock";
import { previsaoMock } from "../../mock/previsaoMock";
import { previsaoApi } from "./previsaoApi";

export const previsaoService = USAR_MOCK.previsao ? previsaoMock : previsaoApi;
