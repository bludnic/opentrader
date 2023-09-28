import { FC, ReactNode } from "react";
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/router";
import Link from "next/link";

interface DrawerListItemProps {
  /**
   * Is Drawer opened?
   */
  drawerOpen: boolean;
  /**
   * Button text
   */
  text: string;
  /**
   * Button icon
   */
  icon: ReactNode;
  /**
   * Button link
   */
  href: string;
}

export const DrawerListItem: FC<DrawerListItemProps> = ({
  drawerOpen,
  text,
  icon,
  href,
}) => {
  const router = useRouter();

  return (
    <Link href={href}>
      <ListItem key={text} disablePadding sx={{ display: "block" }}>
        <ListItemButton
          selected={href === router.pathname}
          sx={{
            minHeight: 48,
            justifyContent: drawerOpen ? "initial" : "center",
            px: 2.5,
          }}
        >
          <ListItemIcon
            sx={{
              minWidth: 0,
              mr: drawerOpen ? 3 : "auto",
              justifyContent: "center",
            }}
          >
            {icon}
          </ListItemIcon>
          <ListItemText primary={text} sx={{ opacity: drawerOpen ? 1 : 0 }} />
        </ListItemButton>
      </ListItem>
    </Link>
  );
};
