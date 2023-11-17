import { FC } from "react";
import IconButton from "@mui/joy/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";

type DrawerTogglerProps = {
  open: boolean;
  onClick: () => void;
};

export const DrawerToggler: FC<DrawerTogglerProps> = ({ open, onClick }) => {
  return (
    <IconButton onClick={onClick}>
      {open ? <ChevronLeftIcon /> : <MenuIcon />}
    </IconButton>
  );
};
