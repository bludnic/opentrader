import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import clsx from "clsx";
import React, { FC } from "react";
import { SmartTradeTableItem } from "./SmartTradeTableItem";
import { SmartTradesTableHead } from "./SmartTradesTableHead";
import { TSmartTrade } from "src/types/trpc/smart-trade";

const componentName = "SmartTradesTable";
const classes = {
  root: `${componentName}-root`,
};

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`& .${classes.root}`]: {},
}));

type SmartTradesTableProps = {
  className?: string;
  trades: TSmartTrade[];
};

export const SmartTradesTable: FC<SmartTradesTableProps> = ({
  trades,
  className,
}) => {
  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="medium" aria-label="a dense table" component={Paper} elevation={5}>
        <SmartTradesTableHead />

        {trades.length > 0 ? (
          <TableBody>
            {trades.map((smartTrade, i) => (
              <SmartTradeTableItem smartTrade={smartTrade} key={i} />
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
                  No Smart Trades
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
