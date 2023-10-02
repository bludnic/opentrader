import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { TSmartTrade } from "src/types/trpc/smart-trade";
import { BacktestingTableHead } from "./BacktestingTableHead";
import { BacktestingTableItem } from "./BacktestingTableItem";

const componentName = "BacktestingTable";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type BacktestingTableProps = {
  className?: string;
  smartTrades: TSmartTrade[];
  baseCurrency: string;
  quoteCurrency: string;
};

export const BacktestingTable: FC<BacktestingTableProps> = (props) => {
  const { className, smartTrades, baseCurrency, quoteCurrency } = props;

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small">
        <BacktestingTableHead
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
        />

        {smartTrades.length > 0 ? (
          <TableBody>
            {smartTrades.map((smartTrade, i) => (
              <BacktestingTableItem
                smartTrade={smartTrade}
                key={i}
              />
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" colSpan={6}>
                <Typography
                  textAlign="center"
                  sx={{
                    pt: 2,
                    pb: 2,
                  }}
                >
                  Backtesting in progress...
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
