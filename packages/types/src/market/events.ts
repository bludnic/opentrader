import { MarketEventType } from "../strategy-runner/context.js";
import { ICandlestick, IOrderbook, ITicker, ITrade } from "../exchange/index.js";
import { MarketId } from "./common.js";

export type CandleClosedMarketEvent = {
  type: typeof MarketEventType.onCandleClosed;
  marketId: MarketId;
  candle: ICandlestick; // current closed candle
  candles: ICandlestick[]; // previous candles history
};

export type PublicTradeMarketEvent = {
  type: typeof MarketEventType.onPublicTrade;
  marketId: MarketId;
  trade: ITrade;
};

export type OrderbookChangeMarketEvent = {
  type: typeof MarketEventType.onOrderbookChange;
  marketId: MarketId;
  orderbook: IOrderbook;
};

export type TickerChangeMarketEvent = {
  type: typeof MarketEventType.onTickerChange;
  marketId: MarketId;
  ticker: ITicker;
};

export type MarketEvent =
  | CandleClosedMarketEvent
  | PublicTradeMarketEvent
  | OrderbookChangeMarketEvent
  | TickerChangeMarketEvent;
