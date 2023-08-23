import {
  SmartTrade,
  SmartBuyOnly,
  SmartSellOnly,
  SmartTradeTypeEnum,
} from "../../types";

export function isSmartSell(
  smartTrade: SmartTrade
): smartTrade is SmartSellOnly {
  return smartTrade.type === SmartTradeTypeEnum.SellOnly;
}
