import { USAR_MOCK } from "../../config/mock";
import { locaisMock } from "../../mock/locaisMock";
import { locaisApi } from "./locaisApi";

export const locaisService = USAR_MOCK.locais ? locaisMock : locaisApi;
