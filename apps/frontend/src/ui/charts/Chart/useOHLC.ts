import type { BarSize, ExchangeCode } from "@opentrader/types";
import { useState, useRef, useEffect } from "react";
import type { OHLCV } from "ccxt";
import { useIsStale } from "src/hooks/useIsStale";
import { barSizeToDuration, roundTimestamp } from "src/utils/charts";
import { CANDLES_PER_PAGE } from "./constants";
import { useExchange } from "./useExchange";

/**
 * Returns current time with `barSize` duration precision
 */
function currentTime(barSize: BarSize) {
  return roundTimestamp(Date.now(), barSize);
}

function calcInitialSince(barSize: BarSize) {
  const timestamp = currentTime(barSize);

  return calcNextSince(timestamp, barSize);
}

function calcNextSince(since: number, barSize: BarSize) {
  const timeRange = barSizeToDuration(barSize); // ms

  return since - timeRange * CANDLES_PER_PAGE;
}

export function useOHLC(
  exchangeCode: ExchangeCode,
  currencyPair: string,
  barSize: BarSize,
) {
  const exchange = useExchange(exchangeCode);
  const fetchCandlesticks = async (
    currencyPair: string,
    since: number,
    barSize: BarSize,
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
    void fetchCandlesticks(currencyPair, since, barSize).then((data) => {
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

  return {
    candlesticks,
    fetchPrev: updateSince,
  };
}
