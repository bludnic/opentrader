"use client";

import List from "@mui/joy/List";
import ListDivider from "@mui/joy/ListDivider";
import type { FC } from "react";
import { AppVersion } from "src/ui/navigation/AppVersion";
import { GITHUB_REPOSITORY_URL } from "src/ui/constants";
import { GithubIcon } from "src/ui/icons/GithubIcon";
import { LeftNavigationItem } from "./LeftNavigationItem";

type AppVersionInfoProps = {
  size: "sm" | "md";
};

export const AppVersionInfo: FC<AppVersionInfoProps> = ({ size }) => {
  return (
    <List
      size="lg"
      sx={{
        flexGrow: "unset",
      }}
    >
      <ListDivider />

      <LeftNavigationItem
        append={<AppVersion />}
        href={GITHUB_REPOSITORY_URL}
        icon={<GithubIcon />}
        size={size}
        target="_blank"
      >
        opentrader
      </LeftNavigationItem>
    </List>
  );
};
