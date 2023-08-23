import { SmartTrade, SmartBuyOnly, SmartTradeTypeEnum } from "../../types";

export function isSmartBuy(smartTrade: SmartTrade): smartTrade is SmartBuyOnly {
  return smartTrade.type === SmartTradeTypeEnum.BuyOnly;
}
