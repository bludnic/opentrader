import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import CircleIcon from "@mui/icons-material/Circle";
import { FC } from "react";
import { BotStatusSwitcher } from "src/components/grid-bot/bot-details/BotStatusSwitcher";
import { TGridBot } from "src/types/trpc";

type StatusSettingsListItemProps = {
  bot: TGridBot;
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
