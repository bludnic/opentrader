"use client";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { SxProps } from "@mui/joy/styles/types";
import React, { FC } from "react";
import clsx from "clsx";
import Chip, { ChipProps } from "@mui/joy/Chip";
import { styled } from "@mui/joy/styles";
import { tClient } from "src/lib/trpc/client";
import { TGridBot } from "src/types/trpc";
import { useSnackbar } from "src/ui/snackbar";

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

  if (bot.enabled) {
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
