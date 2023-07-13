export function setAuthHeader(authToken: string, headers: Headers): void {
  headers.set("Authorization", `Bearer ${authToken}`);
}
