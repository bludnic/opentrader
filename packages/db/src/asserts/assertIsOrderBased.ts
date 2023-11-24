import type {
  SmartTradeEntity,
  // eslint-disable-next-line camelcase -- this is exception
  SmartTradeEntity_Order_Order,
} from "#db/entities";

/**
 * Asserts that SmartTrade uses orders for entry and exit
 * @param smartTrade - SmartTrade
 */
export function assertIsOrderBased(
  smartTrade: SmartTradeEntity,
  // eslint-disable-next-line camelcase -- this is exception
): asserts smartTrade is SmartTradeEntity_Order_Order {
  const { entryType, takeProfitType } = smartTrade;

  if (entryType !== "Order") {
    throw new Error(
      `assertIsOrderToOrder: Entry type "${entryType}" is not supported`,
    );
  }

  if (takeProfitType !== "Order") {
    throw new Error(
      `assertIsOrderToOrder: TP type "${entryType}" is not supported`,
    );
  }
}
