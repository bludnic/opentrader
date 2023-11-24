import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import type { SxProps } from "@mui/joy/styles/types";
import type { FC } from "react";
import React from "react";
import clsx from "clsx";
import Chip from "@mui/joy/Chip";
import { styled } from "@mui/joy/styles";
import type { TGridBot } from "src/types/trpc";

const componentName = "BotStatusIndicator";
const classes = {
  root: `${componentName}-root`,
};
const StyledChip = styled(Chip)(() => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BotStatusIndicatorProps = {
  className?: string;
  bot: TGridBot;
  sx?: SxProps;
};

export const BotStatusIndicator: FC<BotStatusIndicatorProps> = (props) => {
  const { className, bot, sx } = props;

  if (bot.enabled) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        color="success"
        startDecorator={<FiberManualRecordIcon />}
        sx={sx}
        variant="soft"
      >
        Running
      </StyledChip>
    );
  }

  return (
    <StyledChip
      className={clsx(classes.root, className)}
      color="danger"
      startDecorator={<FiberManualRecordIcon />}
      sx={sx}
      variant="soft"
    >
      Disabled
    </StyledChip>
  );
};
