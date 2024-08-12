import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { TBot } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { findStrategy } from "@opentrader/bot-templates/server";
import type { TradeEvent } from "../channels/index.js";
import { TradesChannel } from "../channels/index.js";
import { processingQueue } from "../queue/index.js";
import { BotTemplate } from "../../../bot-processor/src/index.js";

function getSymbolsToWatch(runPolicy: BotTemplate<any>["runPolicy"], bot: TBot): string[] {
  if (!runPolicy?.watchTrades) {
    return [];
  }

  const symbol = `${bot.baseCurrency}/${bot.quoteCurrency}`;

  let symbols: string[] | string = [];

  if (typeof runPolicy.watchTrades === "string" || Array.isArray(runPolicy.watchTrades)) {
    symbols = runPolicy.watchTrades;
  } else if (typeof runPolicy.watchTrades === "function") {
    symbols = runPolicy.watchTrades(bot);
  }

  if (Array.isArray(symbols)) {
    return symbols;
  } else {
    return [symbols];
  }
}

export class TradesConsumer {
  private channels: TradesChannel[] = [];
  private bots: TBot[] = [];

  constructor(bots: TBot[]) {
    this.bots = bots;
  }

  async create() {
    logger.info(`[TradesConsumer] Creating trades channel for ${this.bots.length} bots`);

    for (const bot of this.bots) {
      await this.addBot(bot);
    }
  }

  /**
   * Subscribes the bot to the trades channel.
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

    const { strategyFn } = await findStrategy(bot.template);
    if (!isWatchingSymbol(strategyFn.runPolicy, bot)) {
      logger.warn(
        `[TradesConsumer]: Skip adding bot [${bot.id}:"${bot.name}"] to the ${exchange.exchangeCode}:${symbol} channel. Reason: No runPolicty for watchTrades.`,
      );
      return;
    }

    let channel = this.channels.find((channel) => channel.exchangeCode === exchange.exchangeCode);
    if (!channel) {
      channel = new TradesChannel(exchange);
      this.channels.push(channel);

      logger.info(`[TradesConsumer] Created ${exchange.exchangeCode}:${symbol} channel`);

      // @todo type
      channel.on("trade", this.handleTrade);
    }

    await channel.add(symbol);
    logger.info(
      `[TradesConsumer]: Subscribed bot [${bot.id}:"${bot.name}"] to the ${exchange.exchangeCode}:${symbol} channel`,
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
        logger.info(`[TradesConsumer] Removing stale channel ${channel.exchangeCode}`);
        this.removeChannel(channel);
        continue; // no need to check watchers
      }

      // Clean up stale watchers
      for (const watcher of channel.getWatchers()) {
        const isWatcherUsedByAnyBot = bots.some(
          (bot) =>
            bot.exchangeAccount.exchangeCode === channel.exchangeCode &&
            `${bot.baseCurrency}/${bot.quoteCurrency}` === watcher.symbol,
        );

        if (!isWatcherUsedByAnyBot) {
          logger.info(`[TradesConsumer] Removing stale watcher ${channel.exchangeCode}:${watcher.symbol}`);
          channel.removeWatcher(watcher);
        }
      }
    }
  }

  private handleTrade = async (data: TradeEvent) => {
    const { trade, symbol } = data;

    logger.info(`[TradesConsumer] New trade: ${trade.side} ${trade.amount} of ${symbol}. Start processing.`);

    const enabledBots = await xprisma.bot.custom.findMany({
      where: {
        enabled: true,
      },
    });
    const targetBots: TBot[] = [];

    for (const bot of enabledBots) {
      const { strategyFn } = await findStrategy(bot.template);

      if (getSymbolsToWatch(strategyFn.runPolicy, bot)) {
        targetBots.push(bot);
      }
    }

    logger.info(`[TradesConsumer]: Targeted ${targetBots.length} bots`);

    for (const bot of targetBots) {
      if (!bot.enabled) {
        logger.warn("❗ Cannot run bot process when the bot is disabled");
        continue;
      }

      processingQueue.push({
        type: "onPublicTrade",
        bot,
        trade,
      });
    }
  };

  /**
   * Destroy and remove the channel from the list.
   * @param exchangeCode
   */
  private removeChannel(channel: TradesChannel) {
    channel.off("trade", this.handleTrade);
    channel.destroy();

    this.channels = this.channels.filter((c) => c !== channel);
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
