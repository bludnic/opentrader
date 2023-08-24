import { formatDateISO } from "./formatDateISO";

export function todayISO(): string {
  return formatDateISO(new Date());
}
