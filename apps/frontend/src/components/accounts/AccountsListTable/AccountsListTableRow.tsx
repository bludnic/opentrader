import Typography from "@mui/joy/Typography";
import type { FC } from "react";
import React from "react";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import type { TExchangeAccount } from "src/types/trpc";
import { ExchangeIcon } from "src/ui/icons/ExchangeIcon";
import { formatDateTime } from "src/utils/date/formatDateTime";

type AccountsListTableRowProps = {
  account: TExchangeAccount;
  selected: boolean;
  onClick: (
    e: React.MouseEvent<HTMLTableCellElement>,
    accountId: number,
  ) => void;
};

export const AccountsListTableRow: FC<AccountsListTableRowProps> = (props) => {
  const { account, selected, onClick } = props;

  return (
    <tr>
      <td
        onClick={(e) => {
          onClick(e, account.id);
        }}
      >
        <Checkbox
          checked={selected}
          color="primary"
          sx={{ verticalAlign: "sub" }}
        />
      </td>

      <td>{account.id}</td>

      <td>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <ExchangeIcon
            exchangeCode={account.exchangeCode}
            height={24}
            width={24}
          />

          <Typography
            sx={{
              ml: 1,
            }}
          >
            {account.name}
          </Typography>

          <Tooltip
            color="neutral"
            title={
              account.credentials.isDemoAccount
                ? "Demo trading account"
                : "Real trading account"
            }
            variant="outlined"
          >
            <Chip
              color={account.credentials.isDemoAccount ? "neutral" : "primary"}
              sx={{
                ml: 1,
              }}
              variant={account.credentials.isDemoAccount ? "outlined" : "solid"}
            >
              {account.credentials.isDemoAccount ? "Demo" : "Real"}
            </Chip>
          </Tooltip>
        </Box>
      </td>

      <td>
        <pre>{JSON.stringify(account.credentials, null, 2)}</pre>
      </td>

      <td>{formatDateTime(account.createdAt.getTime())}</td>
    </tr>
  );
};
