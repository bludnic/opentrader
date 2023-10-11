import { IExchange } from "#exchanges/types";
import { BarSize, ICandlestick } from "@opentrader/types";
import { OhlcData, UTCTimestamp } from "lightweight-charts";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { formatDateISO } from "src/utils/date/formatDateISO";
import { formatDateTimeISO } from "src/utils/date/fromatDateTimeISO";

type UseCandlesticksParams = {
  /**
   * Exchange instance
   */
  exchange: IExchange;
  /**
   * e.g. BTC/USDT
   */
  symbol: string;
  /**
   * Date ISO
   * e.g. 2023-01-13
   */
  since: string;
  barSize: BarSize;
};

type UseCandlesticksResult = {
  fetchStatus: "idle" | "loading" | "success" | "error";
  candlesticks: OhlcData[];
  resetCandlesticks: () => void;
  fetchCandles: () => Promise<void>;
};

type FetchStatus = "idle" | "loading" | "success" | "error";

function normalize(candle: ICandlestick): OhlcData {
  return {
    time: (candle.timestamp / 1000) as UTCTimestamp, // @todo correct type
    open: candle.open,
    high: candle.high,
    low: candle.low,
    close: candle.close,
  };
}

export function useCandlesticks(
  params: UseCandlesticksParams,
): UseCandlesticksResult {
  const { exchange, symbol, barSize, since } = params;
  const [fetchStatus, setFetchStatus] = useState<FetchStatus>("idle");
  const [candlesticks, setCandlesticks] = useState<OhlcData[]>([]);

  const fetchCandles = async () => {
    setFetchStatus("loading");

    try {
      const data = await exchange.getCandlesticks({
        symbol,
        since: new Date(since).getTime(),
        bar: barSize,
      });

      const normalizedData = data.map(normalize);
      setCandlesticks((candlesticks) => [...normalizedData, ...candlesticks]);

      setFetchStatus("success");
    } catch (error) {
      setFetchStatus("error");
    }
  };

  const resetCandlesticks = () => {
    setCandlesticks([]);
  };

  return {
    fetchStatus,
    candlesticks,
    resetCandlesticks,
    fetchCandles,
  };
}
