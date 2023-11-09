import { BotProcessor } from "@opentrader/bot-processor";
import { arithmeticGridBot, GridBotConfig } from "@opentrader/bot-templates";
import { exchanges } from "@opentrader/exchanges";
import { xprisma, TGridBot } from "@opentrader/db";
import { ExchangeCode } from "@opentrader/types";

import { GridBotStoreAdapter } from "./grid-bot-store-adapter";

export class GridBotProcessor {
  constructor(private bot: TGridBot) {}

  static async fromId(id: number) {
    const bot = await xprisma.bot.grid.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        exchangeAccount: true,
      },
    });

    return new GridBotProcessor(bot);
  }

  static async fromSmartTradeId(smartTradeId: number) {
    const bot = await xprisma.bot.grid.findFirstOrThrow({
      where: {
        smartTrades: {
          some: {
            id: smartTradeId,
          },
        },
      },
      include: {
        exchangeAccount: true,
      },
    });

    return new GridBotProcessor(bot);
  }

  private async start() {
    this.bot = await xprisma.bot.grid.update({
      where: {
        id: this.bot.id,
      },
      data: {
        enabled: true,
      },
      include: {
        exchangeAccount: true,
      },
    });
  }

  private async stop() {
    this.bot = await xprisma.bot.grid.update({
      where: {
        id: this.bot.id,
      },
      data: {
        enabled: false,
      },
      include: {
        exchangeAccount: true,
      },
    });
  }

  async processCommand(command: "start" | "stop" | "process") {
    if (this.isBotProcessing()) {
      console.warn(
        `Cannot execute "${command}()" command. The bot is busy right now by the previous processing job.`,
      );
      return;
    }

    const processor = await this.getProcessor();

    await xprisma.bot.grid.setProcessing(true, this.bot.id);

    try {
      if (command === "start") {
        await processor.start();
      } else if (command === "stop") {
        await processor.stop();
      } else if (command === "process") {
        await processor.process();
      }
    } catch (err) {
      await xprisma.bot.grid.setProcessing(false, this.bot.id);

      throw err;
    }

    await xprisma.bot.grid.setProcessing(false, this.bot.id);
  }

  async processStartCommand() {
    await this.processCommand("start");
  }

  async processStopCommand() {
    await this.processCommand("stop");
  }

  async process() {
    await this.processCommand("process");
  }

  isBotRunning() {
    return this.bot.enabled;
  }

  isBotStopped() {
    return !this.bot.enabled;
  }

  isBotProcessing() {
    return this.bot.processing;
  }

  private async getProcessor() {
    const exchange = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: {
        id: this.bot.exchangeAccountId,
      },
    });

    const credentials = {
      ...exchange.credentials,
      code: exchange.credentials.code as ExchangeCode, // workaround for casting string literal to `ExchangeCode`
      password: exchange.password || "",
    };

    const exchangeService = exchanges[exchange.exchangeCode](credentials);

    const configuration: GridBotConfig = {
      id: this.bot.id,
      baseCurrency: this.bot.baseCurrency,
      quoteCurrency: this.bot.quoteCurrency,
      gridLines: this.bot.settings.gridLines,
    };

    const storeAdapter = new GridBotStoreAdapter(xprisma, this.bot, () =>
      this.stop(),
    );

    const processor = BotProcessor.create({
      store: storeAdapter,
      exchange: exchangeService,
      botConfig: configuration,
      botTemplate: arithmeticGridBot,
    });

    return processor;
  }
}
