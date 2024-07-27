import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { TBot } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import type { BarSize } from "@opentrader/types";
import { findStrategy } from "@opentrader/bot-templates/server";
import type { CandleEvent } from "../channels/index.js";
import { CandlesChannel } from "../channels/index.js";

export class CandlesProcessor {
  private channels: CandlesChannel[] = [];
  private bots: TBot[] = [];

  constructor(bots: TBot[]) {
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
  async addBot(bot: TBot) {
    const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: {
        id: bot.exchangeAccountId,
      },
    });
    const exchange = exchangeProvider.fromAccount(exchangeAccount);
    const symbol = `${bot.baseCurrency}/${bot.quoteCurrency}`;

    let channel = this.channels.find((channel) => channel.exchangeCode === exchange.exchangeCode);
    if (!channel) {
      channel = new CandlesChannel(exchange);
      this.channels.push(channel);

      logger.info(`[CandlesProcessor] Created ${exchange.exchangeCode}:${symbol} channel`);

      // @todo type
      channel.on("candle", this.handleCandle);
    }

    if (bot.timeframe === null) {
      logger.warn(
        `[CandlesProcessor]: Skip adding bot [${bot.id}:"${bot.name}"] to the ${exchange.exchangeCode}:${symbol} channel. Reason: The bot is not timeframe based.`,
      );
      return;
    }

    const { strategyFn } = await findStrategy(bot.template);
    await channel.add(symbol, bot.timeframe as BarSize, strategyFn.requiredHistory);
    logger.info(
      `[CandlesProcessor]: Subscribed bot [${bot.id}:"${bot.name}"] to the ${exchange.exchangeCode}:${symbol} channel`,
    );
  }

  /**
   * Remove unused channels that are no longer used by any bots.
   * Triggered when any bot was stopped.
   */
  async cleanStaleChannels() {
    const bots = await xprisma.bot.findMany({
      where: {
        timeframe: { not: null },
        enabled: true,
      },
      include: {
        exchangeAccount: true,
      },
    });

    for (const channel of this.channels) {
      // Clean stale channels
      const isChannelUsedByAnyBot = bots.some((bot) => bot.exchangeAccount.exchangeCode === channel.exchangeCode);
      if (!isChannelUsedByAnyBot) {
        logger.info(`[CandlesProcessor] Removing stale channel ${channel.exchangeCode}`);
        this.removeChannel(channel);
        continue; // no need to check watchers and aggregators
      }

      // Clean up stale watchers
      for (const watcher of channel.getWatchers()) {
        const isWatcherUsedByAnyBot = bots.some(
          (bot) =>
            bot.exchangeAccount.exchangeCode === channel.exchangeCode &&
            `${bot.baseCurrency}/${bot.quoteCurrency}` === watcher.symbol,
        );

        if (!isWatcherUsedByAnyBot) {
          logger.info(`[CandlesProcessor] Removing stale watcher ${channel.exchangeCode}:${watcher.symbol}`);
          channel.removeWatcher(watcher);
        }
      }

      // Clean stale aggregators
      for (const aggregator of channel.getAggregators()) {
        const isAggregatorUsedByAnyBot = bots.some(
          (bot) =>
            bot.exchangeAccount.exchangeCode === channel.exchangeCode &&
            `${bot.baseCurrency}/${bot.quoteCurrency}` === aggregator.symbol &&
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

  // @todo maybe queue
  private handleCandle = async (data: CandleEvent) => {
    const { candle, history, symbol, timeframe } = data;

    logger.info(`CandlesProcessor: Received candle ${timeframe} for ${symbol}. Start processing.`);

    const bots = await xprisma.bot.findMany({
      where: {
        timeframe,
        enabled: true,
      },
    });
    logger.info(`CandlesProcessor: ${timeframe}. Found ${bots.length} bots`);

    for (const bot of bots) {
      const botProcessor = await BotProcessing.fromId(bot.id);

      if (botProcessor.isBotStopped()) {
        logger.warn("❗ Cannot run bot process when the bot is disabled");
        continue;
      }

      await botProcessor.process({
        candle,
        candles: history,
      });
      await botProcessor.placePendingOrders();
    }
  };

  /**
   * Destroy and remove the channel from the list.
   * @param exchangeCode
   */
  private removeChannel(channel: CandlesChannel) {
    channel.off("candle", this.handleCandle);
    channel.destroy();

    const channelLengsBefore = this.channels.length;
    this.channels = this.channels.filter((c) => c !== channel);

    // @todo remove and add tests for this
    if (channelLengsBefore === this.channels.length) {
      logger.error(
        {
          channels: this.channels,
          channel,
        },
        `[CandlesProcessor] Cannot remove ${channel.exchangeCode} channel. Reason: not found`,
      );
    }
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
