import { SmartTradeEntity, SmartTradeEntity_Order_Order } from "#db/entities";

/**
 * Asserts that SmartTrade uses orders for entry and exit
 * @param smartTrade
 */
export function assertIsOrderBased(
  smartTrade: SmartTradeEntity,
): asserts smartTrade is SmartTradeEntity_Order_Order {
  const { entryType, takeProfitType } = smartTrade;

  if (entryType !== "Order") {
    throw new Error(
      `assertIsOrderToOrder: Entry type "${smartTrade}" is not supported`,
    );
  }

  if (takeProfitType !== "Order") {
    throw new Error(
      `assertIsOrderToOrder: TP type "${smartTrade}" is not supported`,
    );
  }
}
