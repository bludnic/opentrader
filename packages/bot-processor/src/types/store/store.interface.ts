import { UseSmartTradePayload } from "../../effects/common/types/use-smart-trade-effect";
import { SmartTrade } from "../smart-trade/smart-trade.type";

export interface IStore {
  stopBot(botId: string): Promise<void>;
  getSmartTrade(key: string, botId: string): Promise<SmartTrade | null>;
  createSmartTrade(
    key: string,
    payload: UseSmartTradePayload,
    botId: string
  ): Promise<SmartTrade>;
}
