import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { FC } from "react";
import { SxProps } from "@mui/system";
import { Button, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";
import { BacktestingTable } from "./components/BacktestingTable";
import { useAppSelector } from "src/store/hooks";
import { selectCurrencyPair, selectGridLines } from "src/sections/grid-bot/create-bot/store/bot-form/selectors";
import { selectSymbolById } from "src/store/rtk/getSymbols/selectors";
import { RunGridBotBacktestResponseBodyDto, useRunGridBotBacktestMutation } from "src/lib/bifrost/rtkApi";

const componentName = "BacktestingCard";
const classes = {
  root: `${componentName}-root`,
};

const Root = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    width: '100%'
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
  const gridLines = useAppSelector(selectGridLines);
  
  const handleRun = () => {
    onRun()
  }

  return (
    <Root className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Backtesting
        </Typography>

        <Button onClick={handleRun}>Run backtest</Button>
      </CardContent>

      <Divider />

      <CardContent>
        {isLoading ? <div>Loading...</div> : data ? <BacktestingTable
          smartTrades={data.smartTrades}
          baseCurrency={symbol.baseCurrency}
          quoteCurrency={symbol.quoteCurrency}
        /> : null}
      </CardContent>
    </Root>
  );
};
