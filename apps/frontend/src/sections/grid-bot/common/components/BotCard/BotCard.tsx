import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import NumbersIcon from "@mui/icons-material/Numbers";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { TGridBot } from "src/sections/grid-bot/common/trpc-types";
import { calcAverageQuantityPerGrid } from "src/utils/grid-bot/calcAverageQuantityPerGrid";
import { findHighestGridLinePrice } from "src/utils/grid-bot/findHighestGridLinePrice";
import { findLowestGridLinePrice } from "src/utils/grid-bot/findLowestGridLinePrice";
import { BotStatusChip } from "./BotStatusChip";
import { Bull } from "src/components/ui/Bull";
import { FC } from "react";
import { SxProps, Theme } from "@mui/material";
import { styled } from "@mui/material/styles";

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
  sx?: SxProps<Theme>;
  bot: TGridBot;
}

export const BotCard: FC<BotCardProps> = (props) => {
  const { bot, className, sx } = props;

  // @todo
  // const initialInvestmentInQuote = calcInitialInvestmentInQuote(
  //   bot.initialInvestment
  // );
  const initialInvestmentInQuote = 'hz' // @todo
  const averageQuantityPerGrid = calcAverageQuantityPerGrid(
    bot.settings.gridLines,
  );
  const gridLevels = bot.settings.gridLines.length;

  const lowPrice = findLowestGridLinePrice(bot.settings.gridLines);
  const highPrice = findHighestGridLinePrice(bot.settings.gridLines);

  return (
    <Root className={clsx(classes.root, className)} sx={sx}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {bot.id}
        </Typography>

        <Box display="flex">
          <Link
            href={{
              pathname: "/grid-bot/[id]",
              query: {
                id: bot.id,
              },
            }}
            as={`/grid-bot/${bot.id}`}
            passHref
            className={classes.botTitle}
          >
            <Typography variant="h5">
              {bot.name}
            </Typography>
          </Link>

          <BotStatusChip bot={bot} sx={{ ml: 2 }} />
        </Box>

        <Typography color="text.secondary">
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
          <List disablePadding dense>
            <ListItem disablePadding>
              <Tooltip title="High price">
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowUpwardIcon fontSize="medium" />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary={"High price"}
                secondary={`${highPrice} ${bot.quoteCurrency}`}
              />
            </ListItem>

            <ListItem disablePadding>
              <Tooltip title="Low price">
                <ListItemIcon sx={{ color: "inherit" }}>
                  <ArrowDownwardIcon fontSize="medium" />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary={"Low price"}
                secondary={`${lowPrice} ${bot.quoteCurrency}`}
              />
            </ListItem>
          </List>

          <List disablePadding dense>
            <ListItem disablePadding>
              <Tooltip title="Quantity per grid">
                <ListItemIcon sx={{ color: "inherit" }}>
                  <NumbersIcon fontSize="medium" />
                </ListItemIcon>
              </Tooltip>
              <ListItemText
                primary="Avg. Quantity per grid"
                secondary={`${averageQuantityPerGrid} ${bot.baseCurrency}`}
              />
            </ListItem>

            <ListItem disablePadding>
              <Tooltip title="Grid levels">
                <ListItemIcon sx={{ color: "inherit" }}>
                  <FormatListNumberedRtlIcon fontSize="medium" />
                </ListItemIcon>
              </Tooltip>

              <ListItemText primary="Grid levels" secondary={gridLevels} />
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Root>
  );
};
