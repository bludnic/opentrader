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

type RunBotTemplateButtonProps = {
  className?: string;
  bot: TGridBot;
};

export const RunBotTemplateButton: FC<RunBotTemplateButtonProps> = (props) => {
  const { className, bot } = props;
  const { showSnackbar } = useSnackbar();

  const { isLoading, mutate } = tClient.bot.manualProcess.useMutation({
    onSuccess() {
      showSnackbar("Bot template executed");
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
      Run template
    </Button>
  );
};
