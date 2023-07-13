import { Box, ListItemText } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { ProfitAndLoss } from "src/sections/grid-bot/common/components/ProfitAndLoss/ProfitAndLoss";

const componentName = "BotProfitStats";
const classes = {
  root: `${componentName}-root`,
};
const Root = styled(Box)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {
    flexGrow: 1,
  },
  [`& .MuiListItemText-root`]: {
    textAlign: "center",
  },
}));

type BotProfitStatsProps = {
  className?: string;
};

export const BotProfitStats: FC<BotProfitStatsProps> = (props) => {
  const { className } = props;

  return (
    <Root
      className={clsx(classes.root, className)}
      display="flex"
      justifyContent="space-between"
    >
      <ListItemText primary="30 days" secondary={<ProfitAndLoss pnl={20} suffix="%" />} />

      <ListItemText primary="7 days" secondary={<ProfitAndLoss pnl={7} suffix="%" />} />

      <ListItemText primary="Today" secondary={<ProfitAndLoss pnl={2.5} suffix="%" />} />
    </Root>
  );
};
