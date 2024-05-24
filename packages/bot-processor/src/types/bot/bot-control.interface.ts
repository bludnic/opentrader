import type { IExchange } from "@opentrader/exchanges";
import type { UseSmartTradePayload } from "../../effects";
import type { SmartTrade } from "../smart-trade";

export interface IBotControl {
  /**
   * Stop bot
   */
  stop: () => Promise<void>;

  getSmartTrade: (ref: string) => Promise<SmartTrade | null>;

  updateSmartTrade: (
    ref: string,
    payload: Pick<UseSmartTradePayload, "sell">,
  ) => Promise<SmartTrade | null>;

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

  getExchange: (label: string) => Promise<IExchange | null>;
}
