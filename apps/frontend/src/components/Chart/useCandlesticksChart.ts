import { BarSize, ExchangeCode } from "@opentrader/types";
import { sub } from "date-fns";
import { useEffect, useState } from "react";
import { useCandlesticks } from "src/components/Chart/useCandlesticks";
import { useChart } from "src/components/Chart/useChart";
import { useExchange } from "src/components/Chart/useExchange";
import { formatDateTimeISO } from "src/utils/date/fromatDateTimeISO";

type UseCandlesticksChartParams = {
  exchangeCode: ExchangeCode;
  symbol: string;
  barSize: BarSize;
};

const PER_PAGE = 100;

function barSizeToMinutes(barSize: BarSize): number {
  const map: Record<BarSize, number> = {
    [BarSize.ONE_MINUTE]: 1,
    [BarSize.FIVE_MINUTES]: 5,
    [BarSize.FIFTEEN_MINUTES]: 15,
    [BarSize.ONE_HOUR]: 60,
    [BarSize.FOUR_HOURS]: 60 * 4,
    [BarSize.ONE_DAY]: 60 * 24,
    [BarSize.ONE_WEEK]: 60 * 24 * 7,
    [BarSize.ONE_MONTH]: 60 * 24 * 30,
    [BarSize.THREE_MONTHS]: 60 * 24 * 30 * 3,
  };

  return map[barSize];
}

function calcSinceDate(barSize: BarSize, date: Date = new Date()) {
  const minutesAgo = barSizeToMinutes(barSize);

  const nextSinceDate = formatDateTimeISO(
    sub(date, {
      minutes: minutesAgo * PER_PAGE,
    }),
    true,
  );

  return nextSinceDate;
}

export function useCandlesticksChart(params: UseCandlesticksChartParams) {
  const { exchangeCode, symbol, barSize } = params;

  const [since, setSince] = useState(() => calcSinceDate(barSize)); // date ISO

  const exchange = useExchange(exchangeCode);

  const { fetchStatus, candlesticks, fetchCandles, resetCandlesticks } =
    useCandlesticks({
      exchange,
      symbol,
      since,
      barSize,
    });
  useEffect(() => {
    if (fetchStatus === "loading") {
      console.log("Skip fetch candles. Already in loading state.");
    } else {
      void fetchCandles();
    }
  }, [since]);

  const { chartRef, loading, chart, candlesticksSeries, logicalRange } =
    useChart();
  useEffect(() => {
    if (!logicalRange) return console.log("Logical range is null");
    if (fetchStatus === "loading")
      return console.log("Logical range: is loading candles");

    if (logicalRange.from < 0) {
      const nextSinceDate = calcSinceDate(barSize, new Date(since));
      setSince(nextSinceDate);
    }
  }, [logicalRange]);

  useEffect(() => {
    resetCandlesticks();
    setSince(calcSinceDate(barSize)); // @todo don't repeat yourself: reset to default value
  }, [exchange, symbol, barSize]);

  useEffect(() => {
    if (!candlesticksSeries) {
      return console.log(
        "Chart: useEffect: candlesticksSeries is not initialized",
      );
    }

    console.log("Chart: useEffect: candlesticksSeries.setData", candlesticks);

    candlesticksSeries.setData(candlesticks);
  }, [candlesticks]);

  return {
    chart: {
      ref: chartRef,
      loading,
      api: chart,
      series: candlesticksSeries,
    },
    candlesticks: {
      fetchStatus,
    },
  };
}
