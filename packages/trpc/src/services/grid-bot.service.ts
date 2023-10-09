import { xprisma, TGridBot } from "@opentrader/db";
import { TRPCError } from "@trpc/server";

export class GridBotService {
  constructor(public bot: TGridBot) {}

  static async fromId(id: number) {
    const bot = await xprisma.bot.grid.findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        exchangeAccount: true,
      },
    });

    return new GridBotService(bot);
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

    return new GridBotService(bot);
  }

  async start() {
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

  async stop() {
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

  assertIsRunning() {
    if (!this.bot.enabled) {
      throw new TRPCError({
        message: "Bot is not enabled",
        code: "CONFLICT",
      });
    }
  }

  assertIsNotAlreadyRunning() {
    if (this.bot.enabled) {
      throw new TRPCError({
        message: "Bot already running",
        code: "CONFLICT",
      });
    }
  }

  assertIsNotAlreadyStopped() {
    if (!this.bot.enabled) {
      throw new TRPCError({
        message: "Bot already stopped",
        code: "CONFLICT",
      });
    }
  }

  assertIsNotProcessing() {
    if (this.bot.processing) {
      throw new TRPCError({
        message: "The bot is busy with the previous processing job",
        code: "CONFLICT",
      });
    }
  }
}
