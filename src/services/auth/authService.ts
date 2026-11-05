import { authMock } from "./authMock";
import { authApi } from "./authApi";

export const USAR_MOCK = true;

export const authService = USAR_MOCK ? authMock : authApi;
