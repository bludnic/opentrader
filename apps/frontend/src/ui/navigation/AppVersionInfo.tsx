"use client";

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import { AppVersion } from "src/ui/navigation/AppVersion";
import { GITHUB_REPOSITORY_URL } from "src/ui/constants";
import { GithubIcon } from "src/ui/icons/GithubIcon";
import { FC } from "react";
import { LeftNavigationItem } from "./LeftNavigationItem";

type AppVersionInfoProps = {
  size: "sm" | "md";
};

export const AppVersionInfo: FC<AppVersionInfoProps> = ({ size }) => {
  return (
    <List
      sx={{
        flexGrow: "unset",
      }}
      size="lg"
    >
      <ListDivider />

      <LeftNavigationItem
        size={size}
        icon={<GithubIcon />}
        href={GITHUB_REPOSITORY_URL}
        append={<AppVersion />}
        target="_blank"
      >
        opentrader
      </LeftNavigationItem>
    </List>
  );
};
