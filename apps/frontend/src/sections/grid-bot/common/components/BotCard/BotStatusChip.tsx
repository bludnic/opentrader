import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import React, { FC } from "react";
import clsx from "clsx";
import { Chip } from "@mui/material";
import { SxProps } from "@mui/system";
import { styled, Theme } from "@mui/material/styles";

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
  /**
   * Bot status.
   */
  enabled: boolean;
  sx?: SxProps<Theme>;
};

export const BotStatusChip: FC<BotStatusChipProps> = (props) => {
  const { className, enabled, sx } = props;

  if (enabled) {
    return (
      <StyledChip
        className={clsx(classes.root, className)}
        label="Running"
        icon={<FiberManualRecordIcon />}
        variant="outlined"
        color="success"
        sx={sx}
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
    />
  );
};
