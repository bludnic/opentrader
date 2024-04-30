import type { UseSmartTradePayload } from "../../effects/common/types/use-smart-trade-effect";
import type { SmartTrade } from "../smart-trade/smart-trade.type";

export interface IBotControl {
  /**
   * Stop bot
   */
  stop: () => Promise<void>;

  getSmartTrade: (ref: string) => Promise<SmartTrade | null>;

  createSmartTrade: (
    ref: string,
    payload: UseSmartTradePayload,
  ) => Promise<SmartTrade>;

  getOrCreateSmartTrade: (
    ref: string,
    payload: UseSmartTradePayload,
  ) => Promise<SmartTrade>;

  replaceSmartTrade: (ref: string, payload: SmartTrade) => Promise<SmartTrade>;

  cancelSmartTrade: (ref: string) => Promise<boolean>;
}
