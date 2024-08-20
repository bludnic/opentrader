import type { IExchange } from "@opentrader/exchanges";
import type { SmartTrade } from "../smart-trade/index.js";
import { CreateSmartTradePayload } from "../store/index.js";

export interface IBotControl {
  /**
   * Stop bot
   */
  stop: () => Promise<void>;
  getSmartTrade: (ref: string) => Promise<SmartTrade | null>;
  updateSmartTrade: (ref: string, payload: Pick<CreateSmartTradePayload, "sell">) => Promise<SmartTrade | null>;
  createSmartTrade: (ref: string, payload: CreateSmartTradePayload) => Promise<SmartTrade>;
  getOrCreateSmartTrade: (ref: string, payload: CreateSmartTradePayload) => Promise<SmartTrade>;
  replaceSmartTrade: (ref: string, payload: SmartTrade) => Promise<SmartTrade>;
  cancelSmartTrade: (ref: string) => Promise<boolean>;
  getExchange: (label: string) => Promise<IExchange | null>;
}
