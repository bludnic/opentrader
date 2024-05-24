import { SmartTradeWithSell } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import type { ActiveOrder } from "../types";

export function sellOrder(smartTrade: SmartTradeWithSell): ActiveOrder {
  return {
    side: OrderSideEnum.Sell,
    quantity: smartTrade.quantity,
    price: smartTrade.sell.filledPrice || smartTrade.sell.price,
  };
}
