import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import CircleIcon from "@mui/icons-material/Circle";
import type { FC } from "react";
import { BotStatusSwitcher } from "src/components/common/bot/BotStatusSwitcher";
import type { TBot } from "src/types/trpc";

type StatusSettingsListItemProps = {
  bot: TBot;
};

export const StatusSettingsListItem: FC<StatusSettingsListItemProps> = ({
  bot,
}) => {
  return (
    <ListItem>
      <ListItemDecorator>
        <CircleIcon />
      </ListItemDecorator>
      <ListItemContent>Status</ListItemContent>

      <BotStatusSwitcher bot={bot} size="lg" />
    </ListItem>
  );
};
