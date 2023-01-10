import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import FormatListNumberedRtlIcon from "@mui/icons-material/FormatListNumberedRtl";
import PendingIcon from '@mui/icons-material/Pending';
import IconButton from "@mui/material/IconButton";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { ArrowBack } from "@mui/icons-material";
import { FC, ReactNode, useState } from "react";
import { Logo } from "src/components/ui/Logo";
import { drawerWidth } from "./constants";
import { useRouter } from "next/router";

interface Back {
  href: string;
  asHref?: string;
}

export interface DrawerProps {
  children: ReactNode;
  back?: Back;
  title?: string;
}

export const Drawer: FC<DrawerProps> = (props) => {
  const { children, back, title } = props;

  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar>
        <Logo />
      </Toolbar>
      <Divider />
      <List>
        <Link href={"/3commas/accounts"}>
          <ListItem
            button
            component="a"
            selected={"/3commas/accounts" === router.pathname}
          >
            <ListItemIcon>
              <PendingIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary={"3Commas Accounts"} />
          </ListItem>
        </Link>

        <Link href={"/exchange-accounts"}>
          <ListItem
            button
            component="a"
            selected={"/exchange-accounts" === router.pathname}
          >
            <ListItemIcon>
              <AccountBalanceIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary={"Exchange Accounts"} />
          </ListItem>
        </Link>

        <Link href={"/grid-bot/"}>
          <ListItem
            button
            component="a"
            selected={"/grid-bot" === router.pathname}
          >
            <ListItemIcon>
              <FormatListNumberedRtlIcon fontSize="medium" />
            </ListItemIcon>
            <ListItemText primary={"Grid Bot"} />
          </ListItem>
        </Link>
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          {back || title ? (
            <Box display="flex" alignItems="center">
              {back ? (
                <Link href={back.href} as={back.asHref} passHref>
                  <IconButton component="a">
                    <ArrowBack />
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
            </Box>
          ) : null}
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </MuiDrawer>
        <MuiDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </MuiDrawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />

        {children}
      </Box>
    </Box>
  );
};
