import format from "date-fns/format";

export function formatDateTimeISO(date: Date, omitSeconds?: boolean): string {
  if (omitSeconds) {
    return format(date, "yyyy-MM-dd'T'HH:mm:00");
  }

  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}
