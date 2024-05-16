import type { SmartTradeWithSell } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import type { SellTransaction } from "../types";

export function sellTransaction(
  smartTrade: SmartTradeWithSell,
): SellTransaction {
  const { buy, sell, quantity, id } = smartTrade;

  return {
    smartTradeId: id,
    side: OrderSideEnum.Sell,
    quantity,
    buy: {
      price: buy.price,
      fee: 0, // @todo fee
      updatedAt: buy.updatedAt,
    },
    sell: {
      price: sell.price,
      fee: 0, // @todo fee
      updatedAt: sell.updatedAt,
    },
    profit: 0, // @todo profit
  };
}
