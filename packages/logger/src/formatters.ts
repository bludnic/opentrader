import type { ICandlestick } from "@opentrader/types";
import c from "chalk";

const pad = (value: string | number, length: number) =>
  value.toString().padEnd(length);

export function candle({ open, high, low, close }: ICandlestick) {
  const O = c.green("O");
  const H = c.green("H");
  const L = c.green("L");
  const C = c.green("C");

  return (
    `${O} ${pad(open, 8)}  ` +
    `${H} ${pad(high, 8)}  ` +
    `${L} ${pad(low, 8)}  ` +
    `${C} ${pad(close, 8)}`
  );
}

export function candletime(dateOrTimestamp: Date | number) {
  const pad = (number: number) => number.toString().padStart(2, "0");

  const date = new Date(dateOrTimestamp);

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = "00"; // there is no timeframe with seconds

  return c.gray(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}
