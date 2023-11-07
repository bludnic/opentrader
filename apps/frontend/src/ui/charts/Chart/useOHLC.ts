import { ExchangeCode } from "@opentrader/types";
import setMilliseconds from "date-fns/setMilliseconds";
import setSeconds from "date-fns/setSeconds";
import setMinutes from "date-fns/setMinutes";
import { useState, useRef, useEffect } from "react";
import type { OHLCV } from "ccxt";
import { useIsStale } from "src/hooks/useIsStale";
import { CANDLES_PER_PAGE } from "./constants";
import { barSizeToMinutes } from "./utils";
import { TBarSize } from "src/types/literals";
import { useExchange } from "./useExchange";

/**
 * Return current `Date` with hour precision
 */
function currentHour() {
  let date = new Date();

  date = setMilliseconds(date, 0);
  date = setSeconds(date, 0);
  date = setMinutes(date, 0);

  return date;
}

function calcInitialSince(barSize: TBarSize) {
  const date = currentHour();

  return calcNextSince(date.getTime(), barSize);
}

function calcNextSince(since: number, barSize: TBarSize) {
  const timeRange = barSizeToMinutes(barSize) * 60 * 1000; // * seconds * milliseconds

  return since - timeRange * CANDLES_PER_PAGE;
}

export function useOHLC(
  exchangeCode: ExchangeCode,
  currencyPair: string,
  barSize: TBarSize,
) {
  const exchange = useExchange(exchangeCode);
  const fetchCandlesticks = async (
    currencyPair: string,
    since: number,
    barSize: TBarSize,
  ) => {
    const candlesticks = await exchange.current!.fetchOHLCV(
      currencyPair,
      barSize,
      since,
      CANDLES_PER_PAGE,
    );

    return candlesticks;
  };

  const loading = useRef(false);
  const [candlesticks, setCandlesticks] = useState<OHLCV[]>([]);
  const [since, setSince] = useState(calcInitialSince(barSize));

  const resetState = () => {
    setCandlesticks([]);
    setSince(calcInitialSince(barSize));
  };

  const isStale = [
    useIsStale(exchangeCode),
    useIsStale(currencyPair),
    useIsStale(barSize),
  ].includes(true);

  if (isStale) {
    resetState();
  }

  useEffect(() => {
    let shouldUpdate = true;

    loading.current = true;
    fetchCandlesticks(currencyPair, since, barSize).then((data) => {
      if (!shouldUpdate) {
        return;
      }

      setCandlesticks((candlesticks) => [...data, ...candlesticks]);
      loading.current = false;
    });

    return () => {
      shouldUpdate = false;
    };
  }, [exchangeCode, currencyPair, barSize, since]);

  const updateSince = () => {
    if (loading.current) {
      return;
    }

    setSince(calcNextSince(since, barSize));
  };

  console.log("useChart: render");

  return {
    candlesticks,
    fetchPrev: updateSince,
  };
}
