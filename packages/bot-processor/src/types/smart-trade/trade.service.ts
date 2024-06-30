import { OrderStatusEnum } from "@opentrader/types";
import { cancelSmartTrade } from "../../effects/index.js";
import type { SmartTrade } from "./smart-trade.type.js";

export class TradeService {
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

  cancel() {
    return cancelSmartTrade(this.ref);
  }

  isCompleted() {
    return this.smartTrade.sell?.status === OrderStatusEnum.Filled;
  }
}
