import type { IExchange } from "@opentrader/exchanges";
import type { SmartTrade } from "../smart-trade/index.js";
import { CreateSmartTradePayload } from "./types.js";

export interface IStore {
  stopBot: (botId: number) => Promise<void>;
  getSmartTrade: (ref: string, botId: number) => Promise<SmartTrade | null>;
  createSmartTrade: (ref: string, payload: CreateSmartTradePayload, botId: number) => Promise<SmartTrade>;

  updateSmartTrade: (
    ref: string,
    payload: Pick<CreateSmartTradePayload, "sell">,
    botId: number,
  ) => Promise<SmartTrade | null>;

  /**
   * If `true` then SmartTrade was canceled with success.
   * @param ref - SmartTrade ref
   * @param botId - Bot ID
   */
  cancelSmartTrade: (ref: string, botId: number) => Promise<boolean>;

  getExchange: (label: string) => Promise<IExchange | null>;
}
