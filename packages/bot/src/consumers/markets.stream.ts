import { EventEmitter } from "node:events";
import { TBotWithExchangeAccount } from "@opentrader/db";
import { findStrategy } from "@opentrader/bot-templates/server";
import { getWatchers } from "@opentrader/processing";
import {
  CandleClosedMarketEvent,
  OrderbookChangeMarketEvent,
  PublicTradeMarketEvent,
  TickerChangeMarketEvent,
} from "@opentrader/types";
import { CandlesConsumer } from "./candles.consumer.js";
import { OrderbookConsumer } from "./orderbook.consumer.js";
import { TradesConsumer } from "./trades.consumer.js";
import { TickerConsumer } from "./ticker.consumer.js";
import { CandleEvent, OrderbookEvent, TradeEvent, TickerEvent } from "../channels/index.js";

/**
 * Emits:
 * - market: MarketEvent
 */
export class MarketsStream extends EventEmitter {
  private unsubscribeAll = () => {};

  candlesStream: CandlesConsumer;
  orderbookStream: OrderbookConsumer;
  tradesStream: TradesConsumer;
  tickerStream: TickerConsumer;

  constructor(bots: TBotWithExchangeAccount[]) {
    super();

    this.candlesStream = new CandlesConsumer(bots);
    this.orderbookStream = new OrderbookConsumer(bots);
    this.tradesStream = new TradesConsumer(bots);
    this.tickerStream = new TickerConsumer(bots);

    this.unsubscribeAll = this.subscribe();
  }

  async add(bot: TBotWithExchangeAccount) {
    const { strategyFn } = await findStrategy(bot.template);
    const { watchTrades, watchOrderbook, watchTicker, watchCandles } = getWatchers(strategyFn, bot);

    if (watchCandles.length > 0) await this.candlesStream.addBot(bot);
    if (watchTrades.length > 0) await this.tradesStream.addBot(bot);
    if (watchOrderbook.length > 0) await this.orderbookStream.addBot(bot);
    if (watchTicker.length > 0) await this.tickerStream.addBot(bot);
  }

  private subscribe() {
    const handleCandle = ({ candle, history, marketId }: CandleEvent) => {
      this.emit("market", {
        type: "onCandleClosed",
        candle,
        candles: history,
        marketId,
      } satisfies CandleClosedMarketEvent);
    };
    this.candlesStream.on("candle", handleCandle);

    const handleTrade = ({ trade, marketId }: TradeEvent) => {
      this.emit("market", { type: "onPublicTrade", trade, marketId } satisfies PublicTradeMarketEvent);
    };
    this.tradesStream.on("trade", handleTrade);

    const handleOrderbook = ({ orderbook, marketId }: OrderbookEvent) => {
      this.emit("market", { type: "onOrderbookChange", orderbook, marketId } satisfies OrderbookChangeMarketEvent);
    };
    this.orderbookStream.on("orderbook", handleOrderbook);

    const handleTicker = ({ ticker, marketId }: TickerEvent) => {
      this.emit("market", { type: "onTickerChange", ticker, marketId } satisfies TickerChangeMarketEvent);
    };
    this.tickerStream.on("ticker", handleTicker);

    return () => {
      this.candlesStream.off("market", handleCandle);
      this.tradesStream.off("market", handleTrade);
      this.orderbookStream.off("market", handleOrderbook);
      this.tickerStream.off("market", handleTicker);
    };
  }

  async create() {
    await this.candlesStream.create();
    await this.orderbookStream.create();
    await this.tradesStream.create();
    await this.tickerStream.create();
  }

  async clean(bots: TBotWithExchangeAccount[]) {
    await this.candlesStream.cleanStaleChannels(bots);
    await this.orderbookStream.cleanStaleChannels(bots);
    await this.tradesStream.cleanStaleChannels(bots);
    await this.tickerStream.cleanStaleChannels(bots);
  }

  destroy() {
    this.unsubscribeAll();

    this.candlesStream.destroy();
    this.orderbookStream.destroy();
    this.tradesStream.destroy();
    this.tickerStream.destroy();
  }
}
