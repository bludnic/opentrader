import { toPage } from "src/utils/next/toPage";

export function isLoginPage() {
  return window.location.pathname === toPage("login");
}
