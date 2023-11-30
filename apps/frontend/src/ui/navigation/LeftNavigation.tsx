"use client";

import type { FC } from "react";
import List from "@mui/joy/List";
import Chip from "@mui/joy/Chip";
import { toPage } from "src/utils/next/toPage";
import { LeftNavigationItem } from "./LeftNavigationItem";

type LeftNavigationProps = {
  size: "sm" | "md";
};

export const LeftNavigation: FC<LeftNavigationProps> = ({ size }) => {
  return (
    <List size="lg">
      <LeftNavigationItem href={toPage("accounts")} icon="🏛️" size={size}>
        My exchanges
      </LeftNavigationItem>

      <LeftNavigationItem
        append={
          <Chip color="success" size="sm" variant="outlined">
            New
          </Chip>
        }
        href={toPage("grid-bot")}
        icon="🤖"
        size={size}
      >
        Bots
      </LeftNavigationItem>
    </List>
  );
};
