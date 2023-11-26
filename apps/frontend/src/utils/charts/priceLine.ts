import type { CreatePriceLineOptions } from "lightweight-charts";
import { LineStyle } from "lightweight-charts";

export function computePriceLine(
  price: number,
  prices: number[],
  waitingPrice: number,
) {
  const index = prices.indexOf(price);
  const lineNumber = index + 1;
  const isUpperLimitPrice = lineNumber === prices.length;
  const isLowerLimitPrice = lineNumber === 1;

  const isWaitingLinePrice = price === waitingPrice;

  const color = isWaitingLinePrice
    ? "gray"
    : price > waitingPrice
    ? "red"
    : "green";

  const label = isWaitingLinePrice
    ? `Waiting line · ${index}`
    : isUpperLimitPrice
    ? `High price · ${index}`
    : isLowerLimitPrice
    ? `Low price · ${index}`
    : `${index}`;

  return priceLine(price, color, label);
}

export function priceLine(
  price: number,
  color: "gray" | "green" | "red",
  label: string,
): CreatePriceLineOptions {
  const colorMap = {
    gray: "#636B74", // var(--joy-palette-neutral-500, #636B74)
    green: "#1F7A1F", // var(--joy-palette-success-500, #1F7A1F)
    red: "#C41C1C", // var(--joy-palette-danger-500, #C41C1C)
  };

  const hexColor = colorMap[color];

  return {
    price,
    color: hexColor,
    axisLabelVisible: true,
    axisLabelColor: hexColor,
    axisLabelTextColor: "#fff",
    title: label,
    lineVisible: true,
    lineStyle: LineStyle.LargeDashed,
  };
}
