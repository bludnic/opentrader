"use client";

import React, { FC } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";

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
  const { showSnackbar } = useSnackbar();

  const { isLoading, mutate } = tClient.gridBot.syncOrders.useMutation({
    onSuccess() {
      showSnackbar("Orders have been synced");
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
