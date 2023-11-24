import { decomposeSymbolId } from "@opentrader/tools";
import FormHelperText from "@mui/joy/FormHelperText";
import type { FC } from "react";
import { selectSymbolId } from "src/store/bot-form/selectors";
import { useAppSelector } from "src/store/hooks";

type InvestmentFieldHelperTextProps = {
  baseCurrencyAmount: string; // numeric string
  quoteCurrencyAmount: string; // numeric string
  totalInQuoteCurrency: string; // numeric string
};

export const InvestmentFieldHelperText: FC<InvestmentFieldHelperTextProps> = ({
  baseCurrencyAmount,
  quoteCurrencyAmount,
  totalInQuoteCurrency,
}) => {
  const symbolId = useAppSelector(selectSymbolId);
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
