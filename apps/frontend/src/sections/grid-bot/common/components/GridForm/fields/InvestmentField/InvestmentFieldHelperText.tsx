import { decomposeSymbolId } from "@bifrost/tools";
import { FormHelperText } from "@mui/material";
import { FC } from "react";
import {
  computeInvestmentAmount,
  selectCurrencyPair,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";

export const InvestmentFieldHelperText: FC = () => {
  const currencyPair = useAppSelector(selectCurrencyPair);

  const { baseCurrencyAmount, quoteCurrencyAmount, totalInQuoteCurrency } =
    useAppSelector(computeInvestmentAmount);

  const { baseCurrency, quoteCurrency } = decomposeSymbolId(currencyPair);

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
