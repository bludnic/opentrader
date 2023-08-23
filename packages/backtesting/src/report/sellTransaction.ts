import { SmartBuySell } from "@bifrost/bot-processor";
import { OrderSideEnum } from "@bifrost/types";
import { SellTransaction } from "../types";

export function sellTransaction(
  smartTrade: SmartBuySell
): SellTransaction {
  const { buy, sell, quantity } = smartTrade;

  return {
    side: OrderSideEnum.Sell,
    quantity,
    buy: {
      price: buy.price,
      fee: 0, // @todo fee
      updateAt: buy.updatedAt,
    },
    sell: {
      price: sell.price,
      fee: 0, // @todo fee
      updateAt: sell.updatedAt,
    },
    profit: 0, // @todo profit
  };
}
