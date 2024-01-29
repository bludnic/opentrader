"use client";

import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import Tooltip from "@mui/joy/Tooltip";
import { tClient } from "src/lib/trpc/client";
import type { TGridBot, TPendingSmartTrade } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";

const componentName = "CronPlacePendingOrderButton";
const classes = {
  root: `${componentName}-root`,
};

type CronPlacePendingOrderButtonProps = {
  className?: string;
  bot: TGridBot;
  smartTrades?: TPendingSmartTrade[];
};

function buildTooltipTable(smartTrades: TPendingSmartTrade[]) {
  const SM_COLUMN_LENGTH = 5;
  const LG_COLUMN_LENGTH = 12;

  const idColumn = "id".padEnd(SM_COLUMN_LENGTH);
  const buyColumn = "buy".padEnd(LG_COLUMN_LENGTH);
  const sellColumn = "sell".padEnd(LG_COLUMN_LENGTH);
  const tableHead = `${idColumn} ${buyColumn} ${sellColumn}`;

  let tableBody = "";

  for (const smartTrade of smartTrades) {
    tableBody += "\n";

    const id = smartTrade.id.toString().padEnd(SM_COLUMN_LENGTH);
    const entryPrice = smartTrade.entryOrder
      .price!.toString()
      .padEnd(LG_COLUMN_LENGTH);
    const tpPrice = smartTrade.takeProfitOrder
      .price!.toString()
      .padEnd(LG_COLUMN_LENGTH);

    tableBody += `${id} ${entryPrice} ${tpPrice}`;
  }

  return `${tableHead}${tableBody}`;
}

// @deprecated
export const CronPlacePendingOrderButton: FC<
  CronPlacePendingOrderButtonProps
> = (props) => {
  const { className, bot, smartTrades = [] } = props;
  const { showSnackbar } = useSnackbar();

  const { isLoading, mutate } = tClient.bot.cronPlaceLimitOrders.useMutation({
    onSuccess() {
      showSnackbar("Orders has been placed");
    },
  });

  const buttonNode = (
    <Button
      className={clsx(classes.root, className)}
      color="primary"
      loading={isLoading}
      loadingPosition="start"
      onClick={() => {
        mutate({
          botId: bot.id,
        });
      }}
      size="lg"
      variant="soft"
    >
      Place pending orders
    </Button>
  );

  if (smartTrades.length > 0) {
    return (
      <Tooltip title={<pre>{buildTooltipTable(smartTrades)}</pre>}>
        {buttonNode}
      </Tooltip>
    );
  }

  return (
    <Button
      className={clsx(classes.root, className)}
      color="primary"
      disabled
      size="lg"
      variant="soft"
    >
      No pending orders
    </Button>
  );
};
