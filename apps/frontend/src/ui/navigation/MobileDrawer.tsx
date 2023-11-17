import { FC, ReactNode } from "react";
import Drawer from "@mui/joy/Drawer";
import Button from "@mui/joy/Button";

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
      open={open}
      onClose={onClose}
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
