import Typography from "@mui/joy/Typography";
import { FC } from "react";

type ProfitProps = {
  size?: "sm" | "md" | "lg";
  profit: number;
  currency: string;
};

export const Profit: FC<ProfitProps> = ({ profit, currency, size = "md" }) => {
  const isPositive = profit >= 0;
  const sign = isPositive ? "+" : "";
  const color = isPositive
    ? "var(--joy-palette-success-500)"
    : "var(--joy-palette-danger-500)";

  return (
    <Typography
      level={`title-${size}`}
      sx={{
        color,
        fontWeight: "bold",
      }}
    >
      {sign}
      {profit.toFixed(2)}
      &nbsp;
      {currency}
    </Typography>
  );
};
