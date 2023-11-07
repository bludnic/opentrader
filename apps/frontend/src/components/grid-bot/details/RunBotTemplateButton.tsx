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

type RunBotTemplateButtonProps = {
  className?: string;
  bot: TGridBot;
};

export const RunBotTemplateButton: FC<RunBotTemplateButtonProps> = (props) => {
  const { className, bot } = props;
  const { enqueueSnackbar } = useSnackbar();

  const { isLoading, mutate } = tClient.gridBot.manualProcess.useMutation({
    onSuccess() {
      enqueueSnackbar("Bot has been enabled", {
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
      Run template
    </Button>
  );
};
