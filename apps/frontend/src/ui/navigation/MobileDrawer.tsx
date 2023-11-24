import type { FC, ReactNode } from "react";
import Drawer from "@mui/joy/Drawer";

type MobileDrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export const MobileDrawer: FC<MobileDrawerProps> = ({
  open,
  onClose,
  children,
}) => {
  return (
    <Drawer
      onClose={onClose}
      open={open}
      size="sm"
      sx={(theme) => ({
        [theme.breakpoints.up("sm")]: {
          display: "none",
        },
      })}
    >
      {children}
    </Drawer>
  );
};
