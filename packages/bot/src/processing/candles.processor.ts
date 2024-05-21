import { exchangeProvider } from "@opentrader/exchanges";
import { logger } from "@opentrader/logger";
import type { TBot } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { BotProcessing } from "@opentrader/processing";
import type { BarSize } from "@opentrader/types";
import { findTemplate } from "@opentrader/bot-templates";
import type { CandleEvent } from "../channels";
import { CandlesChannel } from "../channels";

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
        continue;
      }

      const template = findTemplate(bot.template);
      await channel.add(
        symbol,
        bot.timeframe as BarSize,
        template.requiredHistory,
      );
    }
  }

  // @todo reload(bots: TBot[]) method for subscribing to new channel when new bot is created

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
      logger.info(`Exec bot #${bot.id} template`);
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

      logger.info(`Exec bot #${bot.id} template done`);
    }
  }

  destroy() {
    for (const channel of this.channels) {
      channel.destroy();
    }
  }
}
