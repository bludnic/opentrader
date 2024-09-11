import { EventEmitter } from "node:events";
import { findStrategy } from "@opentrader/bot-templates/server";
import { exchangeProvider } from "@opentrader/exchanges";
import { getTimeframe, getWatchers } from "@opentrader/processing";
import { logger } from "@opentrader/logger";
import type { TBotWithExchangeAccount } from "@opentrader/db";
import { decomposeSymbolId } from "@opentrader/tools";
import { BarSize, ExchangeCode } from "@opentrader/types";
import type { TickerEvent } from "../channels/index.js";
import { TickerChannel } from "../channels/index.js";

/**
 * Emits:
 * - ticker: TickerEvent
 */
export class TickerStream extends EventEmitter {
  private channels: TickerChannel[] = [];
  private bots: TBotWithExchangeAccount[] = [];

  constructor(bots: TBotWithExchangeAccount[]) {
    super();
    this.bots = bots;
  }

  async create() {
    logger.info(`[TickerConsumer] Creating ticker channel for ${this.bots.length} bots`);

    for (const bot of this.bots) {
      await this.addBot(bot);
    }
  }

  /**
   * Subscribes the bot to the ticker channel.
   * It will create the channel if necessary or reusing it if it already exists.
   */
  async addBot(bot: TBotWithExchangeAccount) {
    const { strategyFn } = findStrategy(bot.template);
    const { watchTicker: symbols } = getWatchers(strategyFn, bot);

    for (const symbolId of symbols) {
      const { exchangeCode, currencyPairSymbol: symbol } = decomposeSymbolId(symbolId);

      const channel = this.getChannel(exchangeCode);
      await channel.add(symbol);
      logger.info(
        `[TickerConsumer]: Subscribed bot [${bot.id}:"${bot.name}"] to the ${exchangeCode}:${symbol} channel`,
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

      channel = new TickerChannel(exchange);
      this.channels.push(channel);

      logger.info(`[TickerConsumer] Created ${exchangeCode} channel`);

      // @todo type
      channel.on("ticker", this.handleTicker);
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
      const { watchTicker } = getWatchers(strategyFn, bot);

      botsInUse.push({
        timeframe: getTimeframe(strategyFn, bot), // override
        symbols: watchTicker,
        exchangeCodes: [...new Set(watchTicker.map((symbolId) => decomposeSymbolId(symbolId).exchangeCode))],
      });
    }

    for (const channel of this.channels) {
      // Clean stale channels
      const isChannelUsedByAnyBot = botsInUse.some((bot) => bot.exchangeCodes.includes(channel.exchangeCode));
      if (!isChannelUsedByAnyBot) {
        logger.info(`[TickerConsumer] Removing stale channel ${channel.exchangeCode}`);
        this.removeChannel(channel);
        continue; // no need to check watchers
      }

      // Clean up stale watchers
      for (const watcher of channel.getWatchers()) {
        const isWatcherUsedByAnyBot = botsInUse.some((bot) =>
          bot.symbols.includes(`${channel.exchangeCode}/${watcher.symbol}`),
        );

        if (!isWatcherUsedByAnyBot) {
          logger.info(`[TickerConsumer] Removing stale watcher ${channel.exchangeCode}:${watcher.symbol}`);
          channel.removeWatcher(watcher);
        }
      }
    }
  }

  private handleTicker = async (data: TickerEvent) => {
    this.emit("ticker", data);
  };

  /**
   * Destroy and remove the channel from the list.
   */
  private removeChannel(channel: TickerChannel) {
    channel.off("ticker", this.handleTicker);
    channel.destroy();

    this.channels = this.channels.filter((c) => c !== channel);
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
