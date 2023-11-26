import type { SmartTrade } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import type { BuyTransaction } from "#backtesting/types";

export function buyTransaction(smartTrade: SmartTrade): BuyTransaction {
  const { buy, sell, quantity, id } = smartTrade;

  return {
    smartTradeId: id,
    side: OrderSideEnum.Buy,
    quantity,
    buy: {
      price: buy.price,
      fee: 0, // @todo fee
      updatedAt: buy.updatedAt,
    },

    sell: sell
      ? {
          price: sell.price,
          fee: 0, // @todo fee
          updatedAt: sell.updatedAt,
        }
      : undefined,
    profit: 0,
  };
}
