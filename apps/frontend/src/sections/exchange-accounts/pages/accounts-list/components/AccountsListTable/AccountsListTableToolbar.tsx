import AddBoxIcon from "@mui/icons-material/AddBox";
import EditIcon from "@mui/icons-material/Edit";
import React, { FC } from "react";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import clsx from "clsx";
import { alpha, Button } from "@mui/material";
import { FlexSpacer } from "src/components/ui/FlexSpacer";
import { styled } from "@mui/material/styles";

const componentName = "AccountsListTableToolbar";
const classes = {
  root: `${componentName}-root`,
  rootSelected: `${componentName}-root-selected`,
};
const Root = styled(Toolbar)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
  [`&.${classes.rootSelected}`]: {
    backgroundColor: alpha(
      theme.palette.primary.main,
      theme.palette.action.activatedOpacity
    ),
  },
}));

type AccountsListTableToolbarProps = {
  title: string;
  className?: string;
  numSelected: number;
  onCreateAccountClick: () => void;
  onEditAccountClick: () => void;
};

export const AccountsListTableToolbar: FC<AccountsListTableToolbarProps> = (
  props
) => {
  const {
    className,
    numSelected,
    title,
    onCreateAccountClick,
    onEditAccountClick,
  } = props;

  return (
    <Root
      className={clsx(classes.root, className, {
        [classes.rootSelected]: numSelected === 1,
      })}
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <div>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subtitle1" component="div">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="h6" id="tableTitle" component="div">
            {title}
          </Typography>
        )}
      </div>

      <FlexSpacer />

      <div>
        {numSelected > 0 ? (
          <Button
            startIcon={<EditIcon />}
            size="large"
            disabled={numSelected !== 1}
            onClick={onEditAccountClick}
          >
            Edit Exchange
          </Button>
        ) : (
          <Button
            startIcon={<AddBoxIcon />}
            onClick={() => onCreateAccountClick()}
          >
            New Exchange
          </Button>
        )}
      </div>
    </Root>
  );
};
