import { styled } from "@mui/material/styles";
import React, { FC } from "react";
import clsx from "clsx";
import { GridBotDto } from "src/lib/bifrost/client";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
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
  bot: GridBotDto;
};

export const GridsTable: FC<GridsTableProps> = (props) => {
  const { className, bot } = props;

  const deals = [...bot.deals].reverse(); // Sell orders to the top, Buy orders to the bottom

  return (
    <StyledTableContainer className={clsx(classes.root, className)}>
      <Table size="small" aria-label="a dense table">
        <GridsTableHead />

        {deals.length > 0 ? (
          <TableBody>
            {deals.map((deal, i) => (
              <GridsTableItem deal={deal} key={deal.id} gridNumber={i + 1} />
            ))}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" colSpan={4}>
                <Typography
                  textAlign="center"
                  sx={{
                    pt: 2,
                    pb: 2,
                  }}
                >
                  No deals
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </StyledTableContainer>
  );
};
