import type {
  ExchangeCode,
  IndicatorBarSize,
  IndicatorName,
  IndicatorsResult,
  XCandle,
} from "@opentrader/types";
import { fetchCandles } from "./fetch-candles";
import { indicatorsMap } from "./indicators";

type ComputeIndicatorsParams<I> = {
  exchangeCode: ExchangeCode;
  symbol: string;
  barSize: IndicatorBarSize;
  untilDate: string;
  indicators: I[];
};

export async function computeIndicators<I extends IndicatorName>({
  exchangeCode,
  symbol,
  barSize,
  untilDate,
  indicators,
}: ComputeIndicatorsParams<I>): Promise<XCandle<I>> {
  // Find the maximum number of periods across all indicators.
  // This allows to fetch all needed candles in one request.
  const maxPeriods = Math.max(
    ...indicators.map((i) => indicatorsMap[i].periods),
  );

  const candles = await fetchCandles({
    exchangeCode,
    symbol,
    untilDate,
    barSize,
    limit: maxPeriods,
  });

  const result: IndicatorsResult<I> = {} as IndicatorsResult<I>;
  for (const indicator of indicators) {
    result[indicator] = indicatorsMap[indicator].compute(candles);
  }

  const lastCandle = candles[candles.length - 1];

  return {
    timestamp: new Date(lastCandle.timestamp).getTime(),
    open: lastCandle.open,
    high: lastCandle.high,
    low: lastCandle.low,
    close: lastCandle.close,
    volume: lastCandle.volume,
    indicators: result,
  };
}
