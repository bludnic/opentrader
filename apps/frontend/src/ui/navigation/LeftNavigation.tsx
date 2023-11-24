"use client";

import type { FC } from "react";
import List from "@mui/joy/List";
import Chip from "@mui/joy/Chip";
import { LeftNavigationItem } from "./LeftNavigationItem";

type LeftNavigationProps = {
  size: "sm" | "md";
};

export const LeftNavigation: FC<LeftNavigationProps> = ({ size }) => {
  return (
    <List size="lg">
      <LeftNavigationItem href="/dashboard/accounts" icon="🏛️" size={size}>
        My exchanges
      </LeftNavigationItem>

      <LeftNavigationItem
        append={
          <Chip color="success" size="sm" variant="outlined">
            New
          </Chip>
        }
        href="/dashboard/grid-bot"
        icon="🤖"
        size={size}
      >
        Bots
      </LeftNavigationItem>
    </List>
  );
};
