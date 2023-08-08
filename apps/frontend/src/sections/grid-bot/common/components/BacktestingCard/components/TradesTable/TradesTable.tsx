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
import { TradesTableHead } from "./TradesTableHead";
import { TradesTableItem } from "./TradesTableItem";
import { SmartTradeDto, BacktestingTradeDto } from "src/lib/bifrost/rtkApi";

const componentName = "TradesTable";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type TradesTableProps = {
  className?: string;
  trades: BacktestingTradeDto[];
  baseCurrency: string;
  quoteCurrency: string;
};

export const TradesTable: FC<TradesTableProps> = (props) => {
  const { className, trades, baseCurrency, quoteCurrency } = props;

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small">
        <TradesTableHead
          baseCurrency={baseCurrency}
          quoteCurrency={quoteCurrency}
        />

        {trades.length > 0 ? (
          <TableBody>
            {trades.map((trade, i) => (
              <TradesTableItem trade={trade} key={i} />
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
