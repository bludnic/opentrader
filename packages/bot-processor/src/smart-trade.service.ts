import { OrderStatusEnum } from "@bifrost/types";
import { replaceSmartTrade, ReplaceSmartTradeEffect } from "./effects";
import { SmartTrade } from "./types";

export class SmartTradeService {
  id: SmartTrade["id"];
  buy: SmartTrade["buy"];
  sell: SmartTrade["sell"];
  quantity: SmartTrade["quantity"];

  constructor(private key: string, private smartTrade: SmartTrade) {
    // Instead of assigning prop by prop
    // it is possible to use `Object.assign(this, smartTrade)`
    // buy types are lost in this case
    this.id = smartTrade.id;
    this.buy = smartTrade.buy;
    this.sell = smartTrade.sell;
    this.quantity = smartTrade.quantity;
  }

  /**
   * Create a new SmartTrade with same buy/sell orders
   */
  replace(): ReplaceSmartTradeEffect {
    return replaceSmartTrade(this.key, this.smartTrade);
  }

  isCompleted(): boolean {
    if (this.smartTrade.sell) {
      return this.smartTrade.sell.status === OrderStatusEnum.Filled;
    }

    // Note: SmartTrade can have only buy order,
    // that means that the smartTrade is completed
    return this.smartTrade.buy.status === OrderStatusEnum.Filled;
  }
}
