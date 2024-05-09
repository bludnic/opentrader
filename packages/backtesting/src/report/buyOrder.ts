import type { SmartTrade } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import type { ActiveOrder } from "../types";

export function buyOrder(smartTrade: SmartTrade): ActiveOrder {
  return {
    side: OrderSideEnum.Buy,
    quantity: smartTrade.quantity,
    price: smartTrade.buy.price,
  };
}
