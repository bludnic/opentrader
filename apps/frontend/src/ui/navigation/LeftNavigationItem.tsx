"use client";

import type { ReactNode, FC } from "react";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import NextLink from "next/link";

type LeftNavigationItemProps = {
  size: "sm" | "md";
  icon: ReactNode;
  href: string;
  target?: React.HTMLAttributeAnchorTarget;
  children: ReactNode;
  append?: ReactNode;
};

export const LeftNavigationItem: FC<LeftNavigationItemProps> = ({
  icon,
  size,
  href,
  target,
  children,
  append,
}) => {
  return (
    <ListItemButton component={NextLink} href={href} target={target}>
      <ListItemDecorator
        sx={{
          ...(size === "sm" && {
            minInlineSize: 0,
          }),
        }}
      >
        {icon}
      </ListItemDecorator>
      {size === "md" ? <ListItemContent>{children}</ListItemContent> : null}
      {append && size === "md" ? append : null}
    </ListItemButton>
  );
};
