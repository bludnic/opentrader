"use client";

import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import type { TGridBot } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";

const componentName = "StartStopBotButton";
const classes = {
  root: `${componentName}-root`,
};

type StartStopBotButtonProps = {
  className?: string;
  bot: TGridBot;
};

export const StartStopBotButton: FC<StartStopBotButtonProps> = ({
  className,
  bot,
}) => {
  const { showSnackbar } = useSnackbar();
  const tUtils = tClient.useUtils();

  const invalidateState = () => {
    void tUtils.gridBot.getOne.invalidate(bot.id);
    void tUtils.bot.activeSmartTrades.invalidate({ botId: bot.id });
    void tUtils.bot.completedSmartTrades.invalidate({ botId: bot.id });
  };

  const startBot = tClient.bot.start.useMutation({
    onSuccess() {
      invalidateState();

      showSnackbar("Bot has been enabled");
    },
  });

  const stopBot = tClient.bot.stop.useMutation({
    onSuccess() {
      invalidateState();

      showSnackbar("Bot has been stopped");
    },
  });

  if (startBot.isLoading || stopBot.isLoading) {
    return (
      <Button
        className={clsx(classes.root, className)}
        color={startBot.isLoading ? "success" : "danger"}
        loading
        loadingPosition="start"
        size="lg"
        variant="soft"
      >
        {startBot.isLoading ? "Starting..." : "Stopping..."}
      </Button>
    );
  }

  if (bot.enabled) {
    return (
      <Button
        className={clsx(classes.root, className)}
        color="danger"
        onClick={() => {
          stopBot.mutate({
            botId: bot.id,
          });
        }}
        size="lg"
        variant="soft"
      >
        Stop bot
      </Button>
    );
  }

  return (
    <Button
      className={clsx(classes.root, className)}
      color="success"
      onClick={() => {
        startBot.mutate({
          botId: bot.id,
        });
      }}
      size="lg"
      variant="soft"
    >
      Start bot
    </Button>
  );
};
