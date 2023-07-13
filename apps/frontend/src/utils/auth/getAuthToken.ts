export const AUTH_TOKEN_LS_KEY = "auth_token";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_LS_KEY);
}
