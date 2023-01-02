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
import { BotStatusChip } from "./BotStatusChip";
import { Bull } from "src/components/ui/Bull";
import { FC } from "react";
import { GridBotDto } from "src/lib/bifrost/client";
import { SxProps } from "@mui/system";
import { Theme } from '@mui/material';
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
  bot: GridBotDto;
}

export const BotCard: FC<BotCardProps> = (props) => {
  const { bot, className, sx } = props;

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
          >
            <Typography className={classes.botTitle} variant="h5">
              {bot.name}
            </Typography>
          </Link>

          <BotStatusChip enabled={bot.enabled} sx={{ ml: 2 }} />
        </Box>

        <Typography color="text.secondary">
          {bot.baseCurrency}/{bot.quoteCurrency} <Bull />{" "}
          <Tooltip title="Investment">
            <span>
              {bot.quantityPerGrid * bot.gridLevels} {bot.baseCurrency}
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
                secondary={`${bot.highPrice} ${bot.quoteCurrency}`}
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
                secondary={`${bot.lowPrice} ${bot.quoteCurrency}`}
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
                primary="Quantity per grid"
                secondary={`${bot.quantityPerGrid} ${bot.baseCurrency}`}
              />
            </ListItem>

            <ListItem disablePadding>
              <Tooltip title="Grid levels">
                <ListItemIcon sx={{ color: "inherit" }}>
                  <FormatListNumberedRtlIcon fontSize="medium" />
                </ListItemIcon>
              </Tooltip>

              <ListItemText
                primary="Grid levels"
                secondary={`${bot.gridLevels}`}
              />
            </ListItem>
          </List>
        </Box>
      </CardContent>
    </Root>
  );
};
