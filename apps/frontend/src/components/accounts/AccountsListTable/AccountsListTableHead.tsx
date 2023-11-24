import type { FC } from "react";
import React from "react";
import Checkbox from "@mui/joy/Checkbox";

type AccountsListTableHeadProps = {
  numSelected: number;
  rowCount: number;
  onSelectAllClick: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const AccountsListTableHead: FC<AccountsListTableHeadProps> = (
  props,
) => {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <thead>
      <tr>
        <th>
          <Checkbox
            checked={rowCount > 0 && numSelected === rowCount}
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            onChange={onSelectAllClick}
            slotProps={{
              input: {
                "aria-label": "select all accounts",
              },
            }}
            sx={{ verticalAlign: "sub" }}
          />
        </th>

        <th>ID</th>

        <th>Exchange</th>

        <th>Credentials</th>

        <th>Created</th>
      </tr>
    </thead>
  );
};
