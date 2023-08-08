import { IGridLine } from "@bifrost/types";
import { useRunGridBotBacktestMutation } from "src/lib/bifrost/rtkApi";
import { useAppSelector } from "src/store/hooks";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { selectEndDate, selectStartDate } from "../store/backtesting-form";
import { selectCurrencyPair } from "../store/bot-form/selectors";

export function useBacktesting(gridLines: IGridLine[]) {
  const currencyPair = useAppSelector(selectCurrencyPair);
  const symbol = useAppSelector(selectSymbolById(currencyPair));

  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);

  const [runBacktestQuery, backtestQuery] = useRunGridBotBacktestMutation();
  const runBacktest = () => {
    if (!startDate || !endDate) {
      console.error(
        "Cannot run backtest due to nullish `startDate` or `endDate`"
      );
      return;
    }

    runBacktestQuery({
      bot: {
        baseCurrency: symbol.baseCurrency,
        quoteCurrency: symbol.quoteCurrency,
        gridLines,
      },
      startDate,
      endDate,
    });
  };

  return {
    runBacktest,
    backtestQuery,
  };
}
