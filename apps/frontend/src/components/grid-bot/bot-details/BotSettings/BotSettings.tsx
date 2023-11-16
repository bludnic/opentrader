import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import { FC } from "react";
import { PairSettingListItem } from "./PairSettingListItem";
import { StatusSettingsListItem } from "./StatusSettingListItem";
import { TGridBot } from "src/types/trpc";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import NumbersIcon from "@mui/icons-material/Numbers";
import { calcAverageQuantityPerGrid } from "src/utils/grid-bot/calcAverageQuantityPerGrid";

import { findHighestGridLinePrice } from "src/utils/grid-bot/findHighestGridLinePrice";
import { findLowestGridLinePrice } from "src/utils/grid-bot/findLowestGridLinePrice";
import { SettingListItem } from "./SettingListItem";

type BotSettingsProps = {
  bot: TGridBot;
};

export const BotSettings: FC<BotSettingsProps> = ({ bot }) => {
  const lowPrice = findLowestGridLinePrice(bot.settings.gridLines);
  const highPrice = findHighestGridLinePrice(bot.settings.gridLines);
  const averageQuantityPerGrid = calcAverageQuantityPerGrid(
    bot.settings.gridLines,
  );

  return (
    <List>
      <StatusSettingsListItem bot={bot} />

      <ListDivider inset="startContent" />

      <PairSettingListItem bot={bot} />

      <ListDivider inset="startContent" />

      <SettingListItem name="High price" icon={<ArrowUpwardIcon />}>
        {highPrice} {bot.quoteCurrency}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem name="Low price" icon={<ArrowDownwardIcon />}>
        {lowPrice} {bot.quoteCurrency}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem name="Av. quantity per grid" icon={<NumbersIcon />}>
        {averageQuantityPerGrid.toFixed(6)} {bot.baseCurrency}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem name="Grid levels" icon={<FormatListNumberedRtlIcon />}>
        {bot.settings.gridLines.length}
      </SettingListItem>
    </List>
  );
};
