import { SmartBuySell } from "@bifrost/bot-processor";
import { OrderSideEnum } from "@bifrost/types";
import { ActiveOrder } from "src/types";

export function sellOrder(smartTrade: SmartBuySell): ActiveOrder {
  return {
    side: OrderSideEnum.Sell,
    quantity: smartTrade.quantity,
    price: smartTrade.sell.price,
  };
}
