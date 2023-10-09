import Typography from "@mui/joy/Typography";
import React, { FC } from "react";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import { TExchangeAccount } from "src/types/trpc";
import { ExchangeIcon } from "src/components/ui/ExchangeIcon";
import Box from "@mui/joy/Box";
import Tooltip from "@mui/joy/Tooltip";
import { formatDateTime } from "src/utils/date/formatDateTime";

type AccountsListTableRowProps = {
  account: TExchangeAccount;
  selected: boolean;
  onClick: (
    e: React.MouseEvent<HTMLTableCellElement, MouseEvent>,
    accountId: number,
  ) => void;
};

export const AccountsListTableRow: FC<AccountsListTableRowProps> = (props) => {
  const { account, selected, onClick } = props;

  return (
    <tr>
      <td onClick={(e) => onClick(e, account.id)} scope="row">
        <Checkbox
          color="primary"
          checked={selected}
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
            width={24}
            height={24}
          />

          <Typography
            sx={{
              ml: 1,
            }}
          >
            {account.name}
          </Typography>

          <Tooltip
            title={
              account.credentials.isDemoAccount
                ? "Demo trading account"
                : "Real trading account"
            }
            variant="outlined"
            color="neutral"
          >
            <Chip
              color={account.credentials.isDemoAccount ? "neutral" : "primary"}
              variant={account.credentials.isDemoAccount ? "outlined" : "solid"}
              sx={{
                ml: 1,
              }}
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
