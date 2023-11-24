import startOfYear from "date-fns/startOfYear";
import { formatDateISO } from "./formatDateISO";

export function startOfYearISO(date?: Date): string {
  const today = new Date();

  return formatDateISO(startOfYear(date || today));
}
