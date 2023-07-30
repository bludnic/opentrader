import { decomposeSymbolId } from "@bifrost/tools";
import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import {
  computeInvestmentAmount,
  selectCurrencyPair,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { selectCandlesticksState } from "src/store/candlesticks/selectors";
import { selectCurrentAssetPriceState } from "src/store/current-asset-price/selectors";
import { useAppSelector } from "src/store/hooks";
import { FetchStatus } from "src/utils/redux/types";
import { InvestmentFieldHelperText } from "./InvestmentFieldHelperText";

const componentName = "InvestmentField";
const classes = {
  root: `${componentName}-root`,
  input: `${componentName}-input`,
};
const Root = styled(FormControl)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`& .${classes.input}`]: {
    "&::-webkit-inner-spin-button, &::-webkit-outer-spin-button": {
      display: "none", // hides up/down arrow dials of `<input type="number" />`
    },
  },
}));

type InvestmentFieldProps = {
  className?: string;
};

export const InvestmentField: FC<InvestmentFieldProps> = (props) => {
  const { className } = props;

  const currencyPair = useAppSelector(selectCurrencyPair);
  const { baseCurrency, quoteCurrency } = decomposeSymbolId(currencyPair);

  const { totalInQuoteCurrency } = useAppSelector(computeInvestmentAmount);

  const { status: candlesticksStatus } = useAppSelector(
    selectCandlesticksState
  );
  const { status: currentAssetPriceStatus } = useAppSelector(
    selectCurrentAssetPriceState
  );

  const loading =
    candlesticksStatus === FetchStatus.Loading ||
    currentAssetPriceStatus === FetchStatus.Loading;

  const inputId = "investment-field";
  const label = "Investment";

  return (
    <Root className={className} fullWidth>
      <InputLabel htmlFor={inputId}>{label}</InputLabel>

      {loading ? (
        <OutlinedInput
          id={inputId}
          endAdornment={
            <InputAdornment position="start">{quoteCurrency}</InputAdornment>
          }
          label={label}
          value={"Computing..."}
          inputProps={{
            className: classes.input,
          }}
          disabled
        />
      ) : (
        <OutlinedInput
          id={inputId}
          endAdornment={
            <InputAdornment position="start">{quoteCurrency}</InputAdornment>
          }
          label={label}
          value={totalInQuoteCurrency}
          type="number"
          inputProps={{
            className: classes.input,
          }}
          disabled
        />
      )}

      {loading ? (
        <FormHelperText>&nbsp;</FormHelperText> // just to keep the element height the same
      ) : (
        <InvestmentFieldHelperText />
      )}
    </Root>
  );
};
