"use client";

import React, { FC } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";
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
    tUtils.gridBot.getOne.invalidate(bot.id);
    tUtils.gridBot.activeSmartTrades.invalidate({ botId: bot.id });
    tUtils.gridBot.completedSmartTrades.invalidate({ botId: bot.id });
  };

  const startBot = tClient.gridBot.start.useMutation({
    onSuccess() {
      invalidateState();

      showSnackbar("Bot has been enabled");
    },
  });

  const stopBot = tClient.gridBot.stop.useMutation({
    onSuccess() {
      invalidateState();

      showSnackbar("Bot has been stopped");
    },
  });

  if (startBot.isLoading || stopBot.isLoading) {
    return (
      <Button
        className={clsx(classes.root, className)}
        loading
        loadingPosition="start"
        color={startBot.isLoading ? "success" : "danger"}
        variant="soft"
        size="lg"
      >
        {startBot.isLoading ? "Starting..." : "Stopping..."}
      </Button>
    );
  }

  if (bot.enabled) {
    return (
      <Button
        onClick={() =>
          stopBot.mutate({
            botId: bot.id,
          })
        }
        className={clsx(classes.root, className)}
        variant="soft"
        color="danger"
        size="lg"
      >
        Stop bot
      </Button>
    );
  }

  return (
    <Button
      onClick={() =>
        startBot.mutate({
          botId: bot.id,
        })
      }
      className={clsx(classes.root, className)}
      variant="soft"
      color="success"
      size="lg"
    >
      Start bot
    </Button>
  );
};
