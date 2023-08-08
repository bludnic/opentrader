import format from "date-fns/format";

export function formatDateISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
