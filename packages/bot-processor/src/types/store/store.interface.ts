import { UseSmartTradePayload } from "../../effects/common/types/use-smart-trade-effect";
import { SmartTrade } from "../smart-trade/smart-trade.type";

export interface IStore {
  stopBot(botId: number): Promise<void>;
  getSmartTrade(ref: string, botId: number): Promise<SmartTrade | null>;
  createSmartTrade(
    ref: string,
    payload: UseSmartTradePayload,
    botId: number,
  ): Promise<SmartTrade>;

  /**
   * If `true` then SmartTrade was canceled with success.
   * @param ref
   * @param botId
   */
  cancelSmartTrade(ref: string, botId: number): Promise<boolean>;
}
