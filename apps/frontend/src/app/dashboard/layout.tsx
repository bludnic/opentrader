"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { ThemeSwitcher } from "src/ui/navigation/ThemeSwitcher";
import { AppBar } from "src/ui/navigation/AppBar";
import { AppVersionInfo } from "src/ui/navigation/AppVersionInfo";
import { FlexSpacer } from "src/ui/FlexSpacer";
import { LeftNavigation } from "src/ui/navigation/LeftNavigation";
import { Logo } from "src/ui/Logo";
import { Main } from "src/ui/Main";
import { TopNavigation } from "src/ui/navigation/TopNavigation";
import { AppDrawer } from "src/ui/navigation/AppDrawer";
import { MobileDrawer } from "src/ui/navigation/MobileDrawer";
import { DrawerToggler } from "src/ui/navigation/DrawerToggler";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const size = drawerOpen ? "md" : "sm";

  return (
    <div>
      <AppBar>
        <DrawerToggler
          onClick={() => {
            setDrawerOpen(!drawerOpen);
          }}
          open={drawerOpen}
        />
        <Logo />
        <TopNavigation />
        <FlexSpacer />
        <ThemeSwitcher />
      </AppBar>

      <AppDrawer open={drawerOpen}>
        <LeftNavigation size={size} />

        <FlexSpacer />

        <AppVersionInfo size={size} />
      </AppDrawer>

      <MobileDrawer
        onClose={() => {
          setDrawerOpen(false);
        }}
        open={drawerOpen}
      >
        <LeftNavigation size="md" />

        <FlexSpacer />

        <AppVersionInfo size="md" />
      </MobileDrawer>

      <Main size={size}>{children}</Main>
    </div>
  );
}
