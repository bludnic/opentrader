import { SmartTrade } from "@opentrader/bot-processor";
import { OrderSideEnum } from "@opentrader/types";
import { ActiveOrder } from "#backtesting/types";

export function sellOrder(smartTrade: SmartTrade): ActiveOrder {
  return {
    side: OrderSideEnum.Sell,
    quantity: smartTrade.quantity,
    price: smartTrade.sell.price,
  };
}
