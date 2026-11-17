// Quem decide é o USAR_MOCK.compromissos em src/config/mock.ts
import { USAR_MOCK } from "../../config/mock";
import { compromissosMock } from "../../mock/compromissosMock";
import { compromissosApi } from "./compromissosApi";

export const compromissosService = USAR_MOCK.compromissos ? compromissosMock : compromissosApi;
