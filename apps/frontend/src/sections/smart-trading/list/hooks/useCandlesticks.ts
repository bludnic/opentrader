import { BarSize } from "@bifrost/types";
import { marketsApi } from "src/lib/markets/marketsApi";
import { startOfYearISO } from "src/utils/date/startOfYearISO";
import { todayISO } from "src/utils/date/todayISO";

export function useCandlesticks(symbolId: string) {
  const { data, isSuccess } = marketsApi.useGetCandlesticksQuery({
    symbolId,
    timeframe: BarSize.ONE_HOUR,
    startDate: startOfYearISO(),
    endDate: todayISO(),
  });

  if (isSuccess) {
    return data.candlesticks;
  }

  return null;
}
