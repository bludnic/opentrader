import { SmartBuySell } from "@bifrost/bot-processor";
import { OrderSideEnum } from "@bifrost/types";
import { BuyTransaction } from "src/types";

export function buyTransaction(smartTrade: SmartBuySell): BuyTransaction {
  const { buy, sell, quantity } = smartTrade;

  return {
    side: OrderSideEnum.Buy,
    quantity,
    buy: {
      price: buy.price,
      fee: 0, // @todo fee
      updateAt: buy.updatedAt,
    },
    sell: sell
      ? {
          price: sell.price,
          fee: 0, // @todo fee
          updateAt: sell.updatedAt,
        }
      : undefined,
    profit: 0,
  };
}
