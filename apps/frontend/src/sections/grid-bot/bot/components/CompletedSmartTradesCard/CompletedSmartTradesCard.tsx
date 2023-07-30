import { Card, CardContent, Divider, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import React, { FC } from "react";
import clsx from "clsx";
import { GridBotDto, SmartTradeWithProfitDto } from "src/lib/bifrost/client";
import { CompletedSmartTradesTable } from "./components/CompletedSmartTradesTable";

const componentName = "CompletedSmartTradesCard";
const classes = {
  root: `${componentName}-root`,
};
const StyledCard = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedSmartTradesCardProps = {
  className?: string;
  sx?: SxProps<Theme>;
  bot: GridBotDto;
  smartTrades: SmartTradeWithProfitDto[];
};

export const CompletedSmartTradesCard: FC<CompletedSmartTradesCardProps> = (
  props
) => {
  const { className, bot, smartTrades, sx } = props;

  return (
    <StyledCard className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography variant="h6">Completed STs</Typography>
      </CardContent>

      <Divider />

      <CompletedSmartTradesTable bot={bot} smartTrades={smartTrades} />
    </StyledCard>
  );
};
