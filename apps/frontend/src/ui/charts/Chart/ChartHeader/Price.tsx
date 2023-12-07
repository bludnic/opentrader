"use client";

import Box from "@mui/joy/Box";
import type { FC } from "react";
import { calcWidthFromPrice } from "./utils";
import { fontSize } from "./constants";
import { ColorNumber } from "./ColorNumber";

type Props = {
  prefix: "O" | "H" | "L" | "C";
  price: number;
  color: "success" | "danger";
};

export const Price: FC<Props> = ({ prefix, price, color }) => {
  return (
    <Box
      sx={{
        lineHeight: 1,
        fontSize,
        width: calcWidthFromPrice(price),
      }}
    >
      {prefix}:<ColorNumber color={color}>{price.toFixed(2)}</ColorNumber>
    </Box>
  );
};
