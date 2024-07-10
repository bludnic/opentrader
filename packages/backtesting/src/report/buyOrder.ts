import type { SmartTrade } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import type { ActiveOrder } from "../types/index.js";

export function buyOrder(smartTrade: SmartTrade): ActiveOrder {
  return {
    side: OrderSideEnum.Buy,
    quantity: smartTrade.quantity,
    price: (smartTrade.buy.filledPrice || smartTrade.buy.price)!,
  };
}
