import { exchanges } from "#exchanges/exchanges";
import { ExchangeCode } from "@opentrader/types";
import { useMemo } from "react";

export function useExchange(exchangeCode: ExchangeCode) {
  const exchange = useMemo(() => exchanges[exchangeCode](), [exchangeCode]);

  return exchange;
}
