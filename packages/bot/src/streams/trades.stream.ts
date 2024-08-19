import { EventEmitter } from "node:events";
import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { TBotWithExchangeAccount } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { findStrategy } from "@opentrader/bot-templates/server";
import { getWatchers, getTimeframe } from "@opentrader/processing";
import { decomposeSymbolId } from "@opentrader/tools";
import { BarSize, ExchangeCode } from "@opentrader/types";
import type { TradeEvent } from "../channels/index.js";
import { TradesChannel } from "../channels/index.js";

/**
 * Emits:
 * - trade: TradeEvent
 */
export class TradesStream extends EventEmitter {
  private channels: TradesChannel[] = [];
  private bots: TBotWithExchangeAccount[] = [];

  constructor(bots: TBotWithExchangeAccount[]) {
    super();
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
  async addBot(bot: TBotWithExchangeAccount) {
    const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: {
        id: bot.exchangeAccountId,
      },
    });
    const exchange = exchangeProvider.fromAccount(exchangeAccount);
    const symbol = `${bot.baseCurrency}/${bot.quoteCurrency}`;

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
  async cleanStaleChannels(bots: TBotWithExchangeAccount[]) {
    const botsInUse: Array<{ timeframe: BarSize | null; symbols: string[]; exchangeCodes: ExchangeCode[] }> = [];
    for (const bot of bots) {
      const { strategyFn } = await findStrategy(bot.template);
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
        logger.info(`[TradesConsumer] Removing stale channel ${channel.exchangeCode}`);
        this.removeChannel(channel);
        continue; // no need to check watchers
      }

      // Clean up stale watchers
      for (const watcher of channel.getWatchers()) {
        const isWatcherUsedByAnyBot = botsInUse.some((bot) =>
          bot.symbols.includes(`${channel.exchangeCode}/${watcher.symbol}`),
        );

        if (!isWatcherUsedByAnyBot) {
          logger.info(`[TradesConsumer] Removing stale watcher ${channel.exchangeCode}:${watcher.symbol}`);
          channel.removeWatcher(watcher);
        }
      }
    }
  }

  private handleTrade = async (data: TradeEvent) => {
    this.emit("trade", data);
  };

  /**
   * Destroy and remove the channel from the list.
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
