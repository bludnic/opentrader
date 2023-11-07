import { ReactNode } from "react";
import { ThemeSwitcher } from "src/ui/navigation/ThemeSwitcher";
import { AppBar } from "src/ui/navigation/AppBar";
import { AppVersionInfo } from "src/ui/navigation/AppVersionInfo";
import { FlexSpacer } from "src/ui/FlexSpacer";
import { LeftNavigation } from "src/ui/navigation/LeftNavigation";
import { Logo } from "src/ui/Logo";
import { Main } from "src/ui/Main";
import { TopNavigation } from "src/ui/navigation/TopNavigation";
import { AppDrawer } from "src/ui/navigation/AppDrawer";

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
