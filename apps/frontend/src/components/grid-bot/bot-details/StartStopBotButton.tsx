"use client";

import { useSnackbar } from "notistack";
import React, { FC, useState } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";

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
  const { enqueueSnackbar } = useSnackbar();

  const [enabled, setEnabled] = useState(bot.enabled);

  const startBot = tClient.gridBot.start.useMutation({
    onSuccess() {
      setEnabled(true);

      enqueueSnackbar("Bot has been enabled", {
        variant: "success",
      });
    },
  });

  const stopBot = tClient.gridBot.stop.useMutation({
    onSuccess() {
      setEnabled(false);

      enqueueSnackbar("Bot has been stoped", {
        variant: "success",
      });
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

  if (enabled) {
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
