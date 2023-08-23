import { SmartBuySell, SmartTrade, SmartTradeTypeEnum } from "../../types";

export function isSmartTrade(
  smartTrade: SmartTrade
): smartTrade is SmartBuySell {
  return smartTrade.type === SmartTradeTypeEnum.BuySell;
}
