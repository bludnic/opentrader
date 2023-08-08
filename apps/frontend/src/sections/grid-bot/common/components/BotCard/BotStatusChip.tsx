import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { QueryStatus } from "@reduxjs/toolkit/query";
import { useSnackbar } from "notistack";
import React, { FC, useEffect } from "react";
import clsx from "clsx";
import { Chip } from "@mui/material";
import { SxProps } from "@mui/system";
import { styled, Theme } from "@mui/material/styles";
import { GridBotDto, useStartGridBotMutation, useStopGridBotMutation } from 'src/lib/bifrost/rtkApi';

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
  bot: GridBotDto;
  sx?: SxProps<Theme>;
};

export const BotStatusChip: FC<BotStatusChipProps> = (props) => {
  const { className, bot, sx } = props;
  const { enqueueSnackbar } = useSnackbar();

  const [
    startBot,
    {
      error: startBotError,
      status: startBotStatus,
      isLoading: isStartBotLoading,
    },
  ] = useStartGridBotMutation();
  const [
    stopBot,
    { error: stopBotError, status: stopBotStatus, isLoading: isStopBotLoading },
  ] = useStopGridBotMutation();
  const handleEnable = () => startBot(bot.id);
  const handleDisable = () => stopBot(bot.id);

  useEffect(() => {
    if (startBotStatus === QueryStatus.fulfilled) {
      enqueueSnackbar("Bot has been enabled", {
        variant: "success",
      });
    } else if (startBotStatus === QueryStatus.rejected) {
      enqueueSnackbar(JSON.stringify(startBotError), {
        variant: "error",
      });
      console.log(startBotError);
    }
  }, [startBotStatus]);

  useEffect(() => {
    if (stopBotStatus === QueryStatus.fulfilled) {
      enqueueSnackbar("Bot has been disabled", {
        variant: "success",
      });
    } else if (stopBotStatus === QueryStatus.rejected) {
      enqueueSnackbar(JSON.stringify(stopBotError), {
        variant: "error",
      });
      console.log(stopBotError);
    }
  }, [stopBotStatus]);

  const isLoading = isStartBotLoading || isStopBotLoading;

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
        onClick={handleDisable}
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
      onClick={handleEnable}
    />
  );
};
