import { SmartTrade } from "../../../types/smart-trade/smart-trade.type";

export type State = Record<string, BotState>; // botId: BotState

export interface BotState {
  enabled: boolean;
  smartTrades: SmartTrade[]
}
