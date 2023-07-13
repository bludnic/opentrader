import { ISmartTradePosition } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-position/smart-trade-position.interface';
import { ISmartTradeStopLoss } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-stop-loss/smart-trade-stop-loss.interface';
import { ISmartTradeTakeProfit } from 'src/core/db/firestore/repositories/tweet-trading-bots/types/smart-trade-take-profit/smart-trade-take-profit.interface';

export interface ITweetTradingBotSmartTradeParams {
  account_id: string;
  pair: string; // USDT_BTC
  note: string;

  position: ISmartTradePosition;
  take_profit: ISmartTradeTakeProfit;
  stop_loss: ISmartTradeStopLoss;
}
