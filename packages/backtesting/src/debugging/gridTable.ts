import type { SmartTrade } from "@opentrader/bot-processor";
import { OrderStatusEnum } from "@opentrader/types";

export function gridTable(smartTrades: SmartTrade[]) {
  const rows = smartTrades.flatMap((smartTrade, i) => {
    const { buy, sell } = smartTrade;

    const isBuy =
      buy.status === OrderStatusEnum.Placed &&
      (!sell || sell.status === OrderStatusEnum.Idle);
    const isSell =
      buy.status === OrderStatusEnum.Filled &&
      sell?.status === OrderStatusEnum.Placed;

    const prevSmartTrade = smartTrades[i - 1];
    const isCurrent =
      isSell && prevSmartTrade?.sell?.status === OrderStatusEnum.Idle;

    const side = isBuy ? "buy" : isSell ? "sell" : "unknown";

    const price =
      side === "sell"
        ? smartTrade.sell?.price
        : side === "buy"
          ? smartTrade.buy.price
          : "unknown";

    const gridLine = {
      stIndex: i,
      ref: smartTrade.ref,
      stId: smartTrade.id,
      side,
      price,
      buy: smartTrade.buy.price,
      sell: smartTrade.sell?.price,
    };

    if (isCurrent) {
      const currentLine = {
        stIndex: "-",
        ref: "-",
        stId: "-",
        side: "Curr",
        price: smartTrade.buy.price,
        buy: "-",
        sell: "-",
        filled: "",
      };

      return [currentLine, gridLine];
    }

    return [gridLine];
  });

  return rows.reverse();
}
