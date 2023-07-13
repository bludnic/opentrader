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
import { CompletedDealWithProfitDto, GridBotDto } from "src/lib/bifrost/client";
import { CompletedDealTableItem } from "src/sections/grid-bot/pages/bot/components/CompletedDealsCard/components/CompletedDealTableItem";
import { CompletedDealsTableHead } from "./CompletedDealsTableHead";

const componentName = "CompletedDealsTable";
const classes = {
  root: `${componentName}-root`,
};
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  /* Styles applied to the root element. */
  [`&.${classes.root}`]: {},
}));

type CompletedDealsTableProps = {
  className?: string;
  bot: GridBotDto;
  deals: CompletedDealWithProfitDto[];
};

export const CompletedDealsTable: FC<CompletedDealsTableProps> = (props) => {
  const { className, bot, deals } = props;

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small" aria-label="a dense table">
        <CompletedDealsTableHead />

        {deals.length > 0 ? (
          <TableBody>
            {deals.map((deal, i) => (
              <CompletedDealTableItem deal={deal} bot={bot} key={deal.id} />
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
                  No completed deals yet
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
