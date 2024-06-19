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
    logger.info(
      `CandlesProcessor: Found ${this.bots.length} timeframe based bots`,
    );

    for (const bot of this.bots) {
      await this.addBot(bot);
    }
  }

  async addBot(bot: TBot) {
    const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: {
        id: bot.exchangeAccountId,
      },
    });
    const exchange = exchangeProvider.fromAccount(exchangeAccount);

    let channel = this.channels.find(
      (channel) => channel.exchangeCode === exchange.exchangeCode,
    );
    if (!channel) {
      channel = new CandlesChannel(exchange);
      this.channels.push(channel);

      logger.info(
        `CandlesProcessor: Created channel for ${exchange.exchangeCode}`,
      );

      // @todo type
      channel.on("candle", (data: CandleEvent) => {
        void this.handleCandle(data);
      });
    }

    const symbol = `${bot.baseCurrency}/${bot.quoteCurrency}`;

    if (bot.timeframe === null) {
      logger.warn(
        `CandlesProcessor: Bot ${bot.id} is not timeframe based. Skip adding to channel.`,
      );
      return;
    }

    const { strategyFn } = await findStrategy(bot.template);
    await channel.add(
      symbol,
      bot.timeframe as BarSize,
      strategyFn.requiredHistory,
    );
  }

  // @todo maybe queue
  private async handleCandle(data: CandleEvent) {
    const { candle, history, symbol, timeframe } = data;

    logger.info(
      `CandlesProcessor: Received candle ${timeframe} for ${symbol}. Start processing.`,
    );

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
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
