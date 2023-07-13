import { Card, CardContent, Divider, Typography } from "@mui/material";
import { styled, Theme } from "@mui/material/styles";
import { SxProps } from "@mui/system";
import React, { FC } from "react";
import clsx from "clsx";
import { CompletedDealWithProfitDto, GridBotDto } from "src/lib/bifrost/client";
import { CompletedDealsTable } from "./components/CompletedDealsTable";

const componentName = "CompletedDealsCard";
const classes = {
  root: `${componentName}-root`,
};
const StyledCard = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedDealsCardProps = {
  className?: string;
  sx?: SxProps<Theme>;
  bot: GridBotDto;
  deals: CompletedDealWithProfitDto[];
};

export const CompletedDealsCard: FC<CompletedDealsCardProps> = (props) => {
  const { className, bot, deals, sx } = props;

  return (
    <StyledCard className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography variant="h6">Completed Deals</Typography>
      </CardContent>

      <Divider />

      <CompletedDealsTable bot={bot} deals={deals} />
    </StyledCard>
  );
};
