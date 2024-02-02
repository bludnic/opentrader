import DataObjectIcon from "@mui/icons-material/DataObject";
import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import type { FC } from "react";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import NumbersIcon from "@mui/icons-material/Numbers";
import type { TGridBot } from "src/types/trpc";
import { calcAverageQuantityPerGrid } from "src/utils/grid-bot/calcAverageQuantityPerGrid";
import { findHighestGridLinePrice } from "src/utils/grid-bot/findHighestGridLinePrice";
import { findLowestGridLinePrice } from "src/utils/grid-bot/findLowestGridLinePrice";
import { StatusSettingsListItem } from "src/components/common/bot/settings/StatusSettingListItem";
import { PairSettingListItem } from "src/components/common/bot/settings/PairSettingListItem";
import { SettingListItem } from "src/components/common/bot/settings/SettingListItem";

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

      <SettingListItem icon={<ArrowUpwardIcon />} name="High price">
        {highPrice} {bot.quoteCurrency}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem icon={<ArrowDownwardIcon />} name="Low price">
        {lowPrice} {bot.quoteCurrency}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem icon={<NumbersIcon />} name="Av. quantity per grid">
        {averageQuantityPerGrid.toFixed(6)} {bot.baseCurrency}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem icon={<FormatListNumberedRtlIcon />} name="Grid levels">
        {bot.settings.gridLines.length}
      </SettingListItem>

      <ListDivider inset="startContent" />

      <SettingListItem icon={<DataObjectIcon />} name="Template">
        <Chip color="primary" variant="soft">
          {bot.template}
        </Chip>
      </SettingListItem>
    </List>
  );
};
