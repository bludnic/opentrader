"use client";

import { useSnackbar } from "notistack";
import React, { FC } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { TGridBot, TPendingSmartTrade } from "src/types/trpc";
import Tooltip from "@mui/joy/Tooltip";

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

export const CronPlacePendingOrderButton: FC<
  CronPlacePendingOrderButtonProps
> = (props) => {
  const { className, bot, smartTrades = [] } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, mutate } =
    tClient.gridBot.cronPlaceLimitOrders.useMutation({
      onSuccess() {
        enqueueSnackbar("Orders has been placed", {
          variant: "success",
        });
      },
      onError(error) {
        enqueueSnackbar(JSON.stringify(error), {
          variant: "error",
        });
        console.log(error);
      },
    });

  const buttonNode = (
    <Button
      onClick={() =>
        mutate({
          botId: bot.id,
        })
      }
      className={clsx(classes.root, className)}
      variant="soft"
      size="lg"
      color="primary"
      loading={isLoading}
      loadingPosition="start"
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
      variant="soft"
      size="lg"
      color="primary"
      disabled
    >
      No pending orders
    </Button>
  );
};
