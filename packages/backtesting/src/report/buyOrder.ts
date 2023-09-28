import { SmartTrade } from "@bifrost/bot-processor";
import { OrderSideEnum } from "@bifrost/types";
import { ActiveOrder } from "src/types";

export function buyOrder(smartTrade: SmartTrade): ActiveOrder {
  return {
    side: OrderSideEnum.Buy,
    quantity: smartTrade.quantity,
    price: smartTrade.buy.price,
  };
}
