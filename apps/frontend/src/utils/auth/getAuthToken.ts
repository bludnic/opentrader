export const AUTH_TOKEN_LS_KEY = "ADMIN_PASSWORD";

export function getAuthToken(): string | null {
  return localStorage.getItem(AUTH_TOKEN_LS_KEY);
}
