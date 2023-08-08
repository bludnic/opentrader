import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { FC } from "react";
import { SxProps } from "@mui/system";
import { Box, Button, CircularProgress, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useAppSelector } from "src/store/hooks";
import {
  selectCurrencyPair,
  selectGridLines,
} from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { RunGridBotBacktestResponseBodyDto } from "src/lib/bifrost/rtkApi";
import { TradesTable } from "./components/TradesTable/TradesTable";
import { BacktestingForm } from "../BacktestingForm/BacktestingForm";
import {
  selectEndDate,
  selectStartDate,
} from "src/sections/grid-bot/create-bot/store/backtesting-form";

const componentName = "BacktestingCard";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    width: "100%",
  },
}));

export interface BacktestingCardProps {
  className?: string;
  sx?: SxProps<Theme>;
  isLoading?: boolean;
  onRun: () => void;
  data?: RunGridBotBacktestResponseBodyDto;
}

export const BacktestingCard: FC<BacktestingCardProps> = (props) => {
  const { className, sx, isLoading, onRun, data } = props;

  const currencyPair = useAppSelector(selectCurrencyPair);
  const symbol = useAppSelector(selectSymbolById(currencyPair));

  const startDate = useAppSelector(selectStartDate);
  const endDate = useAppSelector(selectEndDate);

  const isDateRangeSelected = !!startDate && !!endDate;

  const handleRun = () => {
    onRun();
  };

  return (
    <Root className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" component="div">
            Backtesting
          </Typography>

          <Button
            onClick={handleRun}
            variant="outlined"
            disabled={isLoading || !isDateRangeSelected}
            startIcon={isLoading ? <CircularProgress size={18} /> : null}
          >
            Run backtest
          </Button>
        </Box>
      </CardContent>

      <Divider />

      <CardContent>
        <BacktestingForm />
      </CardContent>

      <CardContent>
        {isLoading ? (
          <div>Loading...</div>
        ) : data ? (
          <TradesTable
            trades={data.trades}
            baseCurrency={symbol.baseCurrency}
            quoteCurrency={symbol.quoteCurrency}
          />
        ) : null}
      </CardContent>
    </Root>
  );
};
