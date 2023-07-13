import { ITweetTradingBotSmartTradeSettings } from './types/smart-trade-settings/tweet-trading-bot-smart-trade-settings.interface';

export class ITweetTradingBot {
  id: string;
  name: string;
  enabled: boolean;
  smartTradeSettings: ITweetTradingBotSmartTradeSettings;

  /**
   * IDs of signals to watch.
   */
  watchSignalsIds: string[];
  /**
   * IDs of signal events already used in SmartTrades.
   * To avoid duplication of SmartTrades with the same signal event.
   */
  usedSignalEventsIds: string[];

  exchangeAccountId: string;
  threeCommasAccountId: string;

  createdAt: string; // ISO
}
