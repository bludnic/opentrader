import { SmartTrade } from "@bifrost/bot-processor";
import { OrderSideEnum } from "@bifrost/types";
import { ActiveOrder } from "src/types";

export function sellOrder(smartTrade: SmartTrade): ActiveOrder {
  return {
    side: OrderSideEnum.Sell,
    quantity: smartTrade.quantity,
    price: smartTrade.sell.price,
  };
}
