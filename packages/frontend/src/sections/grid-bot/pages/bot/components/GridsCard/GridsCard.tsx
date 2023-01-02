import { Card, CardContent, Divider, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import React, { FC } from "react";
import clsx from "clsx";
import { GridBotDto } from "src/lib/bifrost/client";
import { GridsTable } from "./components/GridsTable";

const componentName = "GridsCard";
const classes = {
  root: `${componentName}-root`,
};
const CardRoot = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type GridsCardProps = {
  className?: string;
  sx?: SxProps<Theme>;
  bot: GridBotDto;
};

export const GridsCard: FC<GridsCardProps> = (props) => {
  const { className, bot, sx } = props;

  return (
    <CardRoot className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography variant="h6">Grids</Typography>
      </CardContent>

      <Divider />

      <GridsTable bot={bot} />
    </CardRoot>
  );
};
