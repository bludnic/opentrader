import Box from "@mui/joy/Box";
import type { FC } from "react";
import type { Color } from "./types";
import { calculatePriceChange } from "./utils";
import { ColorNumber } from "./ColorNumber";
import { fontSize } from "./constants";

type Props = {
  open: number;
  close: number;
  color: Color;
};

export const PriceChange: FC<Props> = ({ open, close, color }) => {
  const unitsDelta = close - open;
  const unitsDeltaString = Math.abs(unitsDelta).toFixed(2);

  const sign = unitsDelta > 0 ? "+" : "-";

  const percentDelta = calculatePriceChange(open, close);

  return (
    <Box
      sx={{
        lineHeight: 1,
        fontSize,
      }}
    >
      <ColorNumber color={color}>
        {sign}
        {unitsDeltaString}
        &nbsp;({percentDelta})
      </ColorNumber>
    </Box>
  );
};
