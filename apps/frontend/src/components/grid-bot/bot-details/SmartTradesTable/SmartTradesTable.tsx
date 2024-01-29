"use client";

import Sheet from "@mui/joy/Sheet";
import Table from "@mui/joy/Table";
import type { FC } from "react";
import { tClient } from "src/lib/trpc/client";
import { SmartTradesTableHead } from "./SmartTradesTableHead";
import { SmartTradesTableItem } from "./SmartTradesTableItem";
import { NoActiveSmartTradesPlaceholder } from "./NoActiveSmartTradesPlaceholder";

type SmartTradesTableProps = {
  botId: number;
};

export const SmartTradesTable: FC<SmartTradesTableProps> = ({ botId }) => {
  const [smartTrades] = tClient.bot.activeSmartTrades.useSuspenseQuery({
    botId,
  });

  return (
    <Sheet
      sx={{ width: "100%", boxShadow: "sm", borderRadius: "sm" }}
      variant="outlined"
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
                key={smartTrade.id}
                smartTrade={smartTrade}
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
