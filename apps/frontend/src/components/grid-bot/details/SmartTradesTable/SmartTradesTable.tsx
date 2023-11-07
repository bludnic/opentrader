"use client";

import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import { FC } from "react";
import { TActiveSmartTrade } from "src/types/trpc";
import { SmartTradesTableHead } from "./SmartTradesTableHead";
import { SmartTradesTableItem } from "./SmartTradesTableItem";
import { NoActiveSmartTradesPlaceholder } from "./NoActiveSmartTradesPlaceholder";

type SmartTradesTableProps = {
  smartTrades: TActiveSmartTrade[];
};

export const SmartTradesTable: FC<SmartTradesTableProps> = ({
  smartTrades,
}) => {
  return (
    <Sheet
      variant="outlined"
      sx={{ width: "100%", boxShadow: "sm", borderRadius: "sm" }}
    >
      <Table
        hoverRow
        sx={{
          "--TableCell-headBackground": "transparent",
          "--TableCell-selectedBackground": (theme) =>
            theme.vars.palette.success.softBg,
          "& thead th:nth-child(1)": {
            width: "40px",
          },
          "& thead th:nth-child(2)": {
            width: "30%",
          },
          "& tr > *:nth-child(n+3)": { textAlign: "right" },
        }}
      >
        <SmartTradesTableHead />

        {smartTrades.length > 0 ? (
          <tbody>
            {smartTrades.map((smartTrade) => (
              <SmartTradesTableItem
                smartTrade={smartTrade}
                key={smartTrade.id}
              />
            ))}
          </tbody>
        ) : (
          <NoActiveSmartTradesPlaceholder />
        )}
      </Table>
    </Sheet>
  );
};
