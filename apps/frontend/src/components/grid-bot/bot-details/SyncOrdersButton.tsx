"use client";

import { useSnackbar } from "notistack";
import React, { FC } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";

const componentName = "RunBotTemplateButton";
const classes = {
  root: `${componentName}-root`,
};

type SyncOrdersButtonProps = {
  className?: string;
  bot: TGridBot;
};

export const SyncOrdersButton: FC<SyncOrdersButtonProps> = (props) => {
  const { className, bot } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, mutate } = tClient.gridBot.syncOrders.useMutation({
    onSuccess() {
      enqueueSnackbar("Orders have been synced", {
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

  return (
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
      Sync orders
    </Button>
  );
};
