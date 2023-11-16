import { TActiveSmartTrade } from "src/types/trpc";

export function getWaitingGridLinePrice(
  smartTrades: TActiveSmartTrade[],
): number {
  if (smartTrades.length === 0) {
    throw new Error("getWaitingGridLinePrice: empty array provided");
  }

  if (smartTrades.length === 1) {
    const { entryOrder, takeProfitOrder } = smartTrades[0];

    if (takeProfitOrder.status === "Filled") {
      return takeProfitOrder.price!;
    }

    return entryOrder.price!;
  }

  // Filter SmartTrades with buy order Filled
  const filledSmartTrades = smartTrades.filter(
    (smartTrade) => smartTrade.entryOrder.status === "Filled",
  );

  if (filledSmartTrades.length === 0) {
    const highestSmartTrade = smartTrades[0]; // highest by price (assume that the array was sorted before)

    return highestSmartTrade.takeProfitOrder.price!;
  }

  if (filledSmartTrades.length === 1) {
    const smartTrade = filledSmartTrades[0];

    return smartTrade.entryOrder.price!;
  }

  // Find SmartTrade with the lowest price
  const smartTrade = filledSmartTrades.reduce((acc, curr) => {
    if (curr.entryOrder.price! < acc.entryOrder.price!) {
      return curr;
    }

    return acc;
  });

  return smartTrade.entryOrder.price!;
}
