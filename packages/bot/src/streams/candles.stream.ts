import { EventEmitter } from "node:events";
import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { TBotWithExchangeAccount } from "@opentrader/db";
import { getWatchers, getTimeframe } from "@opentrader/processing";
import { decomposeSymbolId } from "@opentrader/tools";
import { BarSize, ExchangeCode } from "@opentrader/types";
import { findStrategy } from "@opentrader/bot-templates/server";
import { CandleEvent } from "../channels/index.js";
import { CandlesChannel } from "../channels/index.js";

/**
 * Emits:
 * - candle: CandleEvent
 */
export class CandlesStream extends EventEmitter {
  private channels: CandlesChannel[] = [];
  private bots: TBotWithExchangeAccount[] = [];

  constructor(bots: TBotWithExchangeAccount[]) {
    super();
    this.bots = bots;
  }

  async create() {
    logger.info(`[CandlesProcessor] Creating candles channel for ${this.bots.length} timeframe based bots`);

    for (const bot of this.bots) {
      await this.addBot(bot);
    }
  }

  /**
   * Subscribes the bot to the candles channel.
   * It will create the channel if necessary or reusing it if it already exists.
   * @param bot Bot to add
   * @returns
   */
  async addBot(bot: TBotWithExchangeAccount) {
    const { strategyFn } = findStrategy(bot.template);
    const { watchCandles: symbols } = getWatchers(strategyFn, bot);

    const timeframe = getTimeframe(strategyFn, bot);
    if (!timeframe) {
      logger.warn(
        `[CandlesProcessor]: Skip adding bot [${bot.id}:"${bot.name}"] to the candles channel. Reason: The bot has no timeframe defined.`,
      );
      return;
    }

    for (const symbolId of symbols) {
      const { exchangeCode, currencyPairSymbol: symbol } = decomposeSymbolId(symbolId);

      const channel = this.getChannel(exchangeCode);
      await channel.add(symbol, timeframe, strategyFn.requiredHistory);
      logger.info(
        `[CandlesProcessor]: Subscribed bot [${bot.id}:"${bot.name}"] to the ${exchangeCode}:${symbol} channel`,
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

      channel = new CandlesChannel(exchange);
      this.channels.push(channel);

      logger.info(`[CandlesConsumer] Created ${exchangeCode} channel`);

      // @todo type
      channel.on("candle", this.handleCandle);
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
      const { watchCandles } = getWatchers(strategyFn, bot);

      botsInUse.push({
        timeframe: getTimeframe(strategyFn, bot), // override
        symbols: watchCandles,
        exchangeCodes: [...new Set(watchCandles.map((symbolId) => decomposeSymbolId(symbolId).exchangeCode))],
      });
    }

    for (const channel of this.channels) {
      // Clean stale channels
      const isChannelUsedByAnyBot = botsInUse.some((bot) => bot.exchangeCodes.includes(channel.exchangeCode));
      if (!isChannelUsedByAnyBot) {
        logger.info(`[CandlesProcessor] Removing stale channel ${channel.exchangeCode}`);
        this.removeChannel(channel);
        continue; // no need to check watchers and aggregators
      }

      // Clean up stale watchers
      for (const watcher of channel.getWatchers()) {
        const isWatcherUsedByAnyBot = botsInUse.some((bot) =>
          bot.symbols.includes(`${channel.exchangeCode}/${watcher.symbol}`),
        );

        if (!isWatcherUsedByAnyBot) {
          logger.info(`[CandlesProcessor] Removing stale watcher ${channel.exchangeCode}:${watcher.symbol}`);
          channel.removeWatcher(watcher);
        }
      }

      // Clean stale aggregators
      for (const aggregator of channel.getAggregators()) {
        const isAggregatorUsedByAnyBot = botsInUse.some(
          (bot) =>
            bot.symbols.includes(`${channel.exchangeCode}:${aggregator.symbol}`) &&
            bot.timeframe === aggregator.timeframe,
        );

        if (!isAggregatorUsedByAnyBot) {
          logger.info(
            `[CandlesProcessor] Removing stale aggregator ${channel.exchangeCode}:${aggregator.symbol}#${aggregator.timeframe}`,
          );
          channel.removeAggregator(aggregator);
        }
      }
    }
  }

  private handleCandle = async (data: CandleEvent) => {
    this.emit("candle", data);
  };

  /**
   * Destroy and remove the channel from the list.
   * @param exchangeCode
   */
  private removeChannel(channel: CandlesChannel) {
    channel.off("candle", this.handleCandle);
    channel.destroy();

    this.channels = this.channels.filter((c) => c !== channel);
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
