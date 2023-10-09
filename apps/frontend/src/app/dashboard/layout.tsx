import { ReactNode } from "react";
import { ThemeSwitcher } from "src/components/joy/ui/ThemeSwitcher";
import { AppBar } from "src/components/joy/ui/AppBar";
import { AppVersionInfo } from "src/components/joy/ui/AppVersionInfo";
import { FlexSpacer } from "src/components/joy/ui/FlexSpacer";
import { LeftNavigation } from "src/components/joy/ui/LeftNavigation";
import { Logo } from "src/components/joy/ui/Logo";
import { Main } from "src/components/joy/ui/Main";
import { TopNavigation } from "src/components/joy/ui/TopNavigation";
import { AppDrawer } from "src/components/joy/ui/AppDrawer";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div>
      <AppBar>
        <Logo />
        <TopNavigation />

        <FlexSpacer />

        <ThemeSwitcher />
      </AppBar>

      <AppDrawer>
        <LeftNavigation />

        <FlexSpacer />

        <AppVersionInfo />
      </AppDrawer>

      <Main>{children}</Main>
    </div>
  );
}
