import { decomposeSymbolId } from "@opentrader/tools";
import { FormHelperText } from "@mui/material";
import { FC } from "react";
import {
  computeInvestmentAmount,
  selectSymbolId
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";

export const InvestmentFieldHelperText: FC = () => {
  const symbolId = useAppSelector(selectSymbolId);

  const { baseCurrencyAmount, quoteCurrencyAmount, totalInQuoteCurrency } =
    useAppSelector(computeInvestmentAmount);

  const { baseCurrency, quoteCurrency } = decomposeSymbolId(symbolId);

  return (
    <FormHelperText>
      <span>
        {baseCurrencyAmount} {baseCurrency}
      </span>
      <span> + </span>
      <span>
        {quoteCurrencyAmount} {quoteCurrency}
      </span>
      <span> ≈ </span>
      <span>
        {totalInQuoteCurrency} {quoteCurrency}
      </span>
    </FormHelperText>
  );
};
