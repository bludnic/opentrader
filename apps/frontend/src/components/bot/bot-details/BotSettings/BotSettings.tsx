import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import type { FC } from "react";
import DataObjectIcon from "@mui/icons-material/DataObject";
import type { TBot } from "src/types/trpc";
import { StatusSettingsListItem } from "src/components/common/bot/settings/StatusSettingListItem";
import { PairSettingListItem } from "src/components/common/bot/settings/PairSettingListItem";
import { SettingListItem } from "src/components/common/bot/settings/SettingListItem";

type BotSettingsProps = {
  bot: TBot;
};

export const BotSettings: FC<BotSettingsProps> = ({ bot }) => {
  return (
    <List>
      <StatusSettingsListItem bot={bot} />

      <ListDivider inset="startContent" />

      <PairSettingListItem bot={bot} />

      <ListDivider inset="startContent" />

      <SettingListItem icon={<DataObjectIcon />} name="Template">
        <Chip color="primary" variant="soft">
          {bot.template}
        </Chip>
      </SettingListItem>
    </List>
  );
};
