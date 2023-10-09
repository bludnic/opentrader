"use client";

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { AppVersion } from "src/components/joy/ui/AppVersion";
import { GITHUB_REPOSITORY_URL } from "src/components/joy/ui/constants";
import { GithubIcon } from "src/components/joy/ui/icons/Github";

export function AppVersionInfo() {
  return (
    <List
      sx={{
        flexGrow: "unset",
      }}
      size="md"
    >
      <ListDivider />

      <ListItem>
        <ListItemButton
          href={GITHUB_REPOSITORY_URL}
          component="a"
          target="_blank"
        >
          <ListItemDecorator>
            <GithubIcon />
          </ListItemDecorator>
          <ListItemContent>opentrader</ListItemContent>

          <AppVersion />
        </ListItemButton>
      </ListItem>
    </List>
  );
}
