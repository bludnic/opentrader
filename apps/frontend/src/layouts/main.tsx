import Container, { ContainerProps } from "@mui/material/Container";
import { FC, ReactNode } from "react";
import { Navigation, NavigationProps } from "src/components/ui/Navigation";

export interface MainLayoutProps {
  className?: string;
  children: ReactNode;
  ContainerProps?: Pick<ContainerProps, "sx" | "maxWidth">;
  NavigationProps?: Partial<NavigationProps>;
}

export const MainLayout: FC<MainLayoutProps> = (props) => {
  const { children, ContainerProps, NavigationProps } = props;

  return (
    <Navigation {...NavigationProps}>
      <Container
        disableGutters
        {...ContainerProps}
        sx={{
          p: 3,
          ...ContainerProps?.sx,
        }}
      >
        {children}
      </Container>
    </Navigation>
  );
};
