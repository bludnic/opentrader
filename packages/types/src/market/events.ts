import { StrategyTriggerEventType } from "../strategy-runner/context.js";
import { ICandlestick, IOrderbook, ITicker, ITrade } from "../exchange/index.js";
import { MarketId } from "./common.js";

export type CandleClosedMarketEvent = {
  type: typeof StrategyTriggerEventType.onCandleClosed;
  marketId: MarketId;
  candle: ICandlestick; // current closed candle
  candles: ICandlestick[]; // previous candles history
};

export type PublicTradeMarketEvent = {
  type: typeof StrategyTriggerEventType.onPublicTrade;
  marketId: MarketId;
  trade: ITrade;
};

export type OrderbookChangeMarketEvent = {
  type: typeof StrategyTriggerEventType.onOrderbookChange;
  marketId: MarketId;
  orderbook: IOrderbook;
};

export type TickerChangeMarketEvent = {
  type: typeof StrategyTriggerEventType.onTickerChange;
  marketId: MarketId;
  ticker: ITicker;
};

export type MarketEvent =
  | CandleClosedMarketEvent
  | PublicTradeMarketEvent
  | OrderbookChangeMarketEvent
  | TickerChangeMarketEvent;
