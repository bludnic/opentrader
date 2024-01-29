"use client";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { SxProps } from "@mui/joy/styles/types";
import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import type { ChipProps } from "@mui/joy/Chip";
import Chip from "@mui/joy/Chip";
import { styled } from "@mui/joy/styles";
import { tClient } from "src/lib/trpc/client";
import type { TBot } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";

const componentName = "BotStatusChip";
const classes = {
  root: `${componentName}-root`,
};
const StyledChip = styled(Chip)(() => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BotStatusSwitcherProps = {
  className?: string;
  bot: TBot;
  sx?: SxProps;
  size?: ChipProps["size"];
};

export const BotStatusSwitcher: FC<BotStatusSwitcherProps> = (props) => {
  const { className, bot, sx, size } = props;
  const { showSnackbar } = useSnackbar();
  const tUtils = tClient.useUtils();

  const invalidateState = () => {
    // workaround, until refactored to one endpoint
    void tUtils.gridBot.getOne.invalidate(bot.id);
    void tUtils.bot.getOne.invalidate(bot.id);

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
      <StyledChip
        className={clsx(classes.root, className)}
        disabled
        size={size}
        startDecorator={<FiberManualRecordIcon />}
        sx={sx}
        variant="outlined"
      >
        {startBot.isLoading ? "Starting..." : "Stopping..."}
      </StyledChip>
    );
  }

  if (bot.enabled) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        color="success"
        onClick={() => {
          stopBot.mutate({
            botId: bot.id,
          });
        }}
        size={size}
        startDecorator={<FiberManualRecordIcon />}
        sx={sx}
        variant="outlined"
      >
        Running
      </StyledChip>
    );
  }

  return (
    <StyledChip
      className={clsx(classes.root, className)}
      color="danger"
      onClick={() => {
        startBot.mutate({
          botId: bot.id,
        });
      }}
      size={size}
      startDecorator={<FiberManualRecordIcon />}
      sx={sx}
      variant="outlined"
    >
      Disabled
    </StyledChip>
  );
};
