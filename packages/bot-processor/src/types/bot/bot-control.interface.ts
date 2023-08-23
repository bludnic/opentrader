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

  getSmartTrade(key: string): Promise<SmartTrade | null>;

  createSmartTrade(
    key: string,
    payload: UseSmartTradePayload
  ): Promise<SmartTrade>;

  getOrCreateSmartTrade(
    key: string,
    payload: UseSmartTradePayload
  ): Promise<SmartTrade>;

  replaceSmartTrade(key: string, payload: SmartTrade): Promise<SmartTrade>;
}
