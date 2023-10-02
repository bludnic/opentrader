import { SmartTrade } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import { ActiveOrder } from "src/types";

export function buyOrder(smartTrade: SmartTrade): ActiveOrder {
  return {
    side: OrderSideEnum.Buy,
    quantity: smartTrade.quantity,
    price: smartTrade.buy.price,
  };
}
