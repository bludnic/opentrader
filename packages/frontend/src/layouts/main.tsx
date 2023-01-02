import Container, { ContainerProps } from "@mui/material/Container";
import { FC, ReactNode } from "react";
import { Drawer, DrawerProps } from "src/components/ui/Drawer";

export interface MainLayoutProps {
  className?: string;
  children: ReactNode;
  ContainerProps?: Pick<ContainerProps, "sx" | "maxWidth">;
  DrawerProps?: Partial<DrawerProps>;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
  const { children, ContainerProps, DrawerProps } = props;

  return (
    <Drawer {...DrawerProps}>
      <Container disableGutters {...ContainerProps}>
        {children}
      </Container>
    </Drawer>
  );
};
