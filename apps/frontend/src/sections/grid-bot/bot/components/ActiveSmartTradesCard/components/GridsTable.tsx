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
import { TActiveSmartTrade, TGridBot } from "src/types/trpc";
import { GridsTableHead } from "./GridsTableHead";
import { GridsTableItem } from "./GridsTableItem";

const componentName = "GridsTable";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type GridsTableProps = {
  className?: string;
  bot: TGridBot;
  activeSmartTrades: TActiveSmartTrade[];
};

export const GridsTable: FC<GridsTableProps> = (props) => {
  const { className, bot, activeSmartTrades } = props;

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small" aria-label="a dense table">
        <GridsTableHead
          baseCurrency={bot.baseCurrency}
          quoteCurrency={bot.quoteCurrency}
        />

        {activeSmartTrades.length > 0 ? (
          <TableBody>
            {activeSmartTrades.map((smartTrade, i) => (
              <GridsTableItem
                smartTrade={smartTrade}
                key={i}
                gridNumber={i + 1}
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
                  No active Smart Trades
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
