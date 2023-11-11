import { CreatePriceLineOptions, LineStyle } from "lightweight-charts";

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
    ? "green"
    : "red";

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
  return {
    price,
    color,
    axisLabelVisible: true,
    axisLabelColor: color,
    axisLabelTextColor: "#fff",
    title: label,
    lineVisible: true,
    lineStyle: LineStyle.LargeDashed,
  };
}
