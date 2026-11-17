import { USAR_MOCK } from "../../config/mock";
import { authMock } from "../../mock/authMock";
import { authApi } from "./authApi";

export const authService = USAR_MOCK.auth ? authMock : authApi;
