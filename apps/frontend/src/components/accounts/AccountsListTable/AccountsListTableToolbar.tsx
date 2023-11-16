import React, { FC } from "react";
import Typography from "@mui/joy/Typography";
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import IconButton from "@mui/joy/IconButton";

type AccountsListTableToolbarProps = {
  title: string;
  numSelected: number;
  onCreateAccountClick: () => void;
  onEditAccountClick: () => void;
};

export const AccountsListTableToolbar: FC<AccountsListTableToolbarProps> = (
  props,
) => {
  const { numSelected, title, onCreateAccountClick, onEditAccountClick } =
    props;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        py: 1,
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: "background.level1",
        }),
        borderTopLeftRadius: "var(--unstable_actionRadius)",
        borderTopRightRadius: "var(--unstable_actionRadius)",
      }}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: "1 1 100%" }} component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          level="body-lg"
          sx={{ flex: "1 1 100%" }}
          component="div"
        >
          {title}
        </Typography>
      )}

      <div>
        {numSelected > 0 ? (
          <Tooltip title="Edit exchange">
            <IconButton
              variant="outlined"
              size="md"
              color="neutral"
              disabled={numSelected !== 1}
              onClick={onEditAccountClick}
            >
              <EditOutlinedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Add new exchange">
            <IconButton
              variant="outlined"
              size="md"
              color="neutral"
              onClick={() => onCreateAccountClick()}
            >
              <AddOutlinedIcon />
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Box>
  );
};
