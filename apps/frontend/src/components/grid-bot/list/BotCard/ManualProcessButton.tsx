import { useSnackbar } from "notistack";
import React, { FC } from "react";
import clsx from "clsx";
import Button from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";

const componentName = "ManualProcessButton";
const classes = {
  root: `${componentName}-root`,
};

type ManualProcessButtonProps = {
  className?: string;
  bot: TGridBot;
};

export const ManualProcessButton: FC<ManualProcessButtonProps> = (props) => {
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
      variant="solid"
      color="primary"
      type="submit"
      disabled={isLoading}
      startDecorator={isLoading ? <CircularProgress size="md" /> : null}
    >
      Manual Process
    </Button>
  );
};
