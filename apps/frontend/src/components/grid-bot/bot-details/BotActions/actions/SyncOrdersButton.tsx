"use client";

import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import type { TGridBot } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";

const componentName = "RunBotTemplateButton";
const classes = {
  root: `${componentName}-root`,
};

type SyncOrdersButtonProps = {
  className?: string;
  bot: TGridBot;
};

// @deprecated
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
      Sync orders
    </Button>
  );
};
