import { redirect } from "next/navigation";
import { toPage } from "src/utils/next/toPage";

export default async function Page() {
  redirect(toPage("accounts"));
}
