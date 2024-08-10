import { PrismaClient } from "@prisma/client";
import { MarketData, StrategyAction, StrategyError, StrategyTriggerEventType } from "@opentrader/types";
import { gridBotModel } from "./extension/models/grid-bot.model.js";
import { orderModel } from "./extension/models/order.model.js";
import { smartTradeModel } from "./extension/models/smart-trade.model.js";
import { customBotModel } from "./extension/models/custom-bot.model.js";

function newPrismaClientInstance() {
  // console.log("❕ DB: Created new instance of PrismaClient");
  return new PrismaClient();
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
  xprisma: typeof xprismaClient;
};

const prismaClient = globalForPrisma.prisma || newPrismaClientInstance();

const xprismaClient = prismaClient.$extends({
  name: "xprisma",
  model: {
    bot: {
      grid: gridBotModel(prismaClient),
      custom: customBotModel(prismaClient),

      /**
       * Additional helpers for bot model
       */
      async setProcessing(value: boolean, botId: number) {
        return prismaClient.bot.update({
          where: {
            id: botId,
          },
          data: {
            processing: value,
          },
        });
      },
      async updateState(state: object, botId: number) {
        return prismaClient.bot.update({
          where: {
            id: botId,
          },
          data: {
            state: JSON.stringify(state),
          },
        });
      },
    },
    botLog: {
      async log(params: {
        startedAt: Date;
        endedAt: Date;
        botId: number;
        action: StrategyAction;
        triggerEventType?: StrategyTriggerEventType;
        context?: MarketData;
        error?: StrategyError;
      }) {
        return prismaClient.botLog.create({
          data: {
            action: params.action,
            triggerEventType: params.triggerEventType,
            context: JSON.stringify(params.context),
            error: JSON.stringify(params.error),
            startedAt: params.startedAt,
            endedAt: params.endedAt,
            bot: {
              connect: {
                id: params.botId,
              },
            },
          },
        });
      },
    },
    order: orderModel(prismaClient),
    smartTrade: smartTradeModel(prismaClient),
  },
  result: {
    exchangeAccount: {
      credentials: {
        needs: {
          exchangeCode: true,
          apiKey: true,
          secretKey: true,
          password: true,
          isDemoAccount: true,
        },
        compute(exchangeAccount) {
          return {
            code: exchangeAccount.exchangeCode,
            apiKey: exchangeAccount.apiKey,
            secretKey: exchangeAccount.secretKey,
            password: exchangeAccount.password,
            isDemoAccount: exchangeAccount.isDemoAccount,
          };
        },
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prismaClient;
  globalForPrisma.xprisma = xprismaClient;
}

export const xprisma = globalForPrisma.xprisma || xprismaClient;
