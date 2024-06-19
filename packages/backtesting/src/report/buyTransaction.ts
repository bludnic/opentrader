import type { SmartTrade } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import type { BuyTransaction } from "../types/index.js";

export function buyTransaction(smartTrade: SmartTrade): BuyTransaction {
  const { buy, sell, quantity, id } = smartTrade;

  return {
    smartTradeId: id,
    side: OrderSideEnum.Buy,
    quantity,
    buy: {
      price: buy.filledPrice || buy.price || 0,
      fee: 0, // @todo fee
      updatedAt: buy.updatedAt,
    },

    sell: sell
      ? {
          price: sell.filledPrice || sell.price || 0,
          fee: 0, // @todo fee
          updatedAt: sell.updatedAt,
        }
      : undefined,
    profit: 0,
  };
}
