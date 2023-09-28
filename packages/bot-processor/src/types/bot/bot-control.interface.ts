import { UseSmartTradePayload } from "../../effects/common/types/use-smart-trade-effect";
import { IBotConfiguration } from "../bot/bot-configuration.interface";
import { IStore } from "../store/store.interface";
import { SmartTrade } from "../smart-trade/smart-trade.type";

export interface IBotControl<T extends IBotConfiguration> {
  store: IStore;
  bot: T;

  /**
   * Stop bot
   */
  stop(): Promise<void>;

  getSmartTrade(ref: string): Promise<SmartTrade | null>;

  createSmartTrade(
    ref: string,
    payload: UseSmartTradePayload,
  ): Promise<SmartTrade>;

  getOrCreateSmartTrade(
    ref: string,
    payload: UseSmartTradePayload,
  ): Promise<SmartTrade>;

  replaceSmartTrade(ref: string, payload: SmartTrade): Promise<SmartTrade>;

  cancelSmartTrade(ref: string): Promise<boolean>;
}
