export interface ITweetTradingBotSmartTradeSettings {
  accountId: number; // 3commas account id
  volume: number; // amount to buy
  takeProfitPercent: number;
  stopLossPercent: number;
  baseCurrency: string;
  quoteCurrency: string;
  note: string; // some useful information
}
