import { SmartBuySell } from "@bifrost/bot-processor";
import { OrderSideEnum } from "@bifrost/types";
import { ActiveOrder } from "src/types";

export function buyOrder(smartTrade: SmartBuySell): ActiveOrder {
  return {
    side: OrderSideEnum.Buy,
    quantity: smartTrade.quantity,
    price: smartTrade.buy.price,
  };
}
