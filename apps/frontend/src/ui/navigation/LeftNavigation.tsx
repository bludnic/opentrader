"use client";

import { FC } from "react";
import List from "@mui/joy/List";
import Chip from "@mui/joy/Chip";
import { LeftNavigationItem } from "./LeftNavigationItem";

type LeftNavigationProps = {
  size: "sm" | "md";
};

export const LeftNavigation: FC<LeftNavigationProps> = ({ size }) => {
  return (
    <List size="lg">
      <LeftNavigationItem icon={"🏛️"} href="/dashboard/accounts" size={size}>
        My exchanges
      </LeftNavigationItem>

      <LeftNavigationItem
        icon={"🤖"}
        href="/dashboard/grid-bot"
        size={size}
        append={
          <Chip color="success" variant="outlined" size="sm">
            New
          </Chip>
        }
      >
        Bots
      </LeftNavigationItem>
    </List>
  );
};
