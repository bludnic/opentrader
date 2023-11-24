import { BotProcessor } from "@opentrader/bot-processor";
import type { GridBotConfig } from "@opentrader/bot-templates";
import { arithmeticGridBot } from "@opentrader/bot-templates";
import { exchangeProvider } from "@opentrader/exchanges";
import type { TGridBot } from "@opentrader/db";
import { xprisma } from "@opentrader/db";
import { SmartTradeProcessor } from "#processing/smart-trade";
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
    console.log("🤖 @opentrader/processing: GridBotProcessor.process() start");
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
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- @todo switch/case
      } else if (command === "process") {
        await processor.process();
      }
    } catch (err) {
      await xprisma.bot.grid.setProcessing(false, this.bot.id);

      throw err;
    }

    await xprisma.bot.grid.setProcessing(false, this.bot.id);
    console.log("🤖 @opentrader/processing: GridBotProcessor.process() end");
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
    const exchangeAccount = await xprisma.exchangeAccount.findUniqueOrThrow({
      where: {
        id: this.bot.exchangeAccountId,
      },
    });

    const exchange = exchangeProvider.fromAccount(exchangeAccount);

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
      exchange,
      botConfig: configuration,
      botTemplate: arithmeticGridBot,
    });

    return processor;
  }

  async placePendingOrders() {
    console.log(
      "🤖 @opentrader/processing: GridBotProcessor.placePendingOrders() start",
    );
    const smartTrades = await xprisma.smartTrade.findMany({
      where: {
        type: "Trade",
        orders: {
          some: {
            status: "Idle",
          },
        },
        bot: {
          id: this.bot.id,
        },
      },
      include: {
        exchangeAccount: true,
        orders: true,
      },
    });

    for (const smartTrade of smartTrades) {
      const { exchangeAccount } = smartTrade;

      const smartTradeService = new SmartTradeProcessor(
        smartTrade,
        exchangeAccount,
      );
      await smartTradeService.placeNext();
    }

    console.log(
      "🤖 @opentrader/processing: GridBotProcessor.placePendingOrders() end",
    );
  }
}
