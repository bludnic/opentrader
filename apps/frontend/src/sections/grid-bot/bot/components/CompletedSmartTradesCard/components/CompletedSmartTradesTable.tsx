import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { GridBotDto, SmartTradeWithProfitDto } from 'src/lib/bifrost/client';
import { CompletedSmartTradeItem } from "./CompletedSmartTradeItem";
import { CompletedSmartTradesTableHead } from "./CompletedSmartTradesTableHead";

const componentName = "CompletedSmartTradesTable";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedSmartTradesTableProps = {
  className?: string;
  bot: GridBotDto;
  smartTrades: SmartTradeWithProfitDto[];
};

export const CompletedSmartTradesTable: FC<CompletedSmartTradesTableProps> = (
  props
) => {
  const { className, bot, smartTrades } = props;

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small" aria-label="a dense table">
        <CompletedSmartTradesTableHead />

        {smartTrades.length > 0 ? (
          <TableBody>
            {smartTrades.map((smartTrade, i) => (
              <CompletedSmartTradeItem
                smartTrade={smartTrade}
                bot={bot}
                key={smartTrade.id}
              />
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" colSpan={5}>
                <Typography
                  textAlign="center"
                  sx={{
                    pt: 2,
                    pb: 2,
                  }}
                >
                  No completed Smart Trades yet
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
