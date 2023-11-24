import type { ExchangeCode } from "@opentrader/types";
import type { Exchange } from "ccxt";
import { useEffect, useRef } from "react";
import { ccxtInstanceFromExchangeCode } from "./utils";

export function useExchange(exchangeCode: ExchangeCode) {
  const exchange = useRef<Exchange | null>(null);

  useEffect(() => {
    exchange.current = ccxtInstanceFromExchangeCode(exchangeCode);
  }, [exchangeCode]);

  return exchange;
}
