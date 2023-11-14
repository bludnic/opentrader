"use client";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import NumbersIcon from "@mui/icons-material/Numbers";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Divider from "@mui/joy/Divider";
import Link from "next/link";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Tooltip from "@mui/joy/Tooltip";
import Typography from "@mui/joy/Typography";
import clsx from "clsx";
import { TGridBot } from "src/types/trpc";
import { calcAverageQuantityPerGrid } from "src/utils/grid-bot/calcAverageQuantityPerGrid";
import { findHighestGridLinePrice } from "src/utils/grid-bot/findHighestGridLinePrice";
import { findLowestGridLinePrice } from "src/utils/grid-bot/findLowestGridLinePrice";
import { BotStatusIndicator } from "./BotStatusIndicator";
import { Bull } from "./Bull";
import { FC } from "react";
import { styled } from "@mui/joy/styles";
import { SxProps } from "@mui/joy/styles/types";

const componentName = "BotCard";
const classes = {
  root: `${componentName}-root`,
  botTitle: `${componentName}-bot-title`,
};

const Root = styled(Card)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
  [`& .${classes.botTitle}`]: {
    color: "inherit",
    textDecoration: "none",

    "&:hover": {
      cursor: "pointer",
      textDecoration: "underline",
    },
  },
}));

export interface BotCardProps {
  className?: string;
  bot: TGridBot;
  sx?: SxProps;
}

export const BotCard: FC<BotCardProps> = (props) => {
  const { bot, sx, className } = props;

  // @todo
  // const initialInvestmentInQuote = calcInitialInvestmentInQuote(
  //   bot.initialInvestment
  // );
  const initialInvestmentInQuote = "hz"; // @todo
  const averageQuantityPerGrid = calcAverageQuantityPerGrid(
    bot.settings.gridLines,
  );
  const gridLevels = bot.settings.gridLines.length;

  const lowPrice = findLowestGridLinePrice(bot.settings.gridLines);
  const highPrice = findHighestGridLinePrice(bot.settings.gridLines);

  return (
    <Root className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Box display="flex">
          <Link
            href={`/dashboard/grid-bot/${bot.id}`}
            className={classes.botTitle}
          >
            <Typography level="h3" fontWeight="400">
              {bot.name}
            </Typography>
          </Link>

          <BotStatusIndicator bot={bot} sx={{ ml: 2 }} />
        </Box>

        <Typography>
          {bot.baseCurrency}/{bot.quoteCurrency} <Bull />{" "}
          <Tooltip title="Investment">
            <span>
              {initialInvestmentInQuote} {bot.quoteCurrency}
            </span>
          </Tooltip>
        </Typography>
      </CardContent>

      <Divider />

      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <List sx={{ "--ListItemDecorator-size": "32px" }}>
            <ListItem>
              <ListItemDecorator sx={{ color: "inherit" }}>
                <ArrowUpwardIcon fontSize="large" />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">High price</Typography>
                <Typography level="body-sm" noWrap>
                  {`${highPrice} ${bot.quoteCurrency}`}
                </Typography>
              </ListItemContent>
            </ListItem>

            <ListItem
              sx={{
                mt: 1,
              }}
            >
              <ListItemDecorator sx={{ color: "inherit" }}>
                <ArrowDownwardIcon fontSize="large" />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">Low price</Typography>
                <Typography level="body-sm" noWrap>
                  {`${lowPrice} ${bot.quoteCurrency}`}
                </Typography>
              </ListItemContent>
            </ListItem>
          </List>

          <List sx={{ "--ListItemDecorator-size": "32px" }}>
            <ListItem>
              <ListItemDecorator sx={{ color: "inherit" }}>
                <NumbersIcon fontSize="large" />
              </ListItemDecorator>
              <ListItemContent>
                <Typography level="title-sm">Avg. Quantity per grid</Typography>
                <Typography level="body-sm" noWrap>
                  {`${averageQuantityPerGrid} ${bot.baseCurrency}`}
                </Typography>
              </ListItemContent>
            </ListItem>

            <ListItem
              sx={{
                mt: 1,
              }}
            >
              <ListItemDecorator sx={{ color: "inherit" }}>
                <FormatListNumberedRtlIcon fontSize="large" />
              </ListItemDecorator>

              <ListItemContent>
                <Typography level="title-sm">Grid levels</Typography>
                <Typography level="body-sm" noWrap>
                  {gridLevels}
                </Typography>
              </ListItemContent>
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Root>
  );
};
