"use client";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { SxProps } from "@mui/joy/styles/types";
import { useSnackbar } from "notistack";
import React, { FC, useState } from "react";
import clsx from "clsx";
import Chip, { ChipProps } from "@mui/joy/Chip";
import { styled } from "@mui/joy/styles";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";

const componentName = "BotStatusChip";
const classes = {
  root: `${componentName}-root`,
};
const StyledChip = styled(Chip)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BotStatusSwitcherProps = {
  className?: string;
  bot: TGridBot;
  sx?: SxProps;
  size?: ChipProps["size"];
};

export const BotStatusSwitcher: FC<BotStatusSwitcherProps> = (props) => {
  const { className, bot, sx, size } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [enabled, setEnabled] = useState(bot.enabled);

  const startBot = tClient.gridBot.start.useMutation({
    onSuccess() {
      setEnabled(true);

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

  const stopBot = tClient.gridBot.stop.useMutation({
    onSuccess() {
      setEnabled(false);

      enqueueSnackbar("Bot has been stoped", {
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

  if (startBot.isLoading || stopBot.isLoading) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        startDecorator={<FiberManualRecordIcon />}
        variant="outlined"
        disabled
        sx={sx}
        size={size}
      >
        {startBot.isLoading ? "Starting..." : "Stopping..."}
      </StyledChip>
    );
  }

  if (enabled) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        startDecorator={<FiberManualRecordIcon />}
        variant="outlined"
        color="success"
        sx={sx}
        size={size}
        onClick={() =>
          stopBot.mutate({
            botId: bot.id,
          })
        }
      >
        Running
      </StyledChip>
    );
  }

  return (
    <StyledChip
      className={clsx(classes.root, className)}
      startDecorator={<FiberManualRecordIcon />}
      variant="outlined"
      color="danger"
      sx={sx}
      size={size}
      onClick={() =>
        startBot.mutate({
          botId: bot.id,
        })
      }
    >
      Disabled
    </StyledChip>
  );
};
