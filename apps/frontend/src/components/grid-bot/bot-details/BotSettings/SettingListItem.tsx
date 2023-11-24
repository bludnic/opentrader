import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Typography from "@mui/joy/Typography";
import type { FC, ReactNode } from "react";

type SettingListItemProps = {
  icon: ReactNode;
  /**
   * Option name
   */
  name: string;
  /**
   * Option value
   */
  children: ReactNode;
};

export const SettingListItem: FC<SettingListItemProps> = ({
  icon,
  name,
  children,
}) => {
  return (
    <ListItem>
      <ListItemDecorator>{icon}</ListItemDecorator>
      <ListItemContent>{name}</ListItemContent>
      <Typography textColor="text.tertiary">{children}</Typography>
    </ListItem>
  );
};
