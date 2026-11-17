import { USAR_MOCK } from "../../config/mock";
import { lugaresMock } from "../../mock/lugaresMock";
import { lugaresApi } from "./lugaresApi";

export const lugaresService = USAR_MOCK.lugares ? lugaresMock : lugaresApi;
