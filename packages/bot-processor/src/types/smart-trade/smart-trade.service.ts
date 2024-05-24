import { OrderStatusEnum } from "@opentrader/types";
import { cancelSmartTrade, replaceSmartTrade } from "../../effects";
import type { SmartTrade } from "./smart-trade.type";

export class SmartTradeService {
  buy: SmartTrade["buy"];
  sell: SmartTrade["sell"];

  constructor(
    private ref: string,
    private smartTrade: SmartTrade,
  ) {
    // Instead of assigning prop by prop
    // it is possible to use `Object.assign(this, smartTrade)`
    // but types are lost in this case
    this.buy = smartTrade.buy;
    this.sell = smartTrade.sell;
  }

  /**
   * Create a new SmartTrade with same buy/sell orders
   */
  replace() {
    return replaceSmartTrade(this.smartTrade, this.ref);
  }

  cancel() {
    return cancelSmartTrade(this.ref);
  }

  isCompleted(): boolean {
    return this.smartTrade.sell?.status === OrderStatusEnum.Filled;
  }
}
