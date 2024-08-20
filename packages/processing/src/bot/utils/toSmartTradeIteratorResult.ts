import type { SmartTrade as ProcessorSmartTrade } from "@opentrader/bot-processor";
import type { SmartTradeEntity } from "@opentrader/db";
import { toProcessorOrderStatus } from "./toProcessorOrderStatus.js";
import { XSmartTradeType } from "@opentrader/types";

/**
 * Convert `ISmartTrade` entity into `SmartTrade` iterator result
 * of the `@opentrader/bot-processor` package
 */

export function toSmartTradeIteratorResult(smartTrade: SmartTradeEntity): ProcessorSmartTrade {
  const { id } = smartTrade;

  if (!smartTrade.ref) {
    throw new Error("SmartTrade is missing ref");
  }

  if (smartTrade.type === "DCA") {
    throw new Error("toSmartTradeIteratorResult: DCA trade is not supported yet");
  }

  if (smartTrade.entryType === "Ladder") {
    throw new Error('toSmartTradeIteratorResult: SmartTrade with "entryType = Ladder" is not supported yet');
  }

  if (smartTrade.takeProfitType === "Ladder") {
    throw new Error('toSmartTradeIteratorResult: SmartTrade with "takeProfitType = Ladder" is not supported yet');
  }

  const { entryOrder, takeProfitOrder } = smartTrade;

  const nullToUndefined = (price: number | null): any => price || undefined; // any as a workaround

  return {
    id,
    type: smartTrade.type as XSmartTradeType,
    quantity: entryOrder.quantity, // or sellOrder.quantity
    ref: smartTrade.ref,
    buy: {
      type: entryOrder.type,
      status: toProcessorOrderStatus(entryOrder.status),
      price: nullToUndefined(entryOrder.price), // workaround
      filledPrice: nullToUndefined(entryOrder.filledPrice), // workaround
      createdAt: entryOrder.createdAt.getTime(),
      updatedAt: entryOrder.updatedAt.getTime(),
    },
    sell: takeProfitOrder
      ? {
          type: takeProfitOrder.type,
          status: toProcessorOrderStatus(takeProfitOrder.status),
          price: nullToUndefined(takeProfitOrder.price), // workaround
          filledPrice: nullToUndefined(takeProfitOrder.filledPrice), // workaround
          createdAt: takeProfitOrder.createdAt.getTime(),
          updatedAt: takeProfitOrder.updatedAt.getTime(),
        }
      : undefined,
  };
}
