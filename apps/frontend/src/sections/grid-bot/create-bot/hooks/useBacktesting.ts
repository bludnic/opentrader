import { IGridLine } from "@bifrost/types";
import { useRunGridBotBacktestMutation } from "src/lib/bifrost/rtkApi";
import { useSymbol } from "src/sections/grid-bot/create-bot/hooks/useSymbol";
import { useAppSelector } from "src/store/hooks";
import { selectEndDate, selectStartDate } from "../store/backtesting-form";
import { selectExchangeCode } from "../store/bot-form/selectors";

export function useBacktesting(gridLines: IGridLine[]) {
  const exchangeCode = useAppSelector(selectExchangeCode);
  const symbol = useSymbol();

  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);

  const [runBacktestQuery, backtestQuery] = useRunGridBotBacktestMutation();
  const runBacktest = () => {
    if (!startDate || !endDate) {
      console.error(
        "Cannot run backtest due to nullish `startDate` or `endDate`",
      );
      return;
    }

    runBacktestQuery({
      bot: {
        baseCurrency: symbol.baseCurrency,
        quoteCurrency: symbol.quoteCurrency,
        gridLines,
      },
      exchangeCode,
      startDate,
      endDate,
    });
  };

  return {
    runBacktest,
    backtestQuery,
  };
}
