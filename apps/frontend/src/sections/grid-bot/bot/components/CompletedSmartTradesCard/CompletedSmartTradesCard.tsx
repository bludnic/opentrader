import { Card, CardContent, Divider, SxProps, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TGridBot } from "src/types/trpc";
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
  bot: TGridBot;
};

export const CompletedSmartTradesCard: FC<CompletedSmartTradesCardProps> = (
  props,
) => {
  const { className, bot, sx } = props;

  const { isLoading, isError, error, data } =
    trpcApi.gridBot.getCompletedSmartTrades.useQuery({
      input: {
        botId: bot.id,
      },
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>{JSON.stringify(error)}</div>;
  }

  return (
    <StyledCard className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography variant="h6">Completed STs</Typography>
      </CardContent>

      <Divider />

      <CompletedSmartTradesTable bot={bot} smartTrades={data} />
    </StyledCard>
  );
};
