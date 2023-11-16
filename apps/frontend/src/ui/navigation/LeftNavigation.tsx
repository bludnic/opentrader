"use client";

import Chip from "@mui/joy/Chip";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import NextLink from "next/link";

export function LeftNavigation() {
  return (
    <List size="lg">
      <ListItem>
        <ListItemButton component={NextLink} href="/dashboard/accounts">
          <ListItemDecorator>🏛️</ListItemDecorator>
          <ListItemContent>My exchanges</ListItemContent>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton component={NextLink} href="/dashboard/grid-bot">
          <ListItemDecorator>🤖</ListItemDecorator>
          <ListItemContent>Bots</ListItemContent>
          <Chip color="success" variant="outlined" size="sm">
            New
          </Chip>
        </ListItemButton>
      </ListItem>
    </List>
  );
}
