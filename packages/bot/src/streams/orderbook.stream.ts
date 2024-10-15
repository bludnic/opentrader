import { EventEmitter } from "node:events";
import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { TBotWithExchangeAccount } from "@opentrader/db";
import { findStrategy } from "@opentrader/bot-templates/server";
import { getWatchers, getTimeframe } from "@opentrader/processing";
import { decomposeSymbolId } from "@opentrader/tools";
import { BarSize, ExchangeCode } from "@opentrader/types";
import type { OrderbookEvent } from "../channels/index.js";
import { OrderbookChannel } from "../channels/index.js";

/**
 * Emits:
 * - orderbook: OrderbookEvent
 */
export class OrderbookStream extends EventEmitter {
  private channels: OrderbookChannel[] = [];
  private bots: TBotWithExchangeAccount[] = [];

  constructor(bots: TBotWithExchangeAccount[]) {
    super();
    this.bots = bots;
  }

  async create() {
    for (const bot of this.bots) {
      await this.addBot(bot);
    }
  }

  /**
   * Subscribes the bot to the orderbook channel.
   * It will create the channel if necessary or reusing it if it already exists.
   * @param bot Bot to add
   * @returns
   */
  async addBot(bot: TBotWithExchangeAccount) {
    const { strategyFn } = findStrategy(bot.template);
    const { watchOrderbook: symbols } = getWatchers(strategyFn, bot);

    for (const symbolId of symbols) {
      const { exchangeCode, currencyPairSymbol: symbol } = decomposeSymbolId(symbolId);

      const channel = this.getChannel(exchangeCode);
      await channel.add(symbol);
      logger.info(
        `[OrderbookStream]: Subscribed bot [${bot.id}:"${bot.name}"] to the ${exchangeCode}:${symbol} channel`,
      );
    }
  }

  /**
   * Return existing channel or create a new one.
   */
  private getChannel(exchangeCode: ExchangeCode) {
    let channel = this.channels.find((channel) => channel.exchangeCode === exchangeCode);
    if (!channel) {
      const exchange = exchangeProvider.fromCode(exchangeCode);

      channel = new OrderbookChannel(exchange);
      this.channels.push(channel);

      logger.info(`[OrderbookStream] Created ${exchangeCode} channel`);

      // @todo type
      channel.on("orderbook", this.handleOrderbook);
    }

    return channel;
  }

  /**
   * Remove unused channels that are no longer used by any bots.
   * Triggered when any bot was stopped.
   */
  cleanStaleChannels(bots: TBotWithExchangeAccount[]) {
    const botsInUse: Array<{ timeframe: BarSize | null; symbols: string[]; exchangeCodes: ExchangeCode[] }> = [];
    for (const bot of bots) {
      const { strategyFn } = findStrategy(bot.template);
      const { watchOrderbook } = getWatchers(strategyFn, bot);

      botsInUse.push({
        timeframe: getTimeframe(strategyFn, bot), // override
        symbols: watchOrderbook,
        exchangeCodes: [...new Set(watchOrderbook.map((symbolId) => decomposeSymbolId(symbolId).exchangeCode))],
      });
    }

    for (const channel of this.channels) {
      // Clean stale channels
      const isChannelUsedByAnyBot = botsInUse.some((bot) => bot.exchangeCodes.includes(channel.exchangeCode));
      if (!isChannelUsedByAnyBot) {
        logger.info(`[OrderbookConsumer] Removing stale channel ${channel.exchangeCode}`);
        this.removeChannel(channel);
        continue; // no need to check watchers
      }

      // Clean up stale watchers
      for (const watcher of channel.getWatchers()) {
        const isWatcherUsedByAnyBot = botsInUse.some((bot) =>
          bot.symbols.includes(`${channel.exchangeCode}:${watcher.symbol}`),
        );

        if (!isWatcherUsedByAnyBot) {
          logger.info(`[OrderbookConsumer] Removing stale watcher ${channel.exchangeCode}:${watcher.symbol}`);
          channel.removeWatcher(watcher);
        }
      }
    }
  }

  private handleOrderbook = async (data: OrderbookEvent) => {
    this.emit("orderbook", data);
  };

  /**
   * Destroy and remove the channel from the list.
   * @param exchangeCode
   */
  private removeChannel(channel: OrderbookChannel) {
    channel.off("orderbook", this.handleOrderbook);
    channel.destroy();

    this.channels = this.channels.filter((c) => c !== channel);
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
