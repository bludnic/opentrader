import { FC, ReactNode, useState } from "react";
import {
  Box,
  CssBaseline,
  Divider,
  IconButton,
  List,
  Toolbar,
  Typography,
} from "@mui/material";

import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import PendingIcon from "@mui/icons-material/Pending";

import { AppBar } from "./AppBar";
import { Drawer } from "./Drawer";
import { DrawerHeader } from "./DrawerHeader";
import { DrawerListItem } from "./DrawerListItem";
import { NavigationContainer } from "./NavigationContainer";

interface Back {
  href: string;
  asHref?: string;
}

export interface NavigationProps {
  children: ReactNode;
  back?: Back;
  title?: string;
  action?: ReactNode;
}

export const Navigation: FC<NavigationProps> = (props) => {
  const { children, back, title, action } = props;

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>

          {back || title || action ? (
            <Box display="flex" alignItems="center">
              {back ? (
                <Link href={back.href} as={back.asHref} passHref>
                  <IconButton component="a">
                    <ArrowBackIcon />
                  </IconButton>
                </Link>
              ) : null}

              {title ? (
                <Typography
                  variant="h5"
                  sx={{ ml: back ? 2 : 0 }}
                  component="a"
                >
                  {title}
                </Typography>
              ) : null}

              {action ? (
                <Box sx={{ ml: back || title ? 2 : 0 }}>{action}</Box>
              ) : null}
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          <DrawerListItem
            drawerOpen={open}
            text="Grid Bot"
            href="/grid-bot"
            icon={<FormatListNumberedRtlIcon />}
          />
        </List>

        <Divider />

        <List>
          <DrawerListItem
            drawerOpen={open}
            text="Exchange Accounts"
            href="/exchange-accounts"
            icon={<AccountBalanceIcon />}
          />
        </List>
      </Drawer>

      <NavigationContainer component="main" sx={{ flexGrow: 1, p: 0 }}>
        <DrawerHeader />

        {children}
      </NavigationContainer>
    </Box>
  );
};
