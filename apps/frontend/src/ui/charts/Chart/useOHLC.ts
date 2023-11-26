import type { BarSize, ExchangeCode } from "@opentrader/types";
import { useState, useRef, useEffect } from "react";
import type { OHLCV } from "ccxt";
import { useIsStale } from "src/hooks/useIsStale";
import { barSizeToDuration, roundTimestamp } from "src/utils/charts";
import { useWatchOHLC } from "./useWatchOHLC";
import { logCandle } from "./utils";
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

  // Watch new candles using WebSockets
  useWatchOHLC(exchange, currencyPair, barSize, (candle) => {
    const [timestamp] = candle;

    setCandlesticks((candlesticks) => {
      const isNewCandle = !candlesticks.some(
        (candlestick) => candlestick[0] === timestamp,
      );

      if (isNewCandle) {
        logCandle(`WS: New ${barSize} candle`, candle);
        // push new candle
        return [...candlesticks, candle];
      }
      logCandle(`WS: Updated ${barSize} candle`, candle);
      // replace last candle data
      return [...candlesticks.slice(0, -1), candle];
    });
  });

  return {
    candlesticks,
    fetchPrev: updateSince,
  };
}
