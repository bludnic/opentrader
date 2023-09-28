import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { Chip, SxProps } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { trpcApi } from "src/lib/trpc/endpoints";
import { TGridBot } from "src/types/trpc";

const componentName = "BotStatusChip";
const classes = {
  root: `${componentName}-root`,
};
const StyledChip = styled(Chip)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BotStatusChipProps = {
  className?: string;
  bot: TGridBot;
  sx?: SxProps<Theme>;
};

export const BotStatusChip: FC<BotStatusChipProps> = (props) => {
  const { className, bot, sx } = props;
  const { enqueueSnackbar } = useSnackbar();

  const queryClient = useQueryClient();
  const startBot = trpcApi.gridBot.start.useMutation({
    options: {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: trpcApi.gridBot.getOne.queryKey(bot.id),
        });
      },
    },
  });

  const stopBot = trpcApi.gridBot.stop.useMutation({
    options: {
      onSuccess() {
        queryClient.invalidateQueries({
          queryKey: trpcApi.gridBot.getOne.queryKey(bot.id),
        });
      },
    },
  });

  useEffect(() => {
    if (startBot.status === "success") {
      enqueueSnackbar("Bot has been enabled", {
        variant: "success",
      });
    } else if (startBot.status === "error") {
      enqueueSnackbar(JSON.stringify(startBot.error), {
        variant: "error",
      });
      console.log(startBot.error);
    }
  }, [startBot.status]);

  useEffect(() => {
    if (stopBot.status === "success") {
      enqueueSnackbar("Bot has been disabled", {
        variant: "success",
      });
    } else if (stopBot.error === QueryStatus.rejected) {
      enqueueSnackbar(JSON.stringify(stopBot.error), {
        variant: "error",
      });
      console.log(stopBot.error);
    }
  }, [stopBot.status]);

  const isLoading = startBot.isLoading || stopBot.isLoading;

  if (isLoading) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        label="Loading..."
        icon={<FiberManualRecordIcon />}
        variant="outlined"
        disabled
        sx={sx}
      />
    );
  }

  if (bot.enabled) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        label="Running"
        icon={<FiberManualRecordIcon />}
        variant="outlined"
        color="success"
        sx={sx}
        onClick={() =>
          stopBot.mutate({
            botId: bot.id,
          })
        }
      />
    );
  }

  return (
    <StyledChip
      className={clsx(classes.root, className)}
      label="Disabled"
      icon={<FiberManualRecordIcon />}
      variant="outlined"
      color="error"
      sx={sx}
      onClick={() =>
        startBot.mutate({
          botId: bot.id,
        })
      }
    />
  );
};
