import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { SxProps } from "@mui/joy/styles/types";
import React, { FC } from "react";
import clsx from "clsx";
import Chip from "@mui/joy/Chip";
import { styled } from "@mui/joy/styles";
import { TGridBot } from "src/types/trpc";

const componentName = "BotStatusIndicator";
const classes = {
  root: `${componentName}-root`,
};
const StyledChip = styled(Chip)(({ theme }) => ({
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
        startDecorator={<FiberManualRecordIcon />}
        variant="soft"
        color="success"
        sx={sx}
      >
        Running
      </StyledChip>
    );
  }

  return (
    <StyledChip
      className={clsx(classes.root, className)}
      startDecorator={<FiberManualRecordIcon />}
      variant="soft"
      color="danger"
      sx={sx}
    >
      Disabled
    </StyledChip>
  );
};
