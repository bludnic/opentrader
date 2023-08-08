import format from "date-fns/format";

export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);

  return format(date, "d LLL yyyy HH:mm");
}
