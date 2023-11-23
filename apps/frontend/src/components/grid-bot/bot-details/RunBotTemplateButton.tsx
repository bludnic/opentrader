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

type RunBotTemplateButtonProps = {
  className?: string;
  bot: TGridBot;
};

export const RunBotTemplateButton: FC<RunBotTemplateButtonProps> = (props) => {
  const { className, bot } = props;
  const { showSnackbar } = useSnackbar();

  const { isLoading, mutate } = tClient.gridBot.manualProcess.useMutation({
    onSuccess() {
      showSnackbar("Bot has been enabled");
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
